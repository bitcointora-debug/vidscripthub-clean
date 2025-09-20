-- Supabase Email Automation Setup
-- Run this in your Supabase SQL Editor

-- 1. Create email logs table
CREATE TABLE IF NOT EXISTS email_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  email_type TEXT NOT NULL CHECK (email_type IN ('welcome', 'nurture1', 'nurture2', 'abandoned_cart', 'custom')),
  resend_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'bounced')),
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence_type TEXT NOT NULL CHECK (sequence_type IN ('welcome', 'nurture', 'abandoned_cart')),
  current_step INTEGER DEFAULT 1,
  total_steps INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_sequences_user_id ON email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_active ON email_sequences(is_active);

-- 4. Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email sequences" ON email_sequences
  FOR SELECT USING (auth.uid() = user_id);

-- 6. Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON email_logs TO anon, authenticated;
GRANT ALL ON email_sequences TO anon, authenticated;

-- 7. Function to send welcome email (simplified version)
CREATE OR REPLACE FUNCTION send_welcome_email(user_email TEXT, user_name TEXT, user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  -- Log the email send
  INSERT INTO email_logs (user_id, email, email_type, status)
  VALUES (user_uuid, user_email, 'welcome', 'pending');
  
  -- Start nurture sequence
  INSERT INTO email_sequences (user_id, sequence_type, total_steps)
  VALUES (user_uuid, 'nurture', 3);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Trigger for new user signups
CREATE OR REPLACE FUNCTION trigger_send_welcome_email()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the welcome email function
  PERFORM send_welcome_email(
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 9. Create the trigger
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON auth.users;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_send_welcome_email();

-- 10. Success message
SELECT 'Email automation setup completed successfully!' as message;






