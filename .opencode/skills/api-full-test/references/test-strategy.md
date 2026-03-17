# Test Strategy

## Goal

Maximize meaningful API coverage for local/dev C# backends by combining existing Postman assets with backend route scanning and DB verification.

## Coverage Priorities

1. Service availability and smoke readiness.
2. Authentication and authorization.
3. Core read and write business flows.
4. Validation and negative paths.
5. Response contract consistency.
6. Database side effects for write operations.

## Repo Discovery Checklist

- Find `.sln`, `.csproj`, `Program.cs`, `Startup.cs`, `launchSettings.json`, `docker-compose*.yml`, `.env*`, `appsettings*.json`.
- Find controllers, minimal API mappings, auth setup, policies, and role checks.
- Find migrations, SQL scripts, seeders, dockerized MySQL containers, and health checks.
- Find `*.postman_collection.json`, `*.postman_environment.json`, Newman scripts, or docs pointing to Postman resources.

## Strategy Selection

### Prefer Existing Collection

Use the repo's Postman collection when it already covers a meaningful share of endpoints or business flows. Extend it locally when one of these is true:

- Important endpoint group has no requests.
- Existing folder covers only happy path.
- Auth or permission denial cases are missing.
- Write operations have no DB verification follow-up.

### Generate Local Supplemental Coverage

Add supplementary local requests when backend scan reveals:

- Public route not represented in collection.
- Protected route without role coverage.
- Validation-heavy endpoint with no malformed payload test.
- CRUD mutation without read-after-write or side-effect verification.

Do not over-engineer a brand new collection if an existing one can be incrementally improved for the run.

## Layered Execution Plan

### Smoke

- App boots and listens.
- Health or simplest GET endpoint succeeds.
- Auth bootstrap path is reachable if auth exists.
- One representative read request succeeds with expected schema.

### Regression

Run grouped flows by module, for example:

- Auth
- Users or identities
- Roles or permissions
- Domain entities A, B, C
- Reports or summary endpoints

### Deep Checks

- Required field omissions.
- Boundary and malformed values.
- Duplicate create attempts.
- Unauthorized and forbidden access.
- Not found access with fake IDs.
- Conflict responses where resource uniqueness exists.
- Data persistence or rollback behavior.

## Contract Verification

For important endpoints, verify:

- Status code.
- `Content-Type`.
- Required properties exist.
- Naming conventions match serializer output.
- Error payload shape is stable enough for clients.

## MySQL Verification Guidance

Inspect DB effects when endpoint behavior writes or deletes data.

Common checks:

- Row created with expected key fields.
- Updated timestamp or status field changed.
- Soft delete flag set instead of hard delete.
- Child rows created or preserved as expected.
- Duplicate writes prevented when unique rule exists.

Use read-only verification queries whenever possible after writes are completed.

## Stopping Conditions

Stop expanding coverage when:

- Startup is broken and blocks all HTTP tests.
- Safe local credentials for DB verification are unavailable.
- Auth bootstrap cannot be completed without missing secrets.
- Additional cases would require major business assumptions unsupported by repo context.

Document these constraints in the report instead of guessing.
