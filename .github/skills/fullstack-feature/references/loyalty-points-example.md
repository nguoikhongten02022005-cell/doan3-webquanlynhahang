# Loyalty Points Example

This reference shows how to apply the `fullstack-feature` skill to a loyalty points feature in this repository.

## Understanding

Requested feature:
- loyalty points feature

Likely user flow:
- Customer places and completes eligible orders.
- System awards points after successful payment.
- Customer sees current points in profile.
- Customer can later view points-related history.
- Admin or staff can monitor loyalty impact or customer points summary.

Roles affected:
- customer: earn and view points
- staff: may trigger order completion or payment that awards points
- admin: may monitor customer points, reports, or audit behavior

Assumptions:
- Existing `KhachHang.DiemTichLuy` is the intended base field.
- Points should be awarded on paid orders, not on order creation.
- The feature should fit the current compact monolith backend style.
- Frontend should consume mapped fields, not raw SQL-style fields directly.

Constraints:
- Do not break existing auth flow.
- Do not break current order status flows.
- Keep backend/frontend contract aligned through adapters.
- Current backend logic is centralized.

## Affected layers

### Database
Already has:
- `KhachHang.DiemTichLuy`

Likely needed:
- optional loyalty transaction/history table if auditability is desired
- possible bootstrap or seed update

### Backend
Main impact:
- controller
- service
- bootstrap or schema setup

Potential backend changes:
- expose current points in auth/profile payload
- award points when an eligible order changes to paid
- optional endpoint for loyalty summary/history
- optional admin/customer listing enhancements

### Frontend
Main impact:
- auth/profile adapter and normalization
- profile page or loyalty tab
- optional admin stats/reporting

### Auth / permissions
Impact exists because points should be attached to the logged-in customer profile.
Current auth storage may not keep loyalty fields yet.

### API adapters
Important because frontend may rely on mapping:
- SQL style: `DiemTichLuy`
- frontend style: `diemTichLuy`

### Tests / QA
Manual QA is especially important around:
- award once only
- no double-award on repeated status updates
- customer visibility
- unauthorized access
- empty/history state if a transaction log is added

## Planned files

### Likely backend files
- service file — core loyalty logic, profile mapping, and point awarding
- controller file — new endpoint(s) if exposing loyalty summary/history
- bootstrap/schema file — add schema for loyalty history if needed

### Likely frontend files
- auth API adapter — map loyalty points from backend payload
- auth/session service — persist points in the current user session object
- auth hook/context — expose updated profile with points
- profile UI component — show current points
- profile tab config — add loyalty tab if needed

### Optional admin/reporting files
- admin dashboard/data hook — add loyalty summary or metrics
- order/customer admin adapters — include loyalty fields if needed

## Existing patterns to reuse

### Backend patterns
- profile/auth data is already returned from existing auth/profile flows
- order lifecycle already updates status in the current order status flow
- customer model already includes a points field

### Frontend patterns
- auth normalization should stay centralized
- profile UI should reuse existing profile tabs/components
- admin metrics should reuse existing dashboard data hooks

## Contract dependencies

Common contract gap:
- backend may store points but not expose them in the user response
- frontend normalizers may not preserve loyalty points

So even if the DB already stores points, the feature may not be surfaced.

Also, the order status update flow may currently:
- update order status
- release resources if needed

It may not yet:
- award points
- prevent repeated awarding

That is the most important backend touchpoint.

## Implementation plan

### Phase 1 — Define loyalty rules
Decide and document:
- earning formula
- eligible statuses
- eligible order types
- reversal policy
- anti-duplication rule

### Phase 2 — Implement foundation
Minimal version:
- expose points in user/profile response

Recommended robust version:
- add a loyalty ledger table with:
  - customer id
  - order id
  - transaction type
  - points delta
  - description
  - created time

Why:
- prevents double-award ambiguity
- gives customer/admin audit trail
- supports future redemption

### Phase 3 — Implement backend
- add helper to compute earned points
- add helper to award points for a paid order
- call helper when status becomes paid
- ensure award happens only once

If a ledger table is added:
- check whether an award already exists for the order
- update customer points
- insert loyalty transaction row in one transaction

Optional endpoint additions:
- loyalty summary for current user
- loyalty history for current user
- admin reporting later if needed

### Phase 4 — Implement frontend
- map loyalty points into the logged-in user object
- preserve points after login, profile refresh, and session restore
- show current points in profile or a loyalty tab
- optionally show recent history and earning rules

### Phase 5 — Integrate and verify
Manual checks:
- customer logs in and sees points
- create an order with a linked customer
- mark the order paid
- points increase exactly once
- refresh session and confirm points remain correct
- repeated status updates do not duplicate points
- customer with no orders sees zero points
- unauthorized user cannot access customer-only loyalty data

## Scope options

### Option 1 — Minimal safe MVP
- expose points in auth/profile
- award points on paid
- show points in profile

Pros:
- smallest change set

Cons:
- no loyalty history or audit trail

### Option 2 — Better feature
- everything in MVP
- add loyalty transaction table
- add customer loyalty history UI

Pros:
- complete and auditable

Cons:
- touches more files

### Option 3 — Full feature with admin reporting
- option 2
- add admin KPI/reporting for loyalty usage

Pros:
- strongest demo value

Cons:
- biggest implementation scope

## Risks
- contract mismatch
- double-award risk
- data consistency risk
- role/permission risk
- UI regression risk

## Recommendation

A balanced next step is usually Option 2:
- use the existing customer points field
- add a loyalty history table
- award points when an order becomes paid
- expose points in auth/profile responses
- show points and history in the customer profile

This approach fits the current repository well, minimizes architectural disruption, and leaves room for future redemption features.