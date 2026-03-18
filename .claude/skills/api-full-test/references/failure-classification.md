# Failure Classification

## Purpose

Classify failures quickly so the agent checks the right layer before changing code.

## Failure Types

### 1. Environment Or Startup

Signals:

- App does not boot.
- Port is closed.
- Health endpoint unavailable.
- Immediate connection refusal or timeout.

Check:

- Startup command.
- Missing env vars.
- Misbound ports.
- Docker compose health.
- Build errors.

Auto-fix allowed:

- Small local startup command correction.
- Local env or collection base URL correction.

### 2. Auth Or Token

Signals:

- `401` where happy path should succeed.
- `403` where role should allow.
- Token parse or signature errors.

Check:

- Login request.
- Bearer header formatting.
- Token source variable.
- Claims and role policy names.
- Auth middleware order.

Auto-fix allowed:

- Wrong auth header in test asset.
- Obvious local role or policy name mismatch only if the backend intent is clear and change is small.

### 3. Collection Or Environment Asset

Signals:

- Wrong host, path, param name, body field, or header.
- Collection assertion clearly contradicts actual contract.

Check:

- Environment values.
- Folder and request inheritance.
- Raw URL and variables.
- Request body schema.

Auto-fix allowed:

- Base URL, header, token variable, field name, or assertion correction.

### 4. Route Or Binding

Signals:

- `404` for valid flow.
- Input not bound.
- Path or query values ignored.

Check:

- Route attributes.
- Minimal API mapping.
- Parameter names.
- `[FromBody]`, `[FromRoute]`, `[FromQuery]` usage.

Auto-fix allowed:

- Clear route typo.
- Simple binding attribute correction.

### 5. DTO Or Contract Mismatch

Signals:

- Response property names differ.
- Required fields missing.
- Deserialization failure.

Check:

- DTO definitions.
- JSON serializer naming policy.
- Nullable and validation annotations.
- Collection assertions versus actual contract intent.

Auto-fix allowed:

- Simple DTO property or validation mismatch.
- Local collection assertion update when backend contract is clearly correct.

### 6. Validation Defect

Signals:

- Invalid payload incorrectly accepted.
- Error code or error body is inconsistent.

Check:

- Data annotations.
- FluentValidation or custom validators.
- Manual guard clauses.
- ModelState handling.

Auto-fix allowed:

- Missing small validation annotation or obvious guard.

### 7. Database State Or Query

Signals:

- Writes succeed but data is absent or wrong.
- Duplicate rules not enforced.
- Query returns stale or incorrect rows.

Check:

- Connection target.
- Seed state.
- Repository or ORM query filters.
- Transaction boundaries.
- MySQL verification queries.

Auto-fix allowed:

- Small query condition or mapping bug if impact is obvious and localized.

### 8. True Server Defect

Signals:

- Correct request and environment still produce wrong behavior.
- Exception stack or logic path points to server code.

Check:

- Controller or handler logic.
- Service behavior.
- Repository or transaction flow.
- Error handling path.

Auto-fix allowed:

- Only very small, low-risk corrections.

## Safe Fix Boundary

Apply a fix only if all are true:

- Root cause is highly likely.
- Change is localized.
- No production config is touched.
- No destructive data operation is needed.
- No large business rule is being reinterpreted.

If any condition fails, stop at diagnosis and report the issue.
