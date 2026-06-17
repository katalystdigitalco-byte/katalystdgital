DROP POLICY "anyone submits inquiry" ON public.contact_submissions;
CREATE POLICY "anyone submits inquiry" ON public.contact_submissions
  FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) > 0 AND length(email) > 0 AND length(project) > 0);