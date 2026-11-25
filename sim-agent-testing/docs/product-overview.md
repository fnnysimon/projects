# Sim: product overview

Written before hands-on use, from the official docs, the GitHub repository (README and issues) and public reviews. To be checked against the discovery session.

## What Sim is

A workspace to build, deploy and monitor AI agents. A workflow is a chain of blocks (AI agent, integration, condition, data step), built visually, by chatting, or in code.

- **Triggers:** manual, API, chat, schedule or event (a new email, for example).
- **Integrations:** 280+ tools (5,800+ actions) and every major LLM, including local models.
- **Data:** knowledge bases (hybrid keyword and vector search), tables, files.
- **Deployment:** each deploy freezes a versioned snapshot; the live agent does not change until the next deploy. Agents can be called through the API, a chat or MCP.
- **Monitoring:** logs, runs, schedules.
- **Business model:** open source (Apache 2.0), free cloud plan with limited credits, paid plans from $25 per user per month, Enterprise features (SSO, audit logs, SOC 2).
- **Traction:** about 30k GitHub stars; "100,000+ builders" according to the README.

## Strengths

- Covers the full cycle, build to monitoring, in one open-source tool.
- AI-first positioning against n8n, with a more permissive licence.
- Enterprise-ready (SSO, audit, SOC 2), which fits regulated sectors.
- Deploy versioning already exists, so rollback is not a gap.

## Weak points reported by users

| Theme | What users report | Example |
|---|---|---|
| Integrations and authorisation | Integrations that fail to authorise or break | [#5704](https://github.com/simstudioai/sim/issues/5704) |
| Cost and credits | Unclear spending, blocked despite credits | [#9620](https://github.com/simstudioai/sim/issues/9620) |
| Self-hosting | Hard to install | [#6158](https://github.com/simstudioai/sim/issues/6158), [#895](https://github.com/simstudioai/sim/issues/895) |
| Custom models | Requests to plug in custom or OpenAI-compatible endpoints | [#801](https://github.com/simstudioai/sim/issues/801) |
| Complex logic | Branching on model outputs and agents calling agents "hit a wall" (one review) | Product Hunt |

Almost no issue asks for testing or evaluating an agent before deployment, and no built-in feature for it was found in the docs. Either it is a real gap, or a need users have not voiced yet.

## Gaps to test in discovery

1. **Testing before production:** can I check the agent on 20 sample emails before deploying it?
2. **Cost prediction:** can I estimate what 1,000 emails a month will cost?
3. **Human approval:** can the agent ask a person to approve before writing to the CRM?
4. **Error handling:** what happens when the model misclassifies an email or an integration fails?

## Sources

- [Sim on GitHub](https://github.com/simstudioai/sim) and its [issues sorted by reactions](https://github.com/simstudioai/sim/issues?q=is%3Aissue+sort%3Areactions-%2B1-desc)
- [docs.sim.ai/workflows](https://docs.sim.ai/workflows), [docs.sim.ai/blocks](https://docs.sim.ai/blocks)
- [Sim v0.5 blog post](https://sim.ai/blog/v0-5), [sim.ai/pricing](https://sim.ai/pricing)
- [Sim vs n8n](https://www.sim.ai/comparison/n8n) (vendor page)
- [Sim Studio on Product Hunt](https://www.producthunt.com/products/sim-studio?launch=sim-studio-2)
