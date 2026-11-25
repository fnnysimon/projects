# UX work on Sim: from audit to code

> Unofficial practice work, not affiliated with Sim Studio. The original code is kept at the tag [`sim-original`](https://github.com/fnnysimon/projects/tree/sim-original/sim-ameliore).

Three Claude skills were run in order on Sim's first-use experience (Free plan on [sim.ai](https://sim.ai), 25 Nov 2026). Each one fed the next, and each one led to code changes in this folder.

| Step | Skill | Document | What it found or decided | Built in code |
|---|---|---|---|---|
| 1 | `/ux-superpowers` | [UX discovery report](01-ux-discovery-report.md) | A free user's first run fails on a paid-only model, and every way out ("Fix in Chat", the home chat) is another paywall. Top recommendation: an honest model picker and an error that offers the free fix | [Improvement 1](https://github.com/fnnysimon/projects/commit/d6162a60): "Needs your key" badge in the model picker, select-on-focus search, error that leads with the free fix, **Add API key** instead of "Fix in Chat" |
| 2 | `/design:design-critique` | [Design critique](02-design-critique.md) | The error is cut to 3 lines and low-contrast (about 3.1:1), the fix is far away in Settings, the key field is hidden, the failed block looks healthy, and the amber badge clashes with Sim's "legacy" badge | [Blue badge](https://github.com/fnnysimon/projects/commit/0f76f636), then [improvement 2](https://github.com/fnnysimon/projects/commit/8b2483a9) |
| 3 | `/interaction-design` | [Interaction spec](03-interaction-spec.md) | Every state, timing, motion (with a reduced-motion version), error recovery, keyboard and screen-reader behaviour for "this model needs your own key", plus 4 open questions | [Improvement 2](https://github.com/fnnysimon/projects/commit/8b2483a9): key field on the block, one-line toast whose **Add API key** focuses that field, red outline and **Needs API key** status on the failed block, readable toast text |

Screenshots of the live product used as evidence are in [`screenshots/`](screenshots/). The full list of changed files is in [DISCLAIMER.md](../DISCLAIMER.md#what-i-changed-from-the-original).

## Status

- **Checked:** type-check, biome lint and Sim's existing tests (about 2,800) pass. One cost-formatting test fails on a French-locale computer, in code these changes don't touch.
- **Not yet checked in the running app:** running Sim locally needs Docker and PostgreSQL, which were being set up.
- **Not built from the spec yet:** the field's height animation, a provider-specific placeholder, and keeping the model search text.
