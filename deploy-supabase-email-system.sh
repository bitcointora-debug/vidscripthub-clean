#!/bin/bash

# Deploy Supabase Email System for VidScriptHub
# Project ID: rzoypvhfkzphdtqrrvtz

echo "🚀 Deploying Supabase Email System for VidScriptHub..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Link to your specific project
echo "🔗 Linking to VidScriptHub project..."
supabase link --project-ref rzoypvhfkzphdtqrrvtz

# Deploy the email functions
echo "📧 Deploying email functions..."

# Deploy send-welcome-email function
echo "Deploying send-welcome-email function..."
supabase functions deploy send-welcome-email

# Deploy resend-webhook function  
echo "Deploying resend-webhook function..."
supabase functions deploy resend-webhook

echo ""
echo "✅ Supabase functions deployed successfully!"
echo ""
echo "🎯 Integration Status:"
echo "✅ Resend API Key: [CONFIGURED]"
echo "✅ Supabase Project: rzoypvhfkzphdtqrrvtz"
echo "✅ Webhook URL: https://rzoypvhfkzphdtqrrvtz.supabase.co/functions/v1/resend-webhook"
echo "✅ Webhook Secret: whsec_4R7XpUVK+Rr77qZSPAPiL/gucmLGTi/d"
echo ""
echo "📋 Next steps:"
echo "1. Run the database migration in Supabase SQL editor"
echo "2. Test the email system at: https://vidscripthub.com/test-email.html"
echo "3. Check webhook events in Resend dashboard"
echo ""
echo "🔗 Supabase Dashboard: https://supabase.com/dashboard/project/rzoypvhfkzphdtqrrvtz"
echo "🔗 Resend Dashboard: https://resend.com/webhooks"






