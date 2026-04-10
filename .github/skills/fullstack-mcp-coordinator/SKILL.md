---
name: fullstack-mcp-coordinator
description: "Use this skill when coordinating full-stack work in this repository with MCP support for documentation lookup, browser verification, GitHub context, local artifact inspection, and tool routing across the workflow."
---

# Fullstack MCP Coordinator

Use this skill when the task is not only to code a feature, but also to research, inspect, validate, and verify it across the full stack with the available MCP integrations.

## Project adaptation rules

Always adapt to the current repository instead of inventing a new workflow.

This skill helps coordinate full-stack work across:
- frontend React/Vite at repo root
- backend NestJS + MySQL in `backend/nest-api`
- local files, logs, screenshots, and generated docs in the workspace
- browser verification for real UI behavior
- GitHub repo workflows when a task involves branches, PRs, issues, commits, or remote file references

## When to use

Use this skill when one or more of these are true:
- the task spans frontend and backend
- the task needs both coding and browser verification
- the task depends on external library docs or API references
- the task requires checking logs, snapshots, exported markdown, or generated files
- the task involves PR review, issue context, branch context, or remote repository inspection
- the task needs a structured workflow instead of ad-hoc tool usage

Examples:
- implement a booking or ordering feature, then verify it in the browser
- add a backend endpoint and frontend integration, then inspect console errors and network behavior
- research a NestJS, React Query, Ant Design, or Vite pattern before changing code
- investigate a bug using local logs, browser console, network requests, and code search together
- prepare a feature branch workflow with implementation notes and QA evidence

## When not to use

Do not use this skill for:
- tiny one-file edits with no verification need
- pure copywriting changes
- CSS-only polish with no browser debugging requirement
- isolated questions that can be answered directly from known code

## MCP orchestration map

Use the available MCP capabilities intentionally instead of randomly.

### 1. Context7 / library docs MCP
Use for:
- up-to-date framework and library documentation
- API references and code examples
- verifying current usage for React, Vite, NestJS, React Query, Ant Design, Tailwind, or other packages in `package.json`

Default rule:
- use this before introducing new library patterns or when uncertain about current API behavior

### 2. GitHub MCP
Use for:
- repository or branch inspection outside the local workspace when needed
- PR, issue, commit, release, or code-search context
- remote file lookups and collaboration workflows
- preparing PR-related summaries or review support

Default rule:
- use only when the task truly benefits from remote GitHub context, not for normal local edits

### 3. Chrome DevTools / browser MCP
Use for:
- opening the running app in a browser
- checking rendered UI, console errors, accessibility tree, and network requests
- validating forms, route transitions, loading states, and failed API calls
- reproducing frontend bugs after implementation

Default rule:
- use after frontend-impacting changes, especially for forms, routing, auth, tables, dashboards, and checkout-like flows

### 4. Desktop Commander / local file MCP
Use for:
- reading large local files, exported logs, generated markdown, or snapshots efficiently
- writing or editing support files when the normal file tools are not ideal
- inspecting workspace artifacts such as `console-errors.txt`, `*-snapshot.md`, SQL files, or generated reports

Default rule:
- use for local analysis support, not as the first choice for normal source edits when standard workspace edit tools are enough

### 5. Markdown conversion MCP
Use for:
- converting a file or URL into markdown for fast analysis
- extracting readable content from docs, exported pages, PDFs, or structured references

Default rule:
- use when raw files or pages are hard to inspect directly and a markdown representation is more useful

### 6. Browser automation and page capture MCPs
Use for:
- snapshot-based verification
- form fill, click, keyboard, capture, and evaluation flows
- quick manual-like smoke tests after a change

Default rule:
- prefer these when you need evidence of real behavior rather than code-only confidence

## Repository-specific working rules

### Frontend
- main frontend lives at repo root in `src/`
- preserve existing route, component, hook, and service patterns
- keep naming aligned with project conventions and prefer meaningful Vietnamese names when adding new symbols
- verify loading, empty, success, and error states

