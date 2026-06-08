# Homepage Copy Optimization — Design

**Date:** 2026-06-08
**Scope:** Rewrite marketing copy on the Aleph homepage to surface six differentiators while preserving the existing editorial voice and design. **Text only** — no design, structure, or component changes.

## Decisions (locked)

1. **Positioning:** Keep the current editorial "legible · local-first · multi-agent" soul; inject differentiators into existing sections. No section structure or design changes.
2. **Competitors (openclaw / hermes-agent / opensquilla):** Implicit contrast only — never named. Use an `old way (cloud black box / single chatbot)` ⟷ `Aleph (local, one core many shells, legible)` framing.
3. **Jargon:** Technical terms (`shell-core separation`, `one core, many shells`, `Gateway`) live in eyebrows / labels / captions; body copy stays human ("the brain runs on your machine; every channel is just a door to the same mind").
4. **Manifesto chips:** Packaged differentiation — `Legible · Local—one core, many shells · Sovereign—your keys, your sandbox`. The dropped "Yours — export anything" moves to the FAQ memory answer.

## Constraints

- Only the **string values** in `src/messages/en.json` and `src/messages/zh.json` change.
- **All JSON keys and array cardinalities are preserved** (components index `process.steps`=4, `agents.items`=4, `archive.items`=5, `faq.items`=5, manifesto/hero chips=3 by position). `marquee.items` length is free (the component maps over it).
- `src/components/home/data.ts` holds no user-facing copy — untouched.
- `en.json` and `zh.json` updated in lockstep.

## Six differentiators → placement

| Differentiator | Sections |
|---|---|
| Native desktop | Hero `desc` + download CTAs (existing) + FAQ |
| One core, many shells / shell-core separation / Gateway | Hero `tag_label` + `desc` + Marquee + Manifesto body + FAQ |
| Deep memory | Hero spec chip + Manifesto body + FAQ |
| AI dynamic routing | Models `lede` |
| Permission / sandbox | Manifesto chip + Capabilities `lede` + Process + FAQ |
| Legible (soul) | preserved throughout |

## Section-by-section copy (English; zh mirrored)

**Hero**
- `tag_label`: `Local-first · One core, many shells · Multi-agent`
- `sub_html`: unchanged (soul line).
- `desc`: lives natively on desktop + reaches every channel (Telegram, Slack, browser) + remembers + orchestrates.
- spec chips: `01 Runs locally · by default` (unchanged) / `02 Remembers · across every channel` / `03 Orchestrates · sub-agents` (unchanged).

**Marquee** → `["Research","Inbox triage","Calendar","Writing","Code","Telegram","Slack","Desktop","One core · many shells","Memory","Sandboxed","Local-first"]`

**Manifesto**
- `statement_html`: unchanged.
- `body`: cloud-URL contrast + "the brain runs on your machine; every channel is just a door to the same mind" + sandbox + legible.
- chips: `Legible — see every step` / `Local — one core, many shells` / `Sovereign — your keys, your sandbox`.

**Models** `lede`: model-agnostic + "let Aleph route each step dynamically to the right model" + swap without losing memory/skills.

**Capabilities** `lede`: append "Every step is visible; nothing runs off your device without your say-so."

**Process**: `Orchestrate` step → "Sub-agents run in parallel in a sandbox; you can pause, steer, or veto any one."

**FAQ** (5 items kept; 3 strengthened)
- "different from a chatbot" → one core, many shells + native desktop.
- "memory" → linked notes traversed (not just a vector blob), compacted over time, export at single-fact level.
- "local-first" → OS sandbox + explicit approvals + "you see exactly what leaves when you route to a cloud model".

**Footer** `tagline`: `Universal personal AI agent intelligence. One core, many shells. Local-first, legible by design.` (`motto` unchanged).

## Verification

- `pnpm typecheck` passes (no key/shape drift).
- Manual scan: every changed key still exists; no array length changed except `marquee.items`.
