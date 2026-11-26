-- Run once in Supabase to allow authenticated students to reapply after rejection.
CREATE OR REPLACE FUNCTION public.reapply_rejected_enrollment(
  p_enrollment_id UUID,
  p_student_name TEXT,
  p_phone TEXT,
  p_college TEXT,
  p_year TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
DECLARE
  v_enrollment_id UUID;
  v_email TEXT := auth.jwt()->>'email';
BEGIN
  IF auth.uid() IS NULL OR v_email IS NULL THEN
    RAISE EXCEPTION 'Authentication is required to reapply';
  END IF;

  UPDATE public.enrollments AS enrollment
  SET
    status = 'pending',
    created_at = now(),
    approved_at = NULL,
    student_name = COALESCE(NULLIF(btrim(p_student_name), ''), enrollment.student_name),
    email = lower(v_email),
    phone = COALESCE(NULLIF(btrim(p_phone), ''), enrollment.phone),
    college = COALESCE(NULLIF(btrim(p_college), ''), enrollment.college),
    year = COALESCE(NULLIF(btrim(p_year), ''), enrollment.year),
    fee_amount = course.fee,
    order_id = NULL,
    payment_method = NULL
  FROM public.courses AS course
  WHERE enrollment.id = p_enrollment_id
    AND enrollment.user_id = auth.uid()
    AND enrollment.status = 'rejected'
    AND enrollment.payment_id IS NULL
    AND course.id = enrollment.course_id
    AND course.is_active = true
  RETURNING enrollment.id INTO v_enrollment_id;

  IF v_enrollment_id IS NULL THEN
    RAISE EXCEPTION 'This rejected registration cannot be resubmitted';
  END IF;

  RETURN v_enrollment_id;
END;
$$;

REVOKE ALL ON FUNCTION public.reapply_rejected_enrollment(UUID, TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.reapply_rejected_enrollment(UUID, TEXT, TEXT, TEXT, TEXT)
  TO authenticated;
