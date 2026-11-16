## Design System Audit: Tova

Scope: `site/index.html`, `site/css/styles.css`, `site/js/main.js`, measured against `site/css/tokens.css` (v2.1) and `site/brand.md` (v1.3). Counts come from scanning the source files, after the critique's top 3 fixes.

### Summary
**Components reviewed:** 12 | **Issues found:** 31 | **Score:** 34/100

The system exists on paper: 24 tokens and a short, clear brand guide. The code mostly ignores it. **9 of the 24 tokens (38%) are never used**, including all 7 spacing tokens, while the CSS holds **64 hardcoded colours** and HTML/JS add **10 more inline**. The two source documents also disagree with each other (the orange, the number of fonts, dark mode), so even a careful developer couldn't follow "the system".

### The system contradicts itself
Fix these first, because there's no single truth to migrate to until they're settled.

| Topic | tokens.css says | brand.md says | Code does |
|---|---|---|---|
| Primary orange | `#FF6B2C` | `#FF5A1F` | `#FF6B2C` (6× hardcoded), `#FF6A2B` (logo), `#f97316` (dead `.btn--orange`) |
| Font families | 3 (`--font-display`, `--font-body`, `--font-mono`) | 2 ("never use a third family") | 4: Unbounded, Nunito, Space Mono, and Inter in `.cta-big` |
| Dark mode | `/* TODO dark mode (Q2) */` | "Supported on all pages" | None |
| Spacing | 8, 16, 24, 32, 48, 64, 96 | "strict 8pt grid" | 18 of the 30 distinct px values are off-grid |
| Radius | pill + 24px | "pills and 24px, nothing else" | 12 distinct values |

