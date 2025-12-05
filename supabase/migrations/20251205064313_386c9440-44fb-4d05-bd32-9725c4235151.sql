-- Add INSERT policy for admins on editable_content
CREATE POLICY "Admins can insert content"
ON public.editable_content
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Add DELETE policy for admins on editable_content
CREATE POLICY "Admins can delete content"
ON public.editable_content
FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));