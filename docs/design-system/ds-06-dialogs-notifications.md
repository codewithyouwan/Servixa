# Design System — Dialogs & Notifications

## Confirmation Modal
- **Construction**: centered overlay, `white` card, `radius-lg` (20px), max-width 440px, `shadow-lg`, sitting above a `neutral-900`-at-40%-opacity backdrop that dims and blurs nothing behind it (a plain dim, not a blur, to keep the effect calm rather than heavy-handed).
- **Contents**: a 20px semibold title ("Accept this quote?"), a 14px `neutral-700` explanatory line, and two right-aligned buttons at the bottom — Ghost "Cancel" and Primary "Confirm," in that left-to-right order (cancel first) since that matches the reading-order convention most users already expect and reduces accidental confirmation from a habitual rightmost-click.
- **Dismissal**: closable via the Cancel button, an "×" Icon Button top-right, the Escape key, or a backdrop click — all four, since a modal with only one exit path is a common frustration point.
- **Focus management**: focus moves to the modal's first focusable element on open and is trapped within the modal until it closes, then returns to whatever element triggered it — standard modal accessibility behavior, non-negotiable per the platform's accessibility priority.

## Delete Modal
- A specific variant of the Confirmation Modal: the "Confirm" button is swapped for a Danger Button reading the specific action ("Delete Project," not a generic "Delete"), and the explanatory line names the consequence plainly ("This can't be undone — all quotes and messages tied to this project will be removed too") rather than a generic warning, since a destructive action deserves a specific enough description that the user isn't guessing at scope.

## Document Preview Modal
- **Construction**: larger than the standard confirmation modal — up to 720px wide, showing the uploaded license/insurance document (image or PDF-rendered-as-image) at a readable size, with Approve/Reject actions (and a rejection-reason text input revealed only when Reject is chosen) fixed at the bottom. Used exclusively in the admin verification queue.

## Toast
- **Construction**: fixed bottom-right (desktop) or bottom, full-width-minus-margin (mobile), stacking upward if more than one is active. `white` background, 1px `neutral-300` border, `radius-md`, `shadow-md`, a small leading status icon (`green-600` check for success, `red-600` for error, `neutral-500` info), a 14px message, and a small "×" dismiss.
- **Timing**: auto-dismisses after 4 seconds for success/info toasts; error toasts persist until manually dismissed, since an error a user didn't get to read before it vanished is worse than a slightly longer-lived banner.
- **Accessibility**: rendered in an `aria-live="polite"` region (`aria-live="assertive"` for errors) so screen-reader users receive the same feedback a sighted user gets from the toast appearing.

## Alert / Banner
- **Construction**: full-width within its container (page-level or card-level), `radius-md`, no shadow, a colored left border (4px) matching its semantic type — `accent-600` for informational, `red-600` for a blocking warning ("Your account is pending verification — you can't receive leads yet"), `green-600` for a positive confirmation banner. Background is always the corresponding tint (`neutral-100`-adjacent), never a solid saturated fill, keeping banners calm rather than alarm-styled even when the message is serious.
- **Persistence**: unlike a Toast, a Banner stays visible until its underlying condition resolves (e.g. it disappears automatically once verification completes) rather than being manually dismissed away from an unresolved state — a homeowner shouldn't be able to dismiss "your project needs a budget before it can be matched" and forget about it.

## Notification Bell + Dropdown
- **Bell**: an Icon Button in the navbar with a small `accent-600` dot badge when unread notifications exist (a dot, not a numeral, to avoid the visual noise of a growing unread count — the dropdown itself shows detail).
- **Dropdown panel**: `white`, `radius-md`, `shadow-md`, up to ~6 recent Notification List Items (per `ds-02-cards.md`) with a "View All" link at the bottom routing to a full notifications page if one exists for MVP, or simply closing the dropdown if not.
