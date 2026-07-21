# Design System — Forms

Base input primitives (text input, textarea, select) are shared directly from `docs/marketing-site/ui-spec/ui-01-components.md` — same height, border, radius, label-above, error-below construction. This document covers form composition (which fields, in what order, with what validation) rather than re-specifying the primitives.

Governing rules, per the accessibility guidance pulled from the design database and already established on the marketing site: every field has a real, visible `<label>` (never placeholder-only), validation runs on blur rather than only at submit, errors render inline beneath their field in `red-600` with an icon (never color alone), and a submit action always shows a loading state followed by explicit success or error feedback — a button that goes quiet after being clicked is a hard usability failure, not a minor polish gap.

## Project Form (create/edit)
**Fields, in order**: Service category (select, triggers category-specific follow-up fields if needed), Project title (text), Description (textarea, with an inline "Let AI help me write this" Ghost button beside the label — routes into the AI Project Assistant flow), Budget range (a dual min/max input pair, or a slider — either works; a dual input is simpler to build and test for MVP), Location (address input with autocomplete, per the Maps integration decided in the architecture docs), Desired timeline (select: ASAP/1-3 months/3-6 months/Flexible), Photo/video upload (a drag-and-drop zone plus a file picker, showing thumbnail previews with a remove option per file).
**Layout**: single column, max-width ~640px, generous 24px gaps between fields — even though this is an app form, project creation is a considered, one-time-per-project action, so it gets more breathing room than a dense admin form would.
**Submit behavior**: "Save Draft" (Ghost) and "Publish Project" (Primary) as two distinct actions, matching the `draft → open` status transition in the database schema — publishing is what triggers matching, so it's deliberately a separate, more committed action than saving.

## Profile Form
**Two variants sharing one shell**: Homeowner (name, address, avatar upload) and Contractor (business name, description, service-area zip codes as a Chip-based multi-input, service categories as a multi-select rendered as Chips, avatar/cover photo upload).
**Layout**: single column, 640px max-width, fields grouped under small section labels ("Basic Info," "Service Areas") when the contractor variant's field count gets long enough to benefit from grouping.

## Contractor Verification Upload Form
**Kept separate from Profile Form** deliberately, since it has its own review-state lifecycle (pending/approved/rejected per document) that a general profile edit doesn't have.
**Fields**: a repeated upload block per document type (License, Insurance, Business Registration), each showing: file picker/drag-drop zone, current Status Badge (Not Submitted/Pending Review/Approved/Rejected), and — if rejected — an admin-entered rejection reason displayed as an inline `red-600` alert directly above that document's re-upload zone.

## Quote Form
**Fields**: Amount (currency input, formatted with the project's currency), Scope of work (textarea, with an inline "Draft with AI" Ghost button per the AI Proposal Drafting feature), Estimated timeline (number input + unit select, e.g. "14 days"), a read-only summary of the project it's attached to pinned above the form so the contractor always has context while filling it in.
**Submit behavior**: "Save Draft" and "Submit Quote," same pairing logic as the Project Form.

## Auth Forms
**Shared shell**: centered card, max-width 400px, logo above the form, single-column fields.
- **Login**: email/phone toggle, password, "Forgot password" Ghost link, Primary "Log In" button, a divider ("or") above a Google OAuth button (outline, Google logo + "Continue with Google").
- **Register**: role selection as the very first step (two large tappable cards — "I'm a Homeowner" / "I'm a Contractor" — not a dropdown, since this is the single most consequential choice in the form and deserves more visual weight than a form field), then the standard email/password + OTP-alternative fields.
- **OTP Verify**: a 6-box digit input (each box auto-advances focus to the next on entry), a "Resend code" Ghost link that disables itself with a visible countdown for the rate-limit window described in `docs/architecture/04-authentication-and-roles.md`.

## Review Form
**Fields**: a 5-star rating input (large, tappable stars, 32px each — this is the one input in the whole system allowed a more playful, larger touch target, since a rating is meant to feel like a quick, low-friction gesture) and a review body textarea. Only rendered at all when the underlying project's status is `completed` — the form simply doesn't exist in the UI otherwise, rather than existing in a disabled state, since an always-visible-but-disabled review form would misleadingly suggest reviewing is possible before it is.

## Message Composer
**Fields**: a single auto-growing textarea (starts at one line, expands up to ~5 lines before scrolling internally) plus an attachment Icon Button and a Primary send button, laid out in a single row pinned to the bottom of the conversation thread. Enter submits, Shift+Enter inserts a newline — standard chat-input convention users already expect.
