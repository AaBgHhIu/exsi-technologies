-- Persist course enrollment records in Supabase and scope them to authenticated users.
-- Run in the Supabase SQL Editor after the existing schema and feedback migrations.

ALTER TABLE public.enrollments
  ADD COLUMN IF NOT EXISTS student_name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS phone TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS college TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS year TEXT NOT NULL DEFAULT '3rd Year',
  ADD COLUMN IF NOT EXISTS fee_amount INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS payment_id TEXT,
  ADD COLUMN IF NOT EXISTS order_id TEXT,
  ADD COLUMN IF NOT EXISTS payment_method TEXT;

ALTER TABLE public.enrollments
  DROP CONSTRAINT IF EXISTS enrollments_payment_method_check;

ALTER TABLE public.enrollments
  ADD CONSTRAINT enrollments_payment_method_check
  CHECK (payment_method IS NULL OR payment_method IN ('online_razorpay', 'offline'));

CREATE UNIQUE INDEX IF NOT EXISTS enrollments_order_id_unique
  ON public.enrollments (order_id)
  WHERE order_id IS NOT NULL;

INSERT INTO public.courses (
  slug,
  title,
  short_desc,
  description,
  fee,
  duration,
  mode,
  batch_start_date,
  is_active
)
VALUES (
  'verilog-hdl-rtl-design',
  'Verilog HDL, RTL Design & Digital Projects',
  'Build end-to-end digital design skills with synthesizable Verilog, RTL verification, and practical hardware projects.',
  'This comprehensive programme takes students from digital logic fundamentals through synthesizable RTL design, verification, and applied hardware projects. Build combinational and sequential modules, Mealy and Moore state machines, and self-checking testbenches, then apply those skills to UART controllers, clock-domain-crossing FIFOs, and a pipelined 32-bit ALU. The programme also covers simulation, synthesis checks, FPGA constraints, debugging, and project documentation.',
  1000,
  '4 weeks',
  'Live online',
  DATE '2027-01-01',
  true
)
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  short_desc = EXCLUDED.short_desc,
  description = EXCLUDED.description,
  fee = EXCLUDED.fee,
  duration = EXCLUDED.duration,
  mode = EXCLUDED.mode,
  batch_start_date = EXCLUDED.batch_start_date,
  is_active = EXCLUDED.is_active;

INSERT INTO public.course_private (course_id)
SELECT id
FROM public.courses
WHERE slug = 'verilog-hdl-rtl-design'
ON CONFLICT (course_id) DO NOTHING;

CREATE OR REPLACE FUNCTION public.set_enrollment_fee()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_catalog
AS $$
BEGIN
  SELECT fee INTO NEW.fee_amount
  FROM public.courses
  WHERE id = NEW.course_id AND is_active = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course is not available for enrollment';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_enrollment_fee_before_insert ON public.enrollments;
CREATE TRIGGER set_enrollment_fee_before_insert
  BEFORE INSERT ON public.enrollments
  FOR EACH ROW EXECUTE FUNCTION public.set_enrollment_fee();

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
    CASE
      WHEN lower(NEW.email) IN (
        'tbabhimanue06@gmail.com',
        'tbabhimanue6@gmail.com',
        'basilthankachan274@gmail.com'
      ) THEN 'admin'
      ELSE 'student'
    END
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

UPDATE public.profiles
SET role = 'admin'
WHERE lower(email) IN (
  'tbabhimanue06@gmail.com',
  'tbabhimanue6@gmail.com',
  'basilthankachan274@gmail.com'
);

DROP POLICY IF EXISTS enrollments_insert_policy ON public.enrollments;
CREATE POLICY enrollments_insert_policy ON public.enrollments
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND lower(email) = lower(auth.jwt()->>'email')
  );

DROP POLICY IF EXISTS enrollments_delete_policy ON public.enrollments;
CREATE POLICY enrollments_delete_policy ON public.enrollments
  FOR DELETE
  USING (public.is_admin() OR (user_id = auth.uid() AND status = 'pending'));

REVOKE ALL ON public.profiles, public.enrollments, public.course_private FROM anon;
GRANT SELECT ON public.courses TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON public.profiles, public.enrollments, public.course_private, public.courses
  TO authenticated;
GRANT ALL
  ON public.profiles, public.enrollments, public.course_private, public.courses
  TO service_role;
