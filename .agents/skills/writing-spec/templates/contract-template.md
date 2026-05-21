---
schema_version: 1
id: NNN-feature-name
artifact: contract
block: blockName
block_type: store # building block type from the catalog, or "custom" if none
author:
created: YYYY-MM-DD
last_updated: YYYY-MM-DD
---

# [blockName] — Contract

<!-- A contract captures the design of ONE complex block. It exists only because the block hit ≥1 signal. Pseudocode / structured shape only — NO production code, NO full TypeScript interfaces. A contract's lifecycle is its parent spec's; it has no own status. Cap: ≤80 lines. -->

## 1. Design Problem

<!-- REQUIRED. 2-3 sentences: what is ambiguous or complex about this block, which signal(s) it hit, and why getting the shape right matters. -->

<!-- Example:
The wizard moves through 4 steps with back-navigation and a guarded final submit (signals 1, 3). Getting the transition map wrong silently strands the user mid-flow.
-->

## 2. Shape

<!-- REQUIRED. Structure by the signal(s) the block hit — a block may hit several. Pick the relevant outline(s). Lead with inputs → outputs → key behaviors. Pseudocode / outline only. -->

<!-- stateful — states, events, transitions/guards:
- states: idle, loading, success, error
- events: SUBMIT, RETRY, RESET
- transitions: idle --SUBMIT--> loading; loading --(ok)--> success; loading --(fail)--> error; error --RETRY--> loading

- guards: SUBMIT requires form valid
  -->

<!-- data shape — fields, derived values, invariants:
- fields: items[], selectedId
- derived: selectedItem = items.find(selectedId); total = sum(items.price)
- invariant: selectedId always references an existing item or null
-->

<!-- logic — operations (signatures), rules, edge cases:
- applyDiscount(cart, code) -> cart: stacks percentage codes, rejects expired
- edge: empty cart returns unchanged
-->

<!-- coordination — the seam: who calls what, with what payload:
- parent page passes onComplete(result) callback
- block calls onComplete after success transition only
-->

## 3. Rationale

<!-- REQUIRED. What was chosen and rejected for THIS block's shape, briefly. Block-scoped only — cross-block decisions stay in design.md Design Decisions; do not duplicate. -->

<!-- Example:
Chose a flat state enum over nested states — only one dimension of variation, nesting adds no value.
-->

## 4. Open Questions

<!-- OPTIONAL. Unresolved decisions that block implementation of THIS block. Remove when resolved. -->

<!-- Example:
- [ ] Should RETRY preserve partial form input or reset it?
-->
