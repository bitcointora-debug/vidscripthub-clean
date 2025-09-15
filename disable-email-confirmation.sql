-- Disable Email Confirmation in Supabase
-- Run this in your Supabase SQL Editor

-- 1. Update auth settings to disable email confirmation
UPDATE auth.config 
SET 
  mailer_autoconfirm = true,
  phone_autoconfirm = true
WHERE id = 1;

-- 2. If the above doesn't work, try this alternative approach
-- This sets the email confirmation to be bypassed
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email_confirmed_at IS NULL;

-- 3. Create a function to auto-confirm new users
CREATE OR REPLACE FUNCTION auth.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-confirm the user's email
  UPDATE auth.users 
  SET email_confirmed_at = NOW() 
  WHERE id = NEW.id;
  
  -- Create profile
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
    RAISE WARNING 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create/update the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION auth.handle_new_user();
