-- Add registration_type column to distinguish participants from coaches
ALTER TABLE public.interest_registrations 
ADD COLUMN registration_type text NOT NULL DEFAULT 'participant';

-- Add a unique constraint to prevent users from registering as both participant and coach
CREATE UNIQUE INDEX interest_registrations_user_type_unique 
ON public.interest_registrations (user_id, registration_type);