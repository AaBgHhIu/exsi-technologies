-- =============================================================================
-- EXSi Technologies — Complete Database Schema & Row-Level Security (RLS)
-- =============================================================================
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked 1:1 with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL DEFAULT '',
  college TEXT NOT NULL DEFAULT '',
  year TEXT NOT NULL DEFAULT '3rd Year',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTION: is_admin()
-- Evaluates with SECURITY DEFINER and fixed search_path to prevent search_path spoofing
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- PROFILES RLS Policies
-- SELECT: Users can view their own profile; Admins can view all profiles
CREATE POLICY "profiles_select_policy" ON public.profiles
  FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

-- INSERT: Only the authenticated user themselves can insert their initial profile
CREATE POLICY "profiles_insert_policy" ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- UPDATE: Users can update their own details, but CANNOT escalate their own role to 'admin'
CREATE POLICY "profiles_update_policy" ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (
    -- If updating self, role must remain unchanged or role must not be 'admin' unless already admin
    (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()))
    OR public.is_admin()
  );

-- Trigger: Automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'student'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 3. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  short_desc TEXT NOT NULL,
  description TEXT NOT NULL,
  syllabus JSONB NOT NULL DEFAULT '[]'::jsonb,
  fee INTEGER NOT NULL CHECK (fee >= 0),
  duration TEXT NOT NULL,
  mode TEXT NOT NULL,
  batch_start_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '14 days',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- COURSES RLS: Anyone can view active courses; Only admins can insert/update/delete
CREATE POLICY "courses_select_policy" ON public.courses
  FOR SELECT
  USING (is_active = true OR public.is_admin());

CREATE POLICY "courses_admin_all" ON public.courses
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 4. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  -- CONSTRAINT: Prevent duplicate registrations for same student and same course
  CONSTRAINT unique_user_course UNIQUE (user_id, course_id)
);

ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- ENROLLMENTS RLS:
-- SELECT: Student can view their own registrations; Admin can view all
CREATE POLICY "enrollments_select_policy" ON public.enrollments
  FOR SELECT
  USING (user_id = auth.uid() OR public.is_admin());

-- INSERT: Student can insert only for themselves and MUST force status = 'pending'
CREATE POLICY "enrollments_insert_policy" ON public.enrollments
  FOR INSERT
  WITH CHECK (user_id = auth.uid() AND status = 'pending');

-- UPDATE: ONLY ADMINS CAN UPDATE REGISTRATION STATUS! (Students can NEVER approve themselves)
CREATE POLICY "enrollments_update_policy" ON public.enrollments
  FOR UPDATE
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- DELETE: Only admin can delete registrations
CREATE POLICY "enrollments_delete_policy" ON public.enrollments
  FOR DELETE
  USING (public.is_admin());


-- 5. COURSE_PRIVATE TABLE (Holds meeting links & class materials; segregated for security)
CREATE TABLE IF NOT EXISTS public.course_private (
  course_id UUID PRIMARY KEY REFERENCES public.courses(id) ON DELETE CASCADE,
  meeting_link TEXT NOT NULL DEFAULT '',
  materials_url TEXT NOT NULL DEFAULT ''
);

ALTER TABLE public.course_private ENABLE ROW LEVEL SECURITY;

-- SELECT allowed ONLY if caller is admin OR student has an APPROVED enrollment in this course.
CREATE POLICY "course_private_select_policy" ON public.course_private
  FOR SELECT
  USING (
    public.is_admin()
    OR EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.course_id = course_private.course_id
        AND e.user_id = auth.uid()
        AND e.status = 'approved'
    )
  );

CREATE POLICY "course_private_admin_all" ON public.course_private
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());


-- 6. QUOTE_REQUESTS TABLE (For Project inquiries)
CREATE TABLE IF NOT EXISTS public.quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  project_idea TEXT NOT NULL,
  budget TEXT NOT NULL,
  deadline TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.quote_requests ENABLE ROW LEVEL SECURITY;

-- INSERT: Anyone can submit a quote request
CREATE POLICY "quote_requests_insert_policy" ON public.quote_requests
  FOR INSERT
  WITH CHECK (true);

-- SELECT/UPDATE: Only Admins can inspect and manage quote requests
CREATE POLICY "quote_requests_admin_all" ON public.quote_requests
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
