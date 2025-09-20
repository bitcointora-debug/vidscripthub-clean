-- Create email logs table
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

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_email ON email_logs(email);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON email_logs(status);

-- Create email sequences table for automation
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

-- Create index for email sequences
CREATE INDEX IF NOT EXISTS idx_email_sequences_user_id ON email_sequences(user_id);
CREATE INDEX IF NOT EXISTS idx_email_sequences_active ON email_sequences(is_active);

-- Function to automatically send welcome email when user signs up
CREATE OR REPLACE FUNCTION send_welcome_email_trigger()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Supabase Edge Function to send welcome email
  PERFORM net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/send-welcome-email',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key') || '"}'::jsonb,
    body := json_build_object(
      'email', NEW.email,
      'name', COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
      'user_id', NEW.id
    )::jsonb
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS trigger_send_welcome_email ON auth.users;
CREATE TRIGGER trigger_send_welcome_email
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION send_welcome_email_trigger();

-- Function to log email events from Resend webhooks
CREATE OR REPLACE FUNCTION log_email_event(event_data JSONB)
RETURNS VOID AS $$
DECLARE
  email_log_id UUID;
  resend_id TEXT;
  event_type TEXT;
BEGIN
  resend_id := event_data->>'id';
  event_type := event_data->>'type';
  
  -- Find the email log by resend_id
  SELECT id INTO email_log_id 
  FROM email_logs 
  WHERE resend_id = log_email_event.resend_id;
  
  IF email_log_id IS NOT NULL THEN
    -- Update the email log based on event type
    CASE event_type
      WHEN 'email.delivered' THEN
        UPDATE email_logs 
        SET status = 'delivered', delivered_at = NOW(), updated_at = NOW()
        WHERE id = email_log_id;
      WHEN 'email.bounced' THEN
        UPDATE email_logs 
        SET status = 'bounced', error_message = event_data->>'reason', updated_at = NOW()
        WHERE id = email_log_id;
      WHEN 'email.complained' THEN
        UPDATE email_logs 
        SET status = 'bounced', error_message = 'Complaint received', updated_at = NOW()
        WHERE id = email_log_id;
    END CASE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to start nurture sequence for new users
CREATE OR REPLACE FUNCTION start_nurture_sequence()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert nurture sequence for new user
  INSERT INTO email_sequences (user_id, sequence_type, total_steps)
  VALUES (NEW.id, 'nurture', 3);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to start nurture sequence
DROP TRIGGER IF EXISTS trigger_start_nurture_sequence ON auth.users;
CREATE TRIGGER trigger_start_nurture_sequence
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION start_nurture_sequence();

-- Function to send nurture emails (can be called by cron job)
CREATE OR REPLACE FUNCTION send_nurture_emails()
RETURNS VOID AS $$
DECLARE
  sequence_record RECORD;
  email_template TEXT;
  email_subject TEXT;
BEGIN
  -- Find active nurture sequences that need next email
  FOR sequence_record IN 
    SELECT es.*, u.email, u.raw_user_meta_data
    FROM email_sequences es
    JOIN auth.users u ON es.user_id = u.id
    WHERE es.sequence_type = 'nurture' 
      AND es.is_active = true 
      AND es.current_step <= es.total_steps
      AND es.started_at < NOW() - INTERVAL '1 day' * (es.current_step - 1)
  LOOP
    -- Determine email template based on current step
    CASE sequence_record.current_step
      WHEN 1 THEN
        email_subject := '🔥 The Secret Behind Viral Videos (Most Creators Miss This)';
        email_template := 'nurture1';
      WHEN 2 THEN
        email_subject := '📈 This Creator Went from 0 to 1M Views in 30 Days (Here''s How)';
        email_template := 'nurture2';
      WHEN 3 THEN
        email_subject := '🎯 Your Next Viral Video is Just One Click Away';
        email_template := 'nurture3';
    END CASE;
    
    -- Send the email (this would call your Resend function)
    -- For now, just log it
    INSERT INTO email_logs (user_id, email, email_type, status)
    VALUES (
      sequence_record.user_id, 
      sequence_record.email, 
      email_template, 
      'pending'
    );
    
    -- Update sequence step
    UPDATE email_sequences 
    SET current_step = current_step + 1, updated_at = NOW()
    WHERE id = sequence_record.id;
    
    -- Mark sequence as completed if all steps done
    IF sequence_record.current_step >= sequence_record.total_steps THEN
      UPDATE email_sequences 
      SET is_active = false, completed_at = NOW(), updated_at = NOW()
      WHERE id = sequence_record.id;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable Row Level Security
ALTER TABLE email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own email logs" ON email_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email sequences" ON email_sequences
  FOR SELECT USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON email_logs TO anon, authenticated;
GRANT ALL ON email_sequences TO anon, authenticated;






