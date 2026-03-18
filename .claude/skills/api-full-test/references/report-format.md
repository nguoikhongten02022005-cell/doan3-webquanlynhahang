# Report Format

Write the report to `./reports/api-full-test-report.md`.

Use this exact structure:

```md
# API Full Test Report

## Summary
- Overall result: PASS | PARTIAL | FAIL
- Backend target:
- Base URL:
- Collection source:
- Retest performed: yes | no

## Environment
- Startup path:
- Runtime command:
- Database target:
- Seed/reset path used:
- Auth source:

## Commands Run
- `...`
- `...`

## Test Scope
- Modules or folders covered
- Endpoint groups added locally
- DB side-effect checks performed

## Passed
- `METHOD /route` - note
- `METHOD /route` - note

## Failed
- `METHOD /route` - status - short symptom
- `METHOD /route` - status - short symptom

## Root Cause Analysis
- Failure: ...
  Cause: ...
  Evidence: ...

## Fixes Applied
- File: `path`
  Change: ...
  Reason: ...

## Retest Result
- Targeted retest: pass | fail
- Full retest: pass | fail
- Delta from original run: ...

## Remaining Risks
- ...

## Next Actions
- ...
```

## Writing Guidance

- Record only commands actually executed.
- Distinguish between collection issues and backend issues.
- Name files changed exactly.
- If no fix was applied, state that explicitly.
- If MySQL verification was skipped, explain why.
