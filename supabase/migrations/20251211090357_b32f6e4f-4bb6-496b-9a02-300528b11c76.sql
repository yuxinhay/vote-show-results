-- Add is_anonymous column to comments table
ALTER TABLE public.comments 
ADD COLUMN is_anonymous BOOLEAN NOT NULL DEFAULT false;