-- Fix RLS: make SELECT policies permissive so authenticated users can read vote/comment data

-- comments
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.comments;
CREATE POLICY "Authenticated users can view comments"
ON public.comments
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);

-- upvotes
DROP POLICY IF EXISTS "Authenticated users can view upvotes" ON public.upvotes;
CREATE POLICY "Authenticated users can view upvotes"
ON public.upvotes
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (true);
