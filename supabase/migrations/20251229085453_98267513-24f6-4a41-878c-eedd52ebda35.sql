-- Drop the restrictive SELECT policies and create permissive ones for public viewing

-- UPVOTES: Allow public viewing
DROP POLICY IF EXISTS "Authenticated users can view upvotes" ON public.upvotes;
CREATE POLICY "Anyone can view upvotes" 
ON public.upvotes 
FOR SELECT 
USING (true);

-- COMMENTS: Allow public viewing
DROP POLICY IF EXISTS "Authenticated users can view comments" ON public.comments;
CREATE POLICY "Anyone can view comments" 
ON public.comments 
FOR SELECT 
USING (true);