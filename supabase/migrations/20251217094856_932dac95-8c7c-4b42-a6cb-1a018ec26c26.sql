-- Allow public (anon + authenticated) read access for vote/comment visibility

-- comments: anyone can view
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.comments;
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments"
ON public.comments
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- upvotes: anyone can view
DROP POLICY IF EXISTS "Authenticated users can view upvotes" ON public.upvotes;
DROP POLICY IF EXISTS "Anyone can view upvotes" ON public.upvotes;
CREATE POLICY "Anyone can view upvotes"
ON public.upvotes
AS PERMISSIVE
FOR SELECT
TO public
USING (true);
