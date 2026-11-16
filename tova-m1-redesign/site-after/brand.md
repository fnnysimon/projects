# Tova brand guidelines (v3.0, Nov 2026)

`css/tokens.css` is the source of truth for every value below. If this file and
the tokens disagree, the tokens win and this file gets fixed.

- **Primary orange:** `#FF6B2C` (`--tova-orange-500`). Use it for accents: badges, highlights, the order band. The primary button is ink.
- **Typography:** three families, each with one job:
  - **Unbounded** (`--font-display`): headings and big numbers.
  - **Nunito** (`--font-body`): everything people read.
  - **Space Mono** (`--font-mono`): small labels only (eyebrows, section labels, spec titles).
  - No other family.
- **Colour in code:** components use semantic tokens (`--color-*` or the shadcn variables) only, never a hex value or a primitive (`--tova-*`).
- **Text contrast:** every text token is at least 4.5:1 on the surface it's meant for.
- **Components:** shadcn/ui, ported to plain CSS in `css/ui.css` (no React or Tailwind). Use only these, with their shadcn names: Button, Badge, Card, Label, Input, Checkbox, Tabs, Accordion, Table, Dialog, Tooltip, Separator.
  - **Buttons:** `.btn` plus one variant: `--default` (the main action, one per view), `--outline`, `--secondary`, `--ghost` or `--link`. Sizes: default (40px), `--sm`, `--lg` (44px, for hero and form CTAs), `--icon`. Always sentence case.
  - **Theming:** components read the shadcn variables (`--background`, `--primary`, `--muted-foreground`…), which point at Tova's semantic tokens in `tokens.css`. Dark or coloured sections use a theme scope: `.theme-dark`, `.theme-accent` or `.theme-media`.
  - **Differences from stock shadcn, for accessibility:** controls are 4px taller, `--input` is darker (3:1), and the focus ring is solid.
- **Icons:** Lucide only (the shadcn icon set), from the sprite at the top of `index.html`: `<svg class="icon"><use href="#i-NAME"/></svg>`. 16px by default, 2px stroke, `currentColor`. A decorative icon gets `aria-hidden="true"`; an icon-only button gets an `aria-label`.
- **Spacing:** strict 8pt grid. Every margin and padding is a multiple of 8.
- **Radius:** the shadcn scale, from `--radius` (10px): `--radius-sm` 6px, `--radius-md` 8px (buttons, inputs, badges), `--radius-lg` 10px (dialogs, tab lists), `--radius-xl` 14px (cards, panels). Nothing else.
- **Voice:** warm, plain English. No jargon, no ALL CAPS shouting.
- **Price:** always written `$1,690`.
- **Dark mode:** planned, not supported yet.

## Illustration

- **Style:** product-render look. Soft matte shading through gradients, no outlines. A "thickness" layer is offset 6 px right and 5 px down (`--color-robot-shell-side` / `--color-robot-dark-side`).
- **The robot:**
  - Boxy white head with a charcoal camera band (camera, camera-in-use light, two screws), a black screen with two glowing white pill eyes, and charcoal ears.
  - Torso: white on top, charcoal below, with a chest button and four bolts.
  - Charcoal arms with 5-bolt joint plates and grey claw grippers, on a pole and a wheeled base.
- **Colours:** only the `--color-robot-*` tokens. Orange is the one Tova accent on the robot: the antenna tip and the chest-button glow. Static image assets (for example `img/tova-m1.svg`) copy the same hex values.
- **Truthfulness:** only draw hardware that's on the claims sign-off list (`reports/05-ux-copy.md`). Never invent parts.
- **Motion:** the head may turn toward the visitor, but the eyes never follow the pointer. Every animation needs a purpose and a reduced-motion fallback (see `reports/07-interaction-design.md`).
