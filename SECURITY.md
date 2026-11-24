# EXSi Technologies — Security Architecture & Proofs

This document outlines the security controls, Row-Level Security (RLS) enforcement, and penetration verification queries for EXSi Technologies' course registration and administration system.

---

## 1. Security Threat Model & Defense Matrix

| Threat | Defense Mechanism | PostgreSQL Enforced Level |
| :--- | :--- | :--- |
| **Student attempts to self-approve enrollment** | `WITH CHECK (status = 'pending' AND user_id = auth.uid())` on `enrollments` INSERT. No student UPDATE policy exists. | RLS Kernel |
| **Student attempts to read live class meeting link** | `meeting_link` and `materials_url` are segregated into `course_private` table. Only admin or students with status = 'approved' can read. | RLS Kernel |
| **Student attempts to escalate role to admin** | `profiles` UPDATE policy uses `WITH CHECK (role = OLD.role)` or ignores role updates from non-admins. | RLS Kernel |
| **Student enrolls multiple times in same course** | `CONSTRAINT unique_user_course UNIQUE (user_id, course_id)` on `enrollments`. | Table Unique Constraint |
| **Spam / Bot quote submission on Projects page** | Hidden Honeypot trap field (`website`) + Client/Server IP throttler. | Server Action |
| **Admin spoofing via search_path poisoning** | `is_admin()` function declared with `SECURITY DEFINER` and fixed `SET search_path = public, pg_catalog`. | Function Attribute |

---

## 2. Row-Level Security (RLS) Rules Summary

### `profiles` Table
- **SELECT**: `auth.uid() = id OR is_admin()`
- **INSERT**: `auth.uid() = id` (executed automatically via `on_auth_user_created` trigger)
- **UPDATE**: `(auth.uid() = id AND role = 'student') OR is_admin()`

### `courses` Table
- **SELECT**: `is_active = true OR is_admin()` (Publicly visible active courses)
- **INSERT / UPDATE / DELETE**: `is_admin()` only

### `course_private` Table
*(Holds meeting links, Zoom/Google Meet credentials, private drive links)*
- **SELECT**: `is_admin() OR EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = course_private.course_id AND enrollments.user_id = auth.uid() AND enrollments.status = 'approved')`
- **INSERT / UPDATE / DELETE**: `is_admin()` only

### `enrollments` Table
- **SELECT**: `user_id = auth.uid() OR is_admin()`
- **INSERT**: `WITH CHECK (user_id = auth.uid() AND status = 'pending')`
- **UPDATE**: `is_admin()` only

---

## 3. SQL Verification & Penetration Test Queries

Run these queries in the **Supabase SQL Editor** after applying the migration to verify that our security barriers cannot be breached:

### Test 1: Prove student CANNOT insert an 'approved' enrollment
```sql
-- Step A: Set session to a normal student user
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

-- Step B: Attempt to exploit the API by inserting status = 'approved'
INSERT INTO public.enrollments (user_id, course_id, status)
VALUES ('00000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'approved');

-- EXPECTED RESULT: 
-- ERROR: new row violates row-level security policy for table "enrollments"
-- Status must be 'pending' for non-admin inserts.
```

### Test 2: Prove student CANNOT update their own enrollment to 'approved'
```sql
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

-- Attempt to flip status from 'pending' to 'approved'
UPDATE public.enrollments
SET status = 'approved'
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- EXPECTED RESULT:
-- UPDATE 0 (Zero rows updated; RLS filters out the row from update scope because only admins have UPDATE grants).
```

### Test 3: Prove unapproved student CANNOT read meeting links from `course_private`
```sql
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

-- Attempt to read meeting link for a course where student has only 'pending' or NO enrollment
SELECT meeting_link, materials_url 
FROM public.course_private 
WHERE course_id = '11111111-1111-1111-1111-111111111111';

-- EXPECTED RESULT:
-- 0 rows returned. The query returns empty dataset.
```

### Test 4: Prove student CANNOT escalate their own role to 'admin'
```sql
SET LOCAL ROLE authenticated;
SET LOCAL "request.jwt.claims" = '{"sub": "00000000-0000-0000-0000-000000000001", "role": "authenticated"}';

-- Attempt privilege escalation
UPDATE public.profiles
SET role = 'admin'
WHERE id = '00000000-0000-0000-0000-000000000001';

-- EXPECTED RESULT:
-- ERROR: new row violates row-level security policy for table "profiles"
```

---

## 4. Reporting Vulnerabilities

If you discover a security flaw or vulnerability within EXSi Technologies' systems, please report it privately to:
`security@exsitechnologies.com` or `hello@exsitechnologies.com`.
