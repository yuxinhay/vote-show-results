-- Remove the temporary public read access policy that was added for testing
DROP POLICY IF EXISTS "Temporary public read access" ON public.interest_registrations;