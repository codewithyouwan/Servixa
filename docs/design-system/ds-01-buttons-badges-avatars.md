# Design System — Buttons, Badges, Avatars, Tags, Chips

Tokens referenced from `docs/marketing-site/ui-spec/ui-00-design-tokens.md`. Sizes below are the app-context defaults — generally one step more compact than the marketing site's, since authenticated screens prioritize density and task-completion speed over the marketing site's spacious persuasion-first layouts.

## Buttons

| Variant | Fill | Border | Text | Height | Radius | States |
|---|---|---|---|---|---|---|
| **Primary** | `accent-600` | none | `white`, 14px medium | 40px (default) / 44px (form-submit) | `radius-sm` (8px) | Hover: `accent-700`. Focus: 2px `accent-600` outline, 2px offset. Disabled: `neutral-300` fill, `neutral-500` text. Loading: label replaced by a small inline spinner, button stays same width (no layout shift). |
| **Secondary/Outline** | transparent | 1px `neutral-300` | `ink-900`, 14px medium | 40px | `radius-sm` | Hover: `neutral-100` background. Focus: 2px `accent-600` outline. |
| **Danger** | `red-600` | none | `white`, 14px medium | 40px | `radius-sm` | Hover: darken 10%. Focus: 2px `red-600` outline (the one button whose focus ring matches its own fill rather than the accent, so a keyboard user always sees "this action is destructive" reinforced even in the focus state). Always paired with a confirmation step (see `ds-06-dialogs-notifications.md`) — never a direct one-click destructive action. |
| **Ghost/Text** | none | none | `ink-900` (or `neutral-700` for a lower-emphasis action), underline on hover | 32-40px (line-height only) | — | Used for tertiary actions inside a card or table row ("View details," "Edit") |
| **Icon Button** | transparent by default, `neutral-100` on hover | none | `neutral-700` icon, 20px | 36×36px minimum (meets the 44×44px touch-target guideline when tap padding is included on touch devices) | `radius-sm` | Always carries an `aria-label` — icon-only buttons without one are a hard accessibility failure per the platform's own priority-1 rule, not a style suggestion |

**Rule carried over from the marketing site**: exactly one Primary button visible per view/card context — a table row, for instance, gets one Primary action (e.g. "Accept Lead") and any others render as Ghost or Icon buttons, never two Primary buttons competing in the same row.

## Badges

| Type | Construction | States |
|---|---|---|
| **Verification Badge** | Pill, 24px tall, small icon + label. `green-600`-on-tint for "Verified," `neutral-500`-on-`neutral-100` for "Pending," `red-600`-on-tint for "Rejected" | Read-only, never interactive |
| **Trust Score Badge** | Compact pill showing a numeral (e.g. "92") plus a small tier label ("Top Rated") when the score crosses a threshold — same `green-600` reserved-for-trust convention as the marketing site | Read-only |
| **Status Badge** (project/lead/quote status) | Pill, 14px text, color mapped semantically — `neutral-500`-on-tint for Draft/Sent, `accent-600`-on-tint for Active/In Progress, `green-600`-on-tint for Completed/Accepted, `red-600`-on-tint for Cancelled/Declined | Never conveys status by color alone — the text label is always present, per the accessibility rule against color-only meaning |

## Avatars

- **Avatar**: circular, `radius-full`, default 32px (table rows/lists) or 48px (profile headers). Fallback state: initials on a deterministic neutral-tinted background (derived from the person's name, not random) when no photo exists — never a generic silhouette icon, which reads as broken/placeholder rather than intentional.
- **Avatar Group**: up to 3 avatars overlapping by ~30%, with a "+N" circular counter in `neutral-100`/`neutral-700` if more exist — used for "3 contractors matched to this project" type displays.

## Tags

- Service-category label, rectangular pill, `radius-full`, `neutral-100` background, `ink-900` text, 12px padding, 13px text — same construction as the marketing site's category tag, reused directly rather than redesigned.

## Chips

- Removable variant of a Tag — same visual base, plus a small "×" icon button (16px) on the right edge, used exclusively in active-filter contexts (e.g. a contractor search screen showing "Kitchen ×  Austin, TX ×" as currently-applied filters above the results list).
