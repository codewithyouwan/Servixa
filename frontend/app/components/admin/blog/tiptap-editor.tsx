"use client";

/**
 * TipTap-based rich text editor for blog post bodies. The toolbar is
 * deliberately limited to exactly the tags the backend's bleach allowlist
 * accepts (see app/blog/services/blog_service.py:_ALLOWED_TAGS on the
 * backend) -- p/br/hr/h1-4/strong/em/s/code/pre/ul/ol/li/blockquote/a/img.
 * Nothing here can produce a tag the server will strip out on save.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import { DOMParser as ProseMirrorDOMParser } from "@tiptap/pm/model";
import StarterKit from "@tiptap/starter-kit";
import TiptapImage from "@tiptap/extension-image";
import TiptapLink from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import { markdownToAllowedHtml } from "@/lib/blog/markdown-to-html";
import {
  Bold,
  Code,
  Heading2,
  Heading3,
  Heading4,
  ImageIcon,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Minus,
  Quote,
  Redo2,
  SquareCode,
  Strikethrough,
  Undo2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface TiptapEditorProps {
  content: Record<string, unknown>;
  onChange: (json: Record<string, unknown>, html: string) => void;
  onUploadImage: (file: File) => Promise<string>;
  placeholder?: string;
}

const FORMATTED_TAG_SELECTOR = "h1,h2,h3,h4,h5,h6,strong,b,em,i,ul,ol,blockquote,code,pre,a,img";

/** True if pasted HTML carries real semantic formatting (a heading, bold,
 * a list, etc.) rather than just plain text wrapped in styling spans --
 * macOS puts an `text/html` flavor on the clipboard for almost any copy,
 * even from a plain-text source, so its mere presence isn't enough to
 * tell "real rich text from Google Docs/Word" apart from "plain text that
 * happens to have an html wrapper". */
function hasRealFormatting(html: string): boolean {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.querySelector(FORMATTED_TAG_SELECTOR) !== null;
}

function plainTextFromHtml(html: string): string {
  const container = document.createElement("div");
  container.innerHTML = html;
  return container.textContent ?? "";
}

function ToolbarButton({
  active,
  disabled,
  onClick,
  label,
  children,
}: {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon-sm"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
    >
      {children}
    </Button>
  );
}

function Toolbar({ editor, onInsertImage }: { editor: Editor; onInsertImage: () => void }) {
  const setLink = useCallback(() => {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/40 p-1.5">
      <ToolbarButton
        label="Bold"
        active={editor.isActive("bold")}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold />
      </ToolbarButton>
      <ToolbarButton
        label="Italic"
        active={editor.isActive("italic")}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic />
      </ToolbarButton>
      <ToolbarButton
        label="Strikethrough"
        active={editor.isActive("strike")}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough />
      </ToolbarButton>
      <ToolbarButton
        label="Inline code"
        active={editor.isActive("code")}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Heading 2"
        active={editor.isActive("heading", { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 3"
        active={editor.isActive("heading", { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 />
      </ToolbarButton>
      <ToolbarButton
        label="Heading 4"
        active={editor.isActive("heading", { level: 4 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
      >
        <Heading4 />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Bullet list"
        active={editor.isActive("bulletList")}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List />
      </ToolbarButton>
      <ToolbarButton
        label="Numbered list"
        active={editor.isActive("orderedList")}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered />
      </ToolbarButton>
      <ToolbarButton
        label="Quote"
        active={editor.isActive("blockquote")}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote />
      </ToolbarButton>
      <ToolbarButton
        label="Code block"
        active={editor.isActive("codeBlock")}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      >
        <SquareCode />
      </ToolbarButton>
      <ToolbarButton label="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton label="Add link" active={editor.isActive("link")} onClick={setLink}>
        <Link2 />
      </ToolbarButton>
      <ToolbarButton
        label="Remove link"
        disabled={!editor.isActive("link")}
        onClick={() => editor.chain().focus().unsetLink().run()}
      >
        <Link2Off />
      </ToolbarButton>
      <ToolbarButton label="Insert image" onClick={onInsertImage}>
        <ImageIcon />
      </ToolbarButton>

      <span className="mx-1 h-5 w-px bg-border" />

      <ToolbarButton
        label="Undo"
        disabled={!editor.can().undo()}
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 />
      </ToolbarButton>
      <ToolbarButton
        label="Redo"
        disabled={!editor.can().redo()}
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 />
      </ToolbarButton>
    </div>
  );
}

export function TiptapEditor({ content, onChange, onUploadImage, placeholder }: TiptapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4] } }),
      TiptapImage.configure({ HTMLAttributes: { class: "" } }),
      TiptapLink.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: placeholder ?? "Start writing…" }),
      CharacterCount,
    ],
    content,
    editorProps: {
      attributes: {
        class: "blog-content min-h-[420px] px-4 py-4 focus:outline-none",
      },
      // Real rich text (copied from Google Docs, Word, Notion, a web page)
      // already carries HTML that TipTap's default handling parses
      // correctly -- headings, bold, lists, etc. come through untouched.
      // This only intercepts the other common case: plain text that's
      // *written* in markdown (a chat reply, a .md file, Slack, Notes)
      // and would otherwise paste as literal `**`/`#` characters.
      handlePaste(view, event) {
        const clipboardData = event.clipboardData;
        if (!clipboardData) return false;

        const html = clipboardData.getData("text/html");
        if (html && hasRealFormatting(html)) return false;

        const text = clipboardData.getData("text/plain") || (html ? plainTextFromHtml(html) : "");
        if (!text.trim()) return false;

        const converted = markdownToAllowedHtml(text);
        const container = document.createElement("div");
        container.innerHTML = converted;
        const slice = ProseMirrorDOMParser.fromSchema(view.state.schema).parseSlice(container, {
          preserveWhitespace: false,
        });
        view.dispatch(view.state.tr.replaceSelection(slice).scrollIntoView());
        event.preventDefault();
        return true;
      },
    },
    onUpdate: ({ editor: e }) => {
      onChange(e.getJSON() as Record<string, unknown>, e.getHTML());
    },
  });

  // Keep the editor in sync if the parent swaps in a different post's
  // content (e.g. after the initial admin fetch resolves on the edit page).
  const lastLoadedRef = useRef<Record<string, unknown> | null>(null);
  useEffect(() => {
    if (!editor) return;
    if (content === lastLoadedRef.current) return;
    lastLoadedRef.current = content;
    const current = editor.getJSON();
    if (JSON.stringify(current) !== JSON.stringify(content)) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [content, editor]);

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = "";
      if (!file || !editor) return;
      setUploadError(null);
      setUploading(true);
      try {
        const url = await onUploadImage(file);
        editor.chain().focus().setImage({ src: url, alt: file.name }).run();
      } catch (err) {
        setUploadError(err instanceof Error ? err.message : "Image upload failed");
      } finally {
        setUploading(false);
      }
    },
    [editor, onUploadImage],
  );

  if (!editor) {
    return <div className="min-h-[460px] animate-pulse rounded-lg border border-border bg-muted/30" />;
  }

  return (
    <div className={cn("rounded-lg border border-border bg-background")}>
      <Toolbar editor={editor} onInsertImage={() => fileInputRef.current?.click()} />
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
      <EditorContent editor={editor} />
      <div className="flex items-center justify-between border-t border-border px-4 py-1.5 text-xs text-muted-foreground">
        <span>
          {uploading
            ? "Uploading image…"
            : uploadError
              ? <span className="text-destructive">{uploadError}</span>
              : " "}
        </span>
        <span>{editor.storage.characterCount?.words() ?? 0} words</span>
      </div>
    </div>
  );
}
