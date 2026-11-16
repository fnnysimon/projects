# Answer key: every planted flaw (shadcn/ui version)

Spoilers! Use this to score what each skill found.

Already fixed (don't count these): visible focus, text contrast,
white-on-yellow, complete dark mode, form labels.

## 1. Design system: bypassing shadcn

- **CTA overrides the Button:** `rounded-none bg-yellow-400 uppercase font-extrabold shadow-[3px_3px_0_#000]`. A whole visual language outside the tokens, and the yellow isn't a token.
- **Team plan button** forces `rounded-full`, while every other button is `rounded-md`.
- **Tasks card** forces `rounded-2xl` and a custom indigo shadow (legacy `.feature-card`), and its title is `text-xl text-primary` while the others are `text-2xl`.
- **Badges:** "Beta" is a custom `rounded-sm uppercase text-pink-700` badge, not a shadcn variant. The "NEW" badge is 10px.
- **Improvised Alert variants:** shadcn ships only `default` and `destructive`. "Success" is hand-coloured **sky blue** and "Warning" is amber with a **dashed** border. Neither is a token or variant.
- **Raw palette colours** used instead of tokens: `slate-600`, `indigo-*`, `pink-*`, `sky-*`, `amber-*`, `yellow-*`.
- **Icon buttons** in the header use `h-6 w-6` instead of `size="icon"` (`h-10 w-10`).
- **Featured plan** uses `scale-105` (blurry text, overlap) and is the only centered card.
- **Massive class duplication:** every button repeats the full shadcn class string, with no single source.
- **Styleguide contradicts the code:** it says "primary is #6C63FF" (it's #4F46E5 / #818CF8), "one typeface: Inter" (it's the system stack), "strict 8px grid" (Tailwind's scale is 4px), and "use only default and secondary" while showcasing 8 button styles. It's also dated March 2023.

## 2. Accessibility (WCAG 2.1 AA)

- **Input border** `--input` (#e2e8f0) on white is 1.2:1, failing 1.4.11. This is shadcn's own default!
- **Error shown by colour only:** red border on the email field (1.4.1).
- **Vague error not linked:** "Invalid input." has no `aria-describedby` and no `aria-invalid` (3.3.1, 3.3.3).
- **Icon-only buttons** (search, menu) have **no accessible name**: Lucide SVGs carry no label (4.1.2). They're also **24×24px** (2.5.5).
- **Headings:** h1 → **h4** ("Features"). Alert titles are h5 (1.3.1).
- **Landmarks:** the hero is a `<div>`, there's no `<main>` and no skip link (1.3.1, 2.4.1).
- **No `lang`** on `<html>` (3.1.1).
- **No viewport meta**, and `grid-cols-3` is fixed with no responsive breakpoint, so it scrolls horizontally on mobile (1.4.10).
- **`<img>` with no `alt`**, pointing to a missing file (1.1.1).
- **Toast and alerts** have no `role="status"` / `role="alert"` (4.1.3).
- **Active nav link** has no `aria-current="page"`.
- **Bouncy toast animation** ignores `prefers-reduced-motion`.
- **"click here for demo"** points to `href="#"` and is non-descriptive (2.4.4).
- **Buttons do nothing:** Get started, Learn more, Choose… have no action.

## 3. UX copy

- "click here for demo": non-descriptive, lowercase.
- "Submit" and "Choose": generic CTAs.
- "Error 422 / Unprocessable Entity": technical jargon.
- "Invalid input.": doesn't say what's wrong or how to fix it.
- "Cancel anytime*": an asterisk with no footnote.
- "Warning: our newsletter may contain jokes.": warning style for a non-warning.
- "Success!" shown before the user did anything.
- Casing mixes UPPERCASE (CTA, Beta, NEW), Title Case and sentence case.
- "Learn more" has no destination.
- The prefilled email `alex@` is test data left in the markup.
