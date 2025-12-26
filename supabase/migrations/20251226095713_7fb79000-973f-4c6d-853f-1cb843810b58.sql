-- Update RLS policies to require authentication instead of public access

-- Drop existing public SELECT policies
DROP POLICY IF EXISTS "Anyone can view comments" ON public.comments;
DROP POLICY IF EXISTS "Authenticated users can view approved pain points" ON public.pain_points;
DROP POLICY IF EXISTS "Anyone can view active polls" ON public.polls;
DROP POLICY IF EXISTS "Anyone can view poll options" ON public.poll_options;
DROP POLICY IF EXISTS "Anyone can view upvotes" ON public.upvotes;
DROP POLICY IF EXISTS "Anyone can view votes" ON public.votes;
DROP POLICY IF EXISTS "Anyone can vote" ON public.votes;

-- Recreate policies requiring authentication
CREATE POLICY "Authenticated users can view comments" 
ON public.comments 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view approved pain points" 
ON public.pain_points 
FOR SELECT 
TO authenticated
USING (status = 'approved');

CREATE POLICY "Authenticated users can view active polls" 
ON public.polls 
FOR SELECT 
TO authenticated
USING (is_active = true);

CREATE POLICY "Authenticated users can view poll options" 
ON public.poll_options 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view upvotes" 
ON public.upvotes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can view votes" 
ON public.votes 
FOR SELECT 
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.votes 
FOR INSERT 
TO authenticated
WITH CHECK (true);