# Disclaimer: unofficial test copy

**This folder is NOT affiliated with, endorsed by, or connected to Sim Studio or the Sim team in any way.**

It is a personal practice project: a copy of Sim's open-source code that I use to test UX/UI improvement ideas. Nothing here is an official Sim release, and nothing here should be used in production.

- **Original project:** [simstudioai/sim](https://github.com/simstudioai/sim), by Sim Studio
- **Copied from:** commit [`1814ccd`](https://github.com/simstudioai/sim/commit/1814ccd70e21906216bca2a08f95d6a2841db406) of the `main` branch (22 Nov 2026)
- **Licence:** Apache License 2.0. The original [LICENSE](LICENSE) and [NOTICE](NOTICE) files are kept unchanged. "Sim" and its logos are the property of their owners.
- **Status:** experiments and tests only. My changes may be incomplete or broken.

## What I changed from the original

Apache 2.0 asks that changed files say so. Changes so far:

1. Added this `DISCLAIMER.md` and a disclaimer banner at the top of `README.md`.
2. Turned off the original automation so it does not run in this copy:
   - `.github/workflows/` renamed to `.github/workflows-disabled/` (Sim's CI, release and deploy pipelines)
   - `.github/dependabot.yml` renamed to `.github/dependabot.yml.disabled`
   - `.github/CODEOWNERS` renamed to `.github/CODEOWNERS.disabled` (so the Sim team is never asked to review anything here)

3. Added [`ux-audit/`](ux-audit/): a UX discovery report on Sim's first use (free plan on sim.ai, 25 Nov 2026), with screenshots.
4. **Improvement 1: honest model picker and an error that helps** (from the audit's P1 insights):
   - The free-plan error now leads with the free fix: "&lt;model&gt; needs your own API key on the Free plan. Add one in Settings > BYOK (Bring your own key), or upgrade to use Sim's key." (`apps/sim/lib/billing/hosted-key-message.ts`, `hosted-key-access.ts`)
   - Its toast offers **Add API key** (opens Settings > BYOK) instead of "Fix in Chat", which led to a second paywall (`apps/sim/stores/terminal/console/store.ts`)
   - The model picker marks models a free workspace can only run with its own key with a **Needs your key** badge, in the list and on the selected model (`.../sub-block/hooks/use-model-needs-own-key.ts`, `.../sub-block/components/combobox/combobox.tsx`)
   - Clicking the model field selects its text, so typing a search replaces the current model instead of appending to it
   - Updated the two tests and the docs line that quote the old wording
5. Added a [design critique](ux-audit/02-design-critique.md) of that area and an [interaction spec](ux-audit/03-interaction-spec.md) for the next step (API key field on the block, one-line toast that focuses it, error state on the failed block). Following the critique, the badge is blue rather than amber, so it doesn't clash with Sim's "legacy" badge.
6. **Improvement 2: the fix sits next to the failure** (from the critique's critical and moderate findings and the interaction spec):
   - On the Free plan, the Agent block shows its **API key** field for models Sim hosts, so a key can be added right on the block. A key already on the block also keeps the field visible, so the key is never silently dropped (`apps/sim/blocks/utils.ts`, `apps/sim/stores/model-key-access/store.ts`, `apps/sim/lib/billing/client/own-key.ts`)
   - The failure toast is one line, "Needs your own API key on the Free plan." Its **Add API key** button opens the block and puts the cursor in the key field, with a short red highlight (none with reduced motion). It falls back to Settings > BYOK when the block isn't on the open canvas (`apps/sim/stores/terminal/console/store.ts`, `apps/sim/stores/panel/editor/focus-field.ts`)
   - A failed block keeps a red outline until the next run. When the failure was the missing key, it also shows a red **Needs API key** status, which opens the key field when clicked or activated with the keyboard (`.../utils/block-ring.ts`, `.../hooks/use-block-visual.ts`, `.../workflow-block/workflow-block.tsx`, `packages/workflow-renderer/.../block-view.tsx`)
   - Toast descriptions use `--text-body` instead of `--text-muted`, so they pass contrast (about 3.1:1 before in dark mode). This changes every toast in the design system (`packages/emcn/src/components/toast/toast.tsx`)
   - Not built yet from the spec: the field's height animation, a provider-specific placeholder, and keeping the model search text
   - Checked with type-check, biome and the existing tests. Not yet checked in the running app: running it locally needs PostgreSQL.

Any UX/UI improvements I make will be listed here, with before/after screenshots.

If you want the real product, go to [sim.ai](https://sim.ai) or [github.com/simstudioai/sim](https://github.com/simstudioai/sim).
