---
name: api-full-test
description: this skill should be used when testing or regression-checking a csharp api repo with postman, backend code scanning, mysql verification, safe auto-fix, and one retest cycle.
---

# Api Full Test

## Overview

Run an end-to-end API verification workflow for local or dev C# backends. Inspect the repo first, prefer existing runners and collections, verify MySQL side effects, apply only small safe fixes, retest once, and write a markdown report to `./reports/api-full-test-report.md`.

## Use This Skill When

- Run full API regression for a backend C# repo.
- Validate auth, role, CRUD, validation, and negative cases with Postman plus code scanning.
- Investigate failing API tests and find likely root cause across backend code, config, database state, and collection setup.
- Apply small safe fixes locally, then rerun impacted tests and one full retest.

## Operating Rules

- Inspect the repo before running anything.
- Prefer existing commands, docker compose files, test runners, migrations, seeds, and Postman collections before inventing new flow.
- Start with smoke coverage before full regression.
- Verify `baseUrl`, auth token, headers, environment variables, and request payloads before concluding backend is broken.
- Verify MySQL side effects for write endpoints when feasible.
- Keep changes minimal and local-dev only.
- Do not change production config, secrets, remote services, or real data.
- Do not perform large refactors or business-logic rewrites as auto-fix.
- Retest only once after fixes: first targeted retest for touched area, then one full retest.

## Primary Tools

- Use `bash` as the main execution path for discovery, startup, builds, health checks, and local runners.
- Use `postman` tools to inspect collections, environments, mocks, monitors, or run a collection when the repo or user points to Postman assets.
- Use `mysql` to confirm schema presence, seed/reset assumptions, and DB side effects.
- Use `context7` to check framework or library behavior when root cause depends on ASP.NET Core, authentication, or tool conventions.
- Use `playwright` only when browser-based auth is required to obtain a token or complete a forced web login flow.

## Sequential Workflow

### 1. Inspect The Repo First

Inspect before execution. Find:

- C# backend entry points such as `.sln`, `.csproj`, `Program.cs`, `Startup.cs`, launch profiles, compose files, and readme instructions.
- Configuration sources such as `appsettings*.json`, `.env*`, docker compose env files, user secrets references, and launch settings.
- Postman or Newman assets such as `*.postman_collection.json`, `*.postman_environment.json`, exported collections, or docs that point to workspace IDs.
- Database artifacts such as EF Core migrations, SQL scripts, seeders, dockerized MySQL services, and test data reset commands.
- Existing health endpoints, auth flows, role claims, and high-risk modules by scanning controllers, minimal API mappings, services, and repositories.

If critical run information is still missing after discovery, proceed with the best inferred local/dev setup and ask one focused follow-up only if execution is blocked.

### 2. Choose The Test Strategy

Choose the strongest local strategy in this order:

1. Existing Postman collection plus environment, then extend locally if clear gaps exist.
2. Existing Newman or repo test command if it already wraps API regression.
3. Generated local additions derived from backend route scan when important endpoints or negative cases are missing.

While scanning backend C#, build a quick coverage map:

- Endpoint groups and verbs.
- Auth requirements and roles.
- CRUD surface.
- Validation paths.
- State-changing flows needing DB verification.
- Important edge and negative cases.

Use `references/test-strategy.md` for test matrix decisions and coverage expansion rules.

### 3. Prepare The Environment

Determine and record:

- Base URL and port.
- Backend startup command.
- Working environment name.
- DB host, schema, and test-safe credentials source.
- Collection/environment files or Postman identifiers.

Then prepare the system:

- Build and start the backend with repo-native commands or `docker compose` if that is clearly the supported path.
- Wait for readiness using health endpoint, startup logs, or a stable HTTP probe.
- Confirm MySQL connectivity before full testing.
- Run migrations or seed/reset only when the repo already provides a safe local/dev mechanism.
- Snapshot any relevant seed assumptions needed for deterministic assertions.

Never invent destructive reset logic against unknown or shared databases.

### 4. Run Tests In Layers

Execute in this order:

1. Smoke tests for app boot, health, auth bootstrap, and a representative read endpoint.
2. Core regression for major endpoint groups.
3. Targeted deep checks for auth, roles, CRUD, validation, edge cases, and side effects.

Minimum categories to cover when applicable:

- Auth: login, token refresh, invalid token, expired token, missing token.
- Role and permission: expected allow and deny paths.
- CRUD: create, read, update, delete, duplicate handling, and read-after-write.
- Validation: required fields, format checks, boundary values, nulls, and malformed payloads.
- Negative cases: `400`, `401`, `403`, `404`, `409`, `422`, and `500` if contextually valid.
- Contract checks: response shape, required fields, pagination, status code, and content type.
- DB side effects: inserted rows, updated fields, soft delete flags, or transaction rollback behavior when feasible.

If the collection lacks obvious negative or edge cases, extend it locally in the workspace copy or create supplementary requests only for the current repo test run.

### 5. Triage Failures And Find Root Cause

For each failure, classify before editing:

- Environment or startup issue.
- Auth or token issue.
- Collection or environment variable issue.
- Request construction issue.
- Backend route or binding issue.
- DTO or contract mismatch.
- Validation issue.
- Database state or query issue.
- True server defect.

Use `references/failure-classification.md` to guide diagnosis.

Always cross-check:

- Request URL, method, headers, body, path params, and environment variables.
- Backend route attributes or endpoint mappings.
- DTO fields, serializer naming, nullable rules, and validation attributes.
- Auth middleware, claims, policies, and role checks.
- MySQL data state and persistence effects.

### 6. Apply Only Safe Auto-Fixes

Auto-fix only when the change is small, explicit, and low-risk. Allowed examples:

- Clear route mapping mistake.
- Simple DTO request or response mismatch.
- Missing small validation rule.
- Test header, token, field name, or URL error.
- Local Postman collection/environment correction.

Do not auto-fix:

- Large refactors.
- Cross-module architecture changes.
- Production configuration.
- Secret management.
- Major business logic changes.
- Schema redesign or destructive data operations.

When fixing:

- Change the minimum number of files.
- Preserve existing conventions.
- Note every touched file for the report.

### 7. Retest Once

After any fix:

1. Retest the directly affected endpoint group or scenario.
2. If that passes, run one full retest.
3. Stop after that retest cycle and report remaining failures instead of looping.

### 8. Write The Report

Always write a markdown report to `./reports/api-full-test-report.md`.

Use the exact section order from `references/report-format.md`:

- Summary
- Environment
- Commands Run
- Test Scope
- Passed
- Failed
- Root Cause Analysis
- Fixes Applied
- Retest Result
- Remaining Risks
- Next Actions

Keep the report concrete:

- Name endpoint groups or collection folders tested.
- Record commands actually run.
- Distinguish original failures from post-fix failures.
- Name files changed.
- Explain why an issue remains if not safely fixable.

## Decision Heuristics

- If repo startup options conflict, choose the one documented in repo files over guesswork.
- If both `docker compose` and direct `dotnet run` are viable, prefer the lighter path unless DB/service dependencies clearly require compose.
- If collection assertions disagree with backend contract and code clearly supports one side, classify whether the bug is in the test asset or backend implementation before fixing.
- If DB verification is impossible due to missing safe credentials, continue API validation and call out DB verification as a remaining risk.
- If browser login is required for token issuance, use `playwright` only to obtain a local test token; do not broaden into UI testing.

## References

- Read `references/test-strategy.md` for coverage planning and gap filling.
- Read `references/failure-classification.md` for failure triage and safe auto-fix boundaries.
- Read `references/report-format.md` before writing the final markdown report.
