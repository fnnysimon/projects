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

3. Added [`ux-audit/`](ux-audit/): a UX discovery report on Sim's first use (free plan on sim.ai, 25 Nov 2026), with screenshots. No product code changed yet.

Any UX/UI improvements I make will be listed here, with before/after screenshots.

If you want the real product, go to [sim.ai](https://sim.ai) or [github.com/simstudioai/sim](https://github.com/simstudioai/sim).
