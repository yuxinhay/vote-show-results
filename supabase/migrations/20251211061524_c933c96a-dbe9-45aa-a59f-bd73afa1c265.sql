-- Create polls table
CREATE TABLE public.polls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create poll_options table
CREATE TABLE public.poll_options (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create votes table
CREATE TABLE public.votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
  option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for polls (public read)
CREATE POLICY "Anyone can view active polls" 
ON public.polls 
FOR SELECT 
USING (is_active = true);

-- RLS policies for poll_options (public read)
CREATE POLICY "Anyone can view poll options" 
ON public.poll_options 
FOR SELECT 
USING (true);

-- RLS policies for votes (public insert and read for counts)
CREATE POLICY "Anyone can vote" 
ON public.votes 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can view votes" 
ON public.votes 
FOR SELECT 
USING (true);

-- Create indexes for better performance
CREATE INDEX idx_poll_options_poll_id ON public.poll_options(poll_id);
CREATE INDEX idx_votes_poll_id ON public.votes(poll_id);
CREATE INDEX idx_votes_option_id ON public.votes(option_id);

-- Insert sample poll
INSERT INTO public.polls (question) VALUES ('What is your favorite programming language?');

-- Insert sample options (get the poll id from the insert)
INSERT INTO public.poll_options (poll_id, option_text)
SELECT id, 'JavaScript' FROM public.polls WHERE question = 'What is your favorite programming language?'
UNION ALL
SELECT id, 'TypeScript' FROM public.polls WHERE question = 'What is your favorite programming language?'
UNION ALL
SELECT id, 'Python' FROM public.polls WHERE question = 'What is your favorite programming language?'
UNION ALL
SELECT id, 'Rust' FROM public.polls WHERE question = 'What is your favorite programming language?'
UNION ALL
SELECT id, 'Go' FROM public.polls WHERE question = 'What is your favorite programming language?';