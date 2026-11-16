# Nimbus — a deliberately flawed shadcn/ui site

A fake SaaS landing page ("Nimbus") built with **shadcn/ui** components,
**Tailwind CSS** and **Lucide** icons, with flaws planted on purpose. Use it as
a sandbox to practise Claude skills.

No build step and nothing to install: Tailwind (Play CDN 3.4.16) and Lucide
(0.468.0) load from a CDN. The shadcn/ui components are hand-ported as HTML
using the exact shadcn class strings and theme tokens, not the npm/CLI package.

## Run it

The preview is served with **live reload**: save any file in `site/` and the
page refreshes by itself in under a second.

- In the Claude app: ask Claude to "start the nimbus preview" (it's defined in
  `.claude/launch.json`).
- Manually, from this folder:

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Then open http://localhost:4321 (landing page) and
http://localhost:4321/styleguide.html (the "official" styleguide).

## Files

| File | What it is |
|---|---|
| `site/css/theme.css` | shadcn/ui theme tokens (`--primary`, `--muted-foreground`…), light + dark |
| `site/js/tailwind.config.js` | Tailwind config mirroring shadcn's, plus the Lucide init |
| `site/index.html` | Landing page (Button, Badge, Card, Alert, Label, Input, Toast) |
| `site/styleguide.html` | Component showcase, whose notes contradict the code |
| `site/redesign.html` | **Reference redesign** (editorial direction, made with `/frontend-design`). Use it to compare against the flawed page |
| `ANSWERS.md` | Answer key with every planted flaw. **Don't open it yet!** |

Icons: `<i data-lucide="icon-name"></i>`, with names from https://lucide.dev/icons.

## Exercises (one skill each)

Try them in order. Watch the browser while Claude edits.

1. **Audit:** `/design-system` → "Audit the Nimbus design system in site/: where do pages bypass the shadcn tokens and variants?"
2. **Accessibility:** `/accessibility-review` → "Audit site/index.html for WCAG 2.1 AA." Then ask it to fix the top 5.
3. **Critique:** `/design-critique` → "Critique the landing page at localhost:4321 (hierarchy, consistency)."
4. **Copy:** `/ux-copy` → "Review the microcopy: buttons, errors, alerts, links."
5. **Polish:** `/design-elevation` → "Polish the landing page without changing its direction."
6. **Interactions:** `/interaction-design` → "Spec the states (hover, focus, error, loading) for buttons and the signup form."
7. **Handoff:** `/design-handoff` → "Write a dev handoff spec for the pricing section."
8. **shadcn:** `/vercel:shadcn` → "Add proper success and warning variants to the Alert, the shadcn way."

Tip: after each skill, compare its findings with `ANSWERS.md` to see what it
caught and what it missed.

## Reset

Two snapshots are kept:

- `.shadcn-site/`: this shadcn/ui version, with the flaws listed in `ANSWERS.md`.
- `.original-site/`: the first version (plain CSS, before shadcn and before
  the accessibility fixes).

```bash
rm -rf site && cp -r .shadcn-site site
```
