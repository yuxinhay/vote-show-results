
-- Drop the restrictive policy and recreate as permissive
DROP POLICY IF EXISTS "Authenticated users can view approved pain points" ON public.pain_points;

-- Create permissive policy to allow viewing approved pain points (for everyone including anon)
CREATE POLICY "Anyone can view approved pain points" 
ON public.pain_points 
FOR SELECT 
USING (status = 'approved');
