CREATE TABLE IF NOT EXISTS public.student_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL CHECK (char_length(quote) BETWEEN 1 AND 3000),
  author TEXT NOT NULL CHECK (char_length(author) BETWEEN 1 AND 120),
  note TEXT NOT NULL DEFAULT '' CHECK (char_length(note) <= 160),
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.student_feedback ENABLE ROW LEVEL SECURITY;

GRANT INSERT ON TABLE public.student_feedback TO anon, authenticated;
GRANT SELECT, DELETE ON TABLE public.student_feedback TO authenticated;

DROP POLICY IF EXISTS "student_feedback_public_insert" ON public.student_feedback;
CREATE POLICY "student_feedback_public_insert"
  ON public.student_feedback FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "student_feedback_admin_select" ON public.student_feedback;
CREATE POLICY "student_feedback_admin_select"
  ON public.student_feedback FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'tbabhimanue06@gmail.com',
      'tbabhimanue6@gmail.com',
      'basilthankachan274@gmail.com',
      'admin@exsitechnologies.com'
    )
  );

DROP POLICY IF EXISTS "student_feedback_admin_delete" ON public.student_feedback;
CREATE POLICY "student_feedback_admin_delete"
  ON public.student_feedback FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'email') IN (
      'tbabhimanue06@gmail.com',
      'tbabhimanue6@gmail.com',
      'basilthankachan274@gmail.com',
      'admin@exsitechnologies.com'
    )
  );