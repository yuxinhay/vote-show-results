-- Create table for MIC programme interest registrations
CREATE TABLE public.interest_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_email TEXT NOT NULL,
  roles TEXT[] NOT NULL,
  acknowledged_commitment BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.interest_registrations ENABLE ROW LEVEL SECURITY;

-- Policy: Authenticated users can submit their interest
CREATE POLICY "Authenticated users can register interest"
ON public.interest_registrations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
ON public.interest_registrations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Admins can view all registrations
CREATE POLICY "Admins can view all registrations"
ON public.interest_registrations
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));