# Authentication & Contributor Verification Implementation

**Implemented:** 2026-02-02

## Overview

Auth-gated RSVP functionality and contributor verification system. Users can browse events freely, but Going/Interested buttons and the Contributor page trigger the auth flow.

---

## Database Schema

Run in Supabase SQL Editor:

```sql
-- Add is_contributor and is_admin to users table
ALTER TABLE users ADD COLUMN is_contributor BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;

-- Create contributor_requests table
CREATE TABLE contributor_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_netid TEXT NOT NULL REFERENCES users(netid) ON DELETE CASCADE,
  rso_id UUID REFERENCES rsos(id) ON DELETE SET NULL,
  rso_name TEXT NOT NULL,
  reason TEXT NOT NULL,
  proof TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  admin_notes TEXT,
  reviewed_by TEXT REFERENCES users(netid),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_netid, rso_name)
);

CREATE INDEX idx_contributor_requests_status ON contributor_requests(status);
CREATE INDEX idx_contributor_requests_user ON contributor_requests(user_netid);
```

---

## Backend Changes

### 1. UserService Updates
**File:** `backend/services/user_service.py`

Added methods:
- `get_contributor_status(netid)` - returns `{is_contributor, is_admin}`
- `set_contributor_status(netid, is_contributor)` - updates user contributor flag

### 2. ContributorService (NEW)
**File:** `backend/services/contributor_service.py`

Full CRUD for contributor requests:
- `create_request(user_netid, rso_name, reason, proof?, rso_id?)` - creates verification request
- `get_request(request_id)` - get single request
- `get_user_requests(user_netid)` - get all requests for a user
- `get_pending_requests(limit)` - get pending requests
- `get_all_requests(status?, limit)` - get all requests with optional filter
- `approve_request(request_id, admin_netid, admin_notes?)` - approves and sets `is_contributor=true`
- `deny_request(request_id, admin_netid, admin_notes?)` - denies the request

### 3. ContributorRoutes (NEW)
**File:** `backend/routes/contributor_routes.py`

API Endpoints:
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contributors/request` | Create verification request |
| GET | `/api/contributors/user/<netid>/status` | Get contributor status + requests |
| GET | `/api/contributors/user/<netid>/requests` | Get user's requests |
| GET | `/api/contributors/admin/pending` | Admin: get pending requests |
| GET | `/api/contributors/admin/all` | Admin: get all requests (optional status filter) |
| POST | `/api/contributors/admin/<id>/approve` | Admin: approve request |
| POST | `/api/contributors/admin/<id>/deny` | Admin: deny request |

### 4. Blueprint Registration
**File:** `backend/routes/__init__.py`

- Registered `contributor_bp` with prefix `/contributors`

---

## Frontend Changes

### 5. Contributor API Client (NEW)
**File:** `frontend/src/lib/api/contributorApi.ts`

API client methods:
- `createRequest(data)` - create verification request
- `getStatus(userNetid)` - get contributor status
- `getUserRequests(userNetid)` - get user's requests
- `getPendingRequests(limit)` - admin: get pending
- `getAllRequests(status?, limit)` - admin: get all
- `approveRequest(requestId, data)` - admin: approve
- `denyRequest(requestId, data)` - admin: deny

### 6. API Index Export
**File:** `frontend/src/lib/api/index.ts`

- Exported `contributorApi` and types

### 7. AuthContext Enhancement
**File:** `frontend/src/contexts/AuthContext.tsx`

Added to context:
- `isContributor: boolean` - is user a verified contributor
- `isAdmin: boolean` - is user an admin
- `contributorStatus: ContributorStatus | null` - full status object
- `refreshContributorStatus()` - refetch contributor status
- `pendingAction: PendingAction | null` - stored action for post-login
- `setPendingAction(action)` - store pending action
- `executePendingAction()` - execute and clear pending action

Pending actions are persisted in localStorage.

### 8. ReelCard RSVP Buttons
**File:** `frontend/src/components/ReelCard.tsx`

- Added "Going" button (green) and "Interested" button (yellow)
- If not logged in: stores pending action + redirects to `/login`
- If logged in: updates RSVP immediately via `useRsvp` hook
- Shows RSVP counts from summary

### 9. Contribute Page Auth Flow
**File:** `frontend/src/app/contribute/page.tsx`

Flow:
1. Not authenticated → redirect to `/login?redirect=/contribute`
2. Authenticated + `is_contributor=true` → show ContributorDashboard
3. Authenticated + pending request → show PendingRequestStatus
4. Authenticated + no request → show VerificationRequestForm

### 10. VerificationRequestForm (NEW)
**File:** `frontend/src/components/VerificationRequestForm.tsx`

Form fields:
- Organization Name (required)
- Your Role / Reason (required, textarea)
- Proof URL (optional)

Submits to `contributorApi.createRequest()`.

### 11. ContributorDashboard (NEW)
**File:** `frontend/src/components/ContributorDashboard.tsx`

- Shows "Verified Contributor" badge with RSO name
- Event submission form with fields:
  - Event Name, Description, Date & Time, Location, Image URL, Tags
- Submits to `eventsApi.create()`

### 12. Admin Contributors Dashboard (NEW)
**File:** `frontend/src/app/admin/contributors/page.tsx`

- Protected: only accessible if `is_admin=true`
- Filter tabs: Pending / Approved / Denied / All
- List of requests with user info, RSO name, reason, proof link
- Approve/Deny buttons for pending requests

### 13. Login Page Updates
**File:** `frontend/src/app/login/page.tsx`

- Handles `?redirect=` query parameter
- Redirects to specified URL after successful login

### 14. Explore Page Pending Action Handler
**File:** `frontend/src/app/explore/page.tsx`

- After login, checks for pending action
- Executes RSVP API call if pending action exists

---

## Files Modified/Created

| File | Status |
|------|--------|
| `backend/services/user_service.py` | Modified |
| `backend/services/contributor_service.py` | **NEW** |
| `backend/routes/contributor_routes.py` | **NEW** |
| `backend/routes/__init__.py` | Modified |
| `frontend/src/lib/api/contributorApi.ts` | **NEW** |
| `frontend/src/lib/api/index.ts` | Modified |
| `frontend/src/contexts/AuthContext.tsx` | Modified |
| `frontend/src/components/ReelCard.tsx` | Modified |
| `frontend/src/app/contribute/page.tsx` | Modified |
| `frontend/src/components/VerificationRequestForm.tsx` | **NEW** |
| `frontend/src/components/ContributorDashboard.tsx` | **NEW** |
| `frontend/src/app/admin/contributors/page.tsx` | **NEW** |
| `frontend/src/app/login/page.tsx` | Modified |
| `frontend/src/app/explore/page.tsx` | Modified |

---

## Verification Steps

1. **Browse without auth** - can view events, no errors
2. **Click Going (not logged in)** - redirects to login, after login RSVP completes
3. **Click Interested (logged in)** - updates immediately, shows "Interested!"
4. **Go to /contribute (not logged in)** - redirects to login
5. **Go to /contribute (logged in, not contributor)** - shows verification form
6. **Submit verification request** - shows pending status
7. **Admin approves request** - user's `is_contributor` becomes true
8. **User returns to /contribute** - sees ContributorDashboard
9. **Submit event as contributor** - event appears in feed

---

## Making a User Admin

To make a user an admin, run this in Supabase SQL Editor:

```sql
UPDATE users SET is_admin = TRUE WHERE netid = 'your-netid-here';
```
