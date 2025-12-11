-- Add status column to pain_points table
ALTER TABLE public.pain_points 
ADD COLUMN status TEXT NOT NULL DEFAULT 'pending';

-- Migrate existing data based on is_approved
UPDATE public.pain_points SET status = 'approved' WHERE is_approved = true;
UPDATE public.pain_points SET status = 'pending' WHERE is_approved = false;

-- Drop old RLS policies that use is_approved
DROP POLICY IF EXISTS "Authenticated users can view approved pain points" ON public.pain_points;

-- Create new RLS policy for viewing approved pain points
CREATE POLICY "Authenticated users can view approved pain points" 
ON public.pain_points 
FOR SELECT 
USING (status = 'approved');

-- Update admin view policy (keep existing)
-- Admins can already view all pain points via has_role policy