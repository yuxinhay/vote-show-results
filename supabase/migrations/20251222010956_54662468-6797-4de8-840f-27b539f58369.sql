-- Add temporary public read access for testing (REMOVE AFTER TESTING!)
CREATE POLICY "Temporary public read access" 
ON interest_registrations 
FOR SELECT 
USING (true);