-- Add supervisor_email column to interest_registrations table
ALTER TABLE public.interest_registrations
ADD COLUMN supervisor_email text;