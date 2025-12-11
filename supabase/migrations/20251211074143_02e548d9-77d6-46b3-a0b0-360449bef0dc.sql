-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function for role checking
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policy for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  display_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (new.id, new.raw_user_meta_data ->> 'display_name');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'user');
  
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add is_anonymous column to pain_points
ALTER TABLE public.pain_points ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;

-- Create comments table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pain_point_id UUID REFERENCES public.pain_points(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view comments"
ON public.comments
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can create comments"
ON public.comments
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Update pain_points policies for authenticated users only
DROP POLICY IF EXISTS "Anyone can view approved pain points" ON public.pain_points;
DROP POLICY IF EXISTS "Anyone can submit pain points" ON public.pain_points;

CREATE POLICY "Authenticated users can view approved pain points"
ON public.pain_points
FOR SELECT
TO authenticated
USING (is_approved = true);

CREATE POLICY "Admins can view all pain points"
ON public.pain_points
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Authenticated users can submit pain points"
ON public.pain_points
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Admins can update pain points"
ON public.pain_points
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update upvotes policies
DROP POLICY IF EXISTS "Anyone can upvote" ON public.upvotes;
DROP POLICY IF EXISTS "Anyone can view upvotes" ON public.upvotes;

CREATE POLICY "Authenticated users can upvote"
ON public.upvotes
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Authenticated users can view upvotes"
ON public.upvotes
FOR SELECT
TO authenticated
USING (true);