/**
 * Minimal markdown -> HTML converter, scoped to exactly the tags the
 * backend's bleach allowlist accepts (see
 * app/blog/services/blog_service.py:_ALLOWED_TAGS): h1-h4, p, br, hr,
 * strong, em, s, code, pre, ul, ol, li, blockquote, a, img.
 *
 * Why this exists: TipTap already parses real HTML on paste (copying
 * formatted text from Google Docs, Word, Notion, or a web page carries
 * HTML on the clipboard, and the editor's schema-based parser turns
 * matching tags into real headings/bold/lists automatically -- nothing
 * special needed, that's just how rich-text paste works). But copying
 * PLAIN TEXT that merely *looks* like markdown (from a chat message, a
 * .md/.txt file, Notes, Slack) puts no HTML on the clipboard, so `**bold**`
 * pastes as the literal characters. This converter is what the editor's
 * paste handler (tiptap-editor.tsx) runs on plain-text paste instead, so
 * that markdown-formatted plain text ends up correctly formatted too.
 *
 * Deliberately not a full CommonMark implementation -- just the constructs
 * that map onto the allowed tag set above. Anything else (tables, nested
 * blockquotes, setext headings, etc.) passes through as plain paragraphs
 * rather than erroring.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Inline spans: code, images, links, bold, italic, strikethrough. Applied
 * to already-HTML-escaped text, in an order chosen so `**bold**` doesn't
 * get eaten by the single-`*`/`_` italic pass first. */
function renderInline(escaped: string): string {
  let s = escaped;

  // Inline code first, so markup characters inside `code` aren't touched.
  const codeSpans: string[] = [];
  s = s.replace(/`([^`]+)`/g, (_m, code: string) => {
    codeSpans.push(`<code>${code}</code>`);
    return ` ${codeSpans.length - 1} `;
  });

  // Images before links (both use [..](..) shape, image has a leading `!`).
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (_m, alt: string, url: string) => `<img src="${url}" alt="${alt}">`);
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, label: string, url: string) => `<a href="${url}">${label}</a>`);

  // Bold before italic so `**x**` isn't first split into two `*x*` matches.
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/__([^_]+)__/g, "<strong>$1</strong>");
  s = s.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  s = s.replace(/\b_([^_]+)_\b/g, "<em>$1</em>");

  s = s.replace(/~~([^~]+)~~/g, "<s>$1</s>");

  // Restore inline code spans.
  s = s.replace(/ (\d+) /g, (_m, i: string) => codeSpans[Number(i)]);

  return s;
}

const HEADING_RE = /^(#{1,4})\s+(.*)$/;
const HR_RE = /^(?:-{3,}|\*{3,}|_{3,})$/;
const UL_RE = /^[-*+]\s+(.*)$/;
const OL_RE = /^\d+[.)]\s+(.*)$/;
const QUOTE_RE = /^>\s?(.*)$/;
const FENCE_RE = /^```/;

export function markdownToAllowedHtml(markdown: string): string {
  const lines = markdown.replace(/\r\n?/g, "\n").split("\n");
  const out: string[] = [];

  let i = 0;
  let paragraphBuf: string[] = [];
  let listBuf: { type: "ul" | "ol"; items: string[] } | null = null;

  function flushParagraph() {
    if (paragraphBuf.length === 0) return;
    out.push(`<p>${renderInline(escapeHtml(paragraphBuf.join(" ")))}</p>`);
    paragraphBuf = [];
  }
  function flushList() {
    if (!listBuf) return;
    const items = listBuf.items.map((item) => `<li>${renderInline(escapeHtml(item))}</li>`).join("");
    out.push(listBuf.type === "ul" ? `<ul>${items}</ul>` : `<ol>${items}</ol>`);
    listBuf = null;
  }
  function flushBlocks() {
    flushParagraph();
    flushList();
  }

  while (i < lines.length) {
    const line = lines[i];

    if (FENCE_RE.test(line)) {
      flushBlocks();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !FENCE_RE.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      out.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
      i++; // skip closing fence
      continue;
    }

    if (line.trim() === "") {
      flushBlocks();
      i++;
      continue;
    }

    const heading = line.match(HEADING_RE);
    if (heading) {
      flushBlocks();
      const level = heading[1].length; // 1-4, matches the editor's configured heading levels
      out.push(`<h${level}>${renderInline(escapeHtml(heading[2].trim()))}</h${level}>`);
      i++;
      continue;
    }

    if (HR_RE.test(line.trim())) {
      flushBlocks();
      out.push("<hr>");
      i++;
      continue;
    }

    const quote = line.match(QUOTE_RE);
    if (quote) {
      flushBlocks();
      const quoteLines = [quote[1]];
      i++;
      while (i < lines.length && QUOTE_RE.test(lines[i])) {
        quoteLines.push((lines[i].match(QUOTE_RE) as RegExpMatchArray)[1]);
        i++;
      }
      out.push(`<blockquote><p>${renderInline(escapeHtml(quoteLines.join(" ")))}</p></blockquote>`);
      continue;
    }

    const ul = line.match(UL_RE);
    if (ul) {
      if (!listBuf || listBuf.type !== "ul") {
        flushBlocks();
        listBuf = { type: "ul", items: [] };
      }
      listBuf.items.push(ul[1]);
      i++;
      continue;
    }

    const ol = line.match(OL_RE);
    if (ol) {
      if (!listBuf || listBuf.type !== "ol") {
        flushBlocks();
        listBuf = { type: "ol", items: [] };
      }
      listBuf.items.push(ol[1]);
      i++;
      continue;
    }

    // Plain text line -- part of the current paragraph.
    flushList();
    paragraphBuf.push(line.trim());
    i++;
  }

  flushBlocks();
  return out.join("");
}
