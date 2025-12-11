-- Create pain_points table for staff submissions
CREATE TABLE public.pain_points (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  submitter_name TEXT NOT NULL,
  submitter_department TEXT,
  is_approved BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create upvotes table for tracking votes
CREATE TABLE public.upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pain_point_id UUID NOT NULL REFERENCES public.pain_points(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pain_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- RLS policies for pain_points
CREATE POLICY "Anyone can view approved pain points" 
ON public.pain_points 
FOR SELECT 
USING (is_approved = true);

CREATE POLICY "Anyone can submit pain points" 
ON public.pain_points 
FOR INSERT 
WITH CHECK (true);

-- RLS policies for upvotes
CREATE POLICY "Anyone can view upvotes" 
ON public.upvotes 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can upvote" 
ON public.upvotes 
FOR INSERT 
WITH CHECK (true);

-- Insert sample pain points
INSERT INTO public.pain_points (title, submitter_name, submitter_department, created_at) VALUES
('Slow VPN connection affecting remote work productivity', 'John Tan', 'IT', now() - interval '5 days'),
('Meeting room booking system is confusing and outdated', 'Sarah Lee', 'HR', now() - interval '3 days'),
('Lack of clear documentation for internal processes', 'Mike Wong', 'Operations', now() - interval '2 days'),
('Too many approval layers for simple requests', 'Lisa Chen', 'Finance', now() - interval '1 day');