### Backend
- active backend is in `backend/nest-api`
- preserve API contracts used by frontend unless the task explicitly includes contract changes
- inspect controllers, services, DTOs, and DB access patterns before changing behavior

### Data and contract
- if backend naming differs from frontend naming, update mapping deliberately
- do not silently break adapters in `src/services/`, `src/features/`, or mapper layers
- validate request and response assumptions with code before editing

## Default workflow

Unless the user explicitly asks to code immediately, always follow these phases.

### Phase 1: Understand the task
Output:
- requested task summary
- affected user flow
- affected roles
- frontend/backend/database scope
- contract or verification risks

### Phase 2: Inspect the repository
Output:
- affected frontend and backend areas
- likely affected files
- local artifacts to inspect
- existing patterns, tests, or smoke scripts to reuse

### Phase 3: Plan implementation and verification
Output:
- implementation steps
- docs or API references to confirm
- browser verification steps
- GitHub or local artifact context to inspect if needed
- local validation plan

### Phase 4: Implement foundation
Examples:
- shared constants, types, or mappers
- backend DTO or contract preparation
- frontend service or query preparation
- smoke, snapshot, or support artifact updates if needed

### Phase 5: Implement backend and frontend
Examples:
- backend controller, service, query, validation, or permission changes
- frontend route, page, component, hook, form, or integration changes
- contract alignment and mapping updates

### Phase 6: Integrate and verify locally
Check:
- lint/build/test or smoke commands available in the repo
- changed-file diagnostics
- obvious runtime or contract issues
- mapper compatibility and naming alignment

### Phase 7: Verify in browser and tools
Check:
- route loads
- form behavior
- API requests and responses
- console and network issues
- loading, empty, success, and error states
- relevant GitHub, log, snapshot, or markdown artifact context when applicable

### Phase 8: Final summary
Provide:
- changed files
- what was implemented
- what was verified
- assumptions made
- residual risks
- suggested next checks

## Decision rules for tool choice

Choose the lightest tool that gives reliable evidence.

- Need repo code context -> inspect workspace first
- Need library truth -> use Context7 docs
- Need UI/runtime truth -> use browser MCPs
- Need remote collaboration context -> use GitHub MCP
- Need artifact/log/snapshot digestion -> use Desktop Commander or markdown conversion
- Need simple file edits in this workspace -> use normal workspace edit tools

## Response format

Start with this structure unless the user asks otherwise:

1. Understanding
2. Affected layers
3. Planned files
4. Existing patterns to reuse
5. Contract or verification dependencies
6. Implementation plan
7. Verification plan
8. Then implementation or findings

## Quality checklist

Before finishing, confirm:
- local code patterns were inspected before editing
- external library docs were consulted when needed
- frontend/backend contract alignment was checked
- browser verification was done for UI-affecting changes when possible
- console/network/runtime issues were checked when relevant
- auth, permissions, and edge states were considered
- conclusions distinguish between verified facts and assumptions

## Collaboration rules

- prefer small, verified steps over broad rewrites
- reuse current project structure and naming
- use MCPs deliberately, not by default
- if a step needs runtime evidence, verify it in browser or artifacts instead of guessing
- if a change depends on unfamiliar APIs, confirm docs before coding
- keep local facts, browser facts, and GitHub context clearly separated

## Resources
- `../fullstack-feature/SKILL.md`
- `./scripts/validate-mcp-fullstack-workflow.sh`
- `console-errors.txt`
- `*-snapshot.md`
- `scripts/smoke-api.mjs`

## Example prompts

- Use the `fullstack-mcp-coordinator` skill to inspect, plan, implement, and browser-verify a complete feature across frontend and backend.
- Use the `fullstack-mcp-coordinator` skill to debug a full-stack issue using local code, docs, browser console, network evidence, and local artifacts.
- Use `fullstack-mcp-coordinator` to research the correct library APIs first, then implement and verify the change in the browser.
- Use `fullstack-mcp-coordinator` together with `fullstack-feature` to add MCP-based verification, docs lookup, and artifact inspection to the feature workflow.