### Naming Consistency
| Issue | Components | Recommendation |
|-------|------------|----------------|
| Three different state-class conventions | `.is-active` (tasks), `.open` (FAQ), `.show` (modal), `.err` (inputs) | Use `is-*` everywhere: `is-active`, `is-open`, `is-visible`, `is-invalid`. |
| Blocks outside the BEM scheme | `.cta-big`, `.accept`, `.reject`, `.yes`, `.no`, `.info`, `.tooltip`, `.mid-cta` | Prefix by block: `.cookie__accept`, `.compare__yes`, `.spec__info`… and drop `.cta-big` (it's dead). |
| Button variants named by colour, not role | `.btn--dark`, `.btn--light`, `.btn--orange` | `.btn--primary`, `.btn--secondary`, so a palette change doesn't break the names. |
| Token prefixes are mixed | `--tova-*` (brand), `--text-*` (semantic), `--space-1…12` (skips 5, 7–11), `--radius-*` | Two layers: primitives `--tova-orange-500`, semantics `--color-action`, `--color-text-muted`. Components only use semantics. |
| Redundant token | `--tova-white` duplicates `#fff`, and the code uses `#fff` 17× anyway | Keep one `--color-surface` token and use it. |

### Token Coverage
| Category | Defined | Used | Hardcoded Values Found |
|----------|---------|------|----------------------|
| Colors | 11 | 6 (`orange-dark`, `sand`, `olive`, `white`, `text-on-dark` unused) | **64** hex/rgba in CSS (38 unique) + **10** inline in HTML/JS. `#FF6B2C` is hardcoded 6× even though `--tova-orange` holds the same value. `--tova-orange` is used once. |
| Spacing | 7 | **0** | ~110 px values in padding/margin/gap. 18 of 30 distinct values break the 8pt grid (2, 5, 6, 9, 10, 12, 14, 15, 18, 19, 20, 22, 28, 30, 36, 37, 50, 60). |
| Typography | 3 families, no size scale | 3 families | 18 different font sizes from 10px to 104px, with no scale token. Literal `"Inter"` in CSS and literal `Unbounded` in JS. 6 different `letter-spacing` values. |
| Radius | 2 | 2 (once each) | 12 distinct values: 4, 6, 8, 12, 14, 20, 24, 28, 30, 32, 50%, 999px. Two inline in HTML. |
| Shadows | 1 | 1 | `.cta-big` hard shadow `0 6px 0 #b8400f` (dead code). |
| Motion | 0 | — | `transition: all .4s`, a 3 s float, a 0.8 s spin, a 3 s carousel bar. No duration or easing tokens, and no reduced-motion rule. |

### Component Completeness
| Component | States | Variants | Docs | Score |
|-----------|--------|----------|------|-------|
| Button (`.btn`) | ⚠️ hover only on the dead orange variant, disabled only on `--reserve`, no focus (outline removed globally) | ⚠️ 3 colour-named variants (1 dead) + 2 sizes added ad hoc (`--hero`, `--reserve`) | ❌ | 4/10 |
| Cookie buttons (`.accept` / `.reject`) | ❌ | ❌ a separate button system | ❌ | 1/10 |
| Badge | ❌ (static, fine) | ⚠️ `--orange` and `--lime`. Lime `#c8f169` isn't in the palette | ❌ | 4/10 |
| Card: skill | ❌ | ⚠️ `--featured` breaks the radius (4px) and uses `scale(1.06)` | ❌ | 3/10 |
| Card: spec | ❌ | ❌ `--wide` changes the radius (14px), background and shadow. The dark card is fully inline-styled | ❌ | 2/10 |
| Input | ⚠️ error = red border only, no focus, no disabled | ❌ only exists inside `.order` (orange-on-orange), so it can't be reused | ❌ | 3/10 |
| Tabs: task list | ⚠️ active only, no hover or focus | — | ❌ | 3/10 |
| Accordion: FAQ | ⚠️ open/closed, no indicator icon | — | ❌ | 3/10 |
| Modal | ⚠️ visible/hidden, no focus handling | ❌ content styled inline in JS | ❌ | 2/10 |
| Tooltip | ⚠️ hover only | — | ❌ | 2/10 |
| Table: compare | ❌ | `.yes` / `.no` use green `#2fbf71` and red `#ff4d4d`, which aren't tokens | ❌ | 2/10 |
| Header + logo | ⚠️ the background is set from JS on scroll | ❌ logo orange `#FF6A2B` ≠ token | ❌ | 3/10 |

Docs: no component has documentation. `brand.md` has 8 one-line rules, and there's no component page or styleguide.

### Patterns
- **Forms:** one form, hand-built. No label, help-text or error-message pattern. `.form-msg` is the only feedback element.
- **Feedback:** three different surfaces for messages (inline `.form-msg`, modal, cookie banner), each styled differently. No semantic colour tokens for success, error or warning.
- **Section header:** `.section-label` + `.section-title` + `.section-sub` is the one pattern used consistently on every section. It's the best candidate to document first.

### Dead code
- `.cta-big` (19 lines, including the only use of Inter and the hard shadow): unused since "Buy now" was removed.
- `.btn--orange` and its scale + rotate hover: unused since the form button became `.btn--dark btn--reserve`.

### Priority Actions
1. **Settle the source of truth.** Pick one orange (tokens.css or brand.md), decide two or three font families, and change "dark mode: supported" to "planned". Update both files so they agree. Everything else depends on this.
2. **Replace the hardcoded colours with tokens.** Add the missing semantics (`--color-text-muted` at ≥4.5:1, `--color-border`, `--color-success`, `--color-danger`, `--color-surface-dark`), then swap the 74 literals. Most map onto about 12 tokens. This also fixes much of the contrast problem, because the greys can be darkened in one place.
3. **One button component.** `.btn--primary` / `.btn--secondary`, sizes `--md` / `--lg`, with hover, focus-visible, active, disabled and loading states. Move the cookie buttons onto it, and delete `.cta-big` and `.btn--orange`.
4. **Use the spacing and radius tokens.** Snap every padding, margin and gap to `--space-*` and every radius to pill or `--radius-card`. Remove the inline `style=""` attributes (6 in HTML, 2 in JS).
5. **Document the five core components** (Button, Input, Card, Badge, Section header) in a small `styleguide.html`, generated from the same classes so it can't drift.
