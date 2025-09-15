-- Fix Supabase Database Trigger for User Profile Creation
-- Run this in your Supabase SQL Editor to fix the signup issue

-- 1. First, let's see what triggers exist
-- SELECT * FROM information_schema.triggers WHERE event_object_table = 'users';

-- 2. Drop the existing problematic trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 3. Drop the existing function if it exists
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 4. Create a new, improved function that handles null values properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into profiles table with proper null handling
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    avatar_url, 
    isPersonalized, 
    plan,
    access_level,
    plan_level
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    COALESCE(
      NEW.raw_user_meta_data->>'name', 
      NEW.raw_user_meta_data->>'full_name', 
      COALESCE(NEW.email, 'user'),
      'New User'
    ),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL),
    false,
    'basic',
    'standard',
    'standard'
  );
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Ensure proper permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.scripts TO anon, authenticated;
GRANT ALL ON public.folders TO anon, authenticated;
GRANT ALL ON public.clients TO anon, authenticated;
GRANT ALL ON public.notifications TO anon, authenticated;
GRANT ALL ON public.watched_trends TO anon, authenticated;

-- 7. Enable Row Level Security and create policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Create new policies
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 8. Test the function (optional - you can run this to test)
-- SELECT public.handle_new_user();

-- 9. Check if there are any existing profiles with null names and fix them
UPDATE profiles 
SET name = COALESCE(name, email, 'User ' || substring(id::text, 1, 8))
WHERE name IS NULL;

-- 10. Make sure the name column allows nulls temporarily, then fix the data
-- (This is a safety measure in case the above update doesn't work)
ALTER TABLE profiles ALTER COLUMN name DROP NOT NULL;

-- Update any remaining null names
UPDATE profiles 
SET name = COALESCE(name, email, 'User ' || substring(id::text, 1, 8))
WHERE name IS NULL;

-- Make name NOT NULL again
ALTER TABLE profiles ALTER COLUMN name SET NOT NULL;
