---
name: fullstack-feature
description: "Use this skill when implementing a complete full-stack feature in this repository across database, backend API, frontend UI, validation, permissions, contracts, and verification."
---

# Fullstack Feature

Use this skill for real end-to-end feature work that spans multiple layers of the system.

## When to use

Use this skill when the task involves one or more of these together:
- database or schema changes
- backend API or service logic
- frontend routes, pages, or components
- validation and error handling
- auth or permission-sensitive behavior
- integration across customer, staff, or admin flows

Examples:
- add a new customer-facing feature with backend support
- extend an admin workflow that requires API and UI updates
- implement a booking, ordering, payment, voucher, profile, or reporting feature across the stack
- add new data fields that must be persisted, exposed, and rendered

## When not to use

Do not use this skill for:
- tiny bug fixes
- CSS-only adjustments
- copy changes only
- one-file refactors
- isolated backend-only work with no feature flow impact
- isolated frontend-only polish with no contract or flow change

## Project adaptation rules

Always adapt to the current repository instead of inventing a new architecture.

### Frontend guidance
- inspect route structure first
- reuse existing providers, hooks, API adapters, and layout patterns
- keep backend field mapping out of UI components where possible
- preserve loading, empty, success, and error states
- preserve accessibility and route protection behavior

### Backend guidance
- inspect existing controller and service flow first
- extend current route and service conventions before proposing major restructuring
- preserve current auth, permission, and environment assumptions
- use existing DB/query patterns and transactions where needed
- avoid architecture rewrites unless clearly requested

### Contract guidance
- identify backend response shape before changing frontend consumption
- keep frontend/backend contracts aligned
- if backend naming differs from frontend naming, keep or update the mapping layer deliberately
- do not silently break existing adapters

### Role and permission guidance
Always consider:
- anonymous/public users
- authenticated customers
- staff behavior
- admin-only behavior
- protected routes and protected endpoints

## Default workflow

Unless the user explicitly asks to code immediately, always follow these phases.

### Phase 1: Understand the feature
Output:
- requested feature summary
- user flow
- affected roles
- assumptions
- constraints
- open questions if truly blocking

### Phase 2: Inspect the repository
Output:
- affected layers
- likely affected files
- existing patterns to reuse
- key frontend/backend contract dependencies

### Phase 3: Plan implementation
Output:
- database impact
- backend impact
- frontend impact
- adapter/mapping impact
- validation/auth impact
- test and QA plan
- rollout or regression risks

### Phase 4: Implement foundation
Examples:
- schema or migration updates
- seed/bootstrap changes
- shared types/constants/helpers
- DTOs or mapper changes

### Phase 5: Implement backend
Examples:
- endpoints
- controller flow
- service logic
- DB queries
- validation
- permission checks
- transactions
- error handling

### Phase 6: Implement frontend
Examples:
- routes
- pages
- components
- hooks
- forms
- API integration
- loading/empty/error states
- admin/customer/staff UI behavior

### Phase 7: Integrate and verify
Check:
- contract alignment
- role and permission behavior
- mapper compatibility
- query invalidation/refetch impact
- edge cases and regression points

### Phase 8: Testing and QA
Provide:
- unit/integration/component test suggestions if applicable
- manual QA checklist
- success path
- validation failure path
- unauthorized path
- empty/loading/error state checks

### Phase 9: Final summary
Provide:
- changed files
- what was implemented
- assumptions made
- risks
- follow-up improvements

## Response format

Start with this structure unless the user asks otherwise:

1. Understanding
2. Affected layers
3. Planned files
4. Existing patterns to reuse
5. Contract dependencies
6. Implementation plan
7. Risks
8. Then code or patch proposal

## Quality checklist

Before finishing, confirm:
- affected layers were identified
- frontend/backend contracts are aligned
- mapping or adapters are still correct
- auth and permissions were considered
- validation and error handling were covered
- no unnecessary rewrites were introduced
- test or QA steps were included

## Collaboration rules

- prefer small, verified steps over broad rewrites
- reuse current project structure and naming
- make reasonable assumptions when safe and state them clearly
- only stop for clarification when a missing requirement blocks safe implementation

## Resources
- [Phase templates](./references/phase-templates.md)
- [Loyalty points example](./references/loyalty-points-example.md)
- [Validation script](./scripts/validate-feature-workflow.sh)

## MCP support
When this feature workflow needs MCP-backed support, use `../fullstack-mcp-coordinator/SKILL.md` as the companion skill.

Use `fullstack-mcp-coordinator` when you need to:
- tra docs framework hoac thu vien truoc khi code
- verify UI, console, network, loading, empty, success, va error states sau khi code
- lay them context tu GitHub, PR, issue, branch, hoac remote repo
- doc log, snapshot, markdown export, hoac tai lieu cuc bo de phan tich nhanh

Keep `fullstack-feature` as the implementation workflow, and use `fullstack-mcp-coordinator` as the tool-routing and verification layer.

## Example prompts

- Use the fullstack-feature skill to add a complete feature across database, backend API, frontend UI, and tests.
- Use fullstack-feature to inspect this repo first, then list affected files and implementation plan before coding.
- Use the fullstack-feature skill for an admin and customer feature that changes both contract and UI. Work phase by phase.
- Use the fullstack-feature skill to inspect, plan, and implement a complete feature across frontend and backend. When documentation lookup, browser verification, GitHub context, or local artifact inspection is needed, coordinate with fullstack-mcp-coordinator.
- Use fullstack-feature to implement a new feature across React/Vite frontend and NestJS backend. Inspect the repository first, propose affected layers and planned files, implement in phases, and use fullstack-mcp-coordinator for framework docs, browser console/network verification, and related GitHub context when relevant.