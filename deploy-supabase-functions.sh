#!/bin/bash

# Deploy Supabase Edge Functions for Email Automation
# Make sure you have Supabase CLI installed: npm install -g supabase

echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Installing..."
    npm install -g supabase
fi

# Login to Supabase (if not already logged in)
echo "🔐 Logging into Supabase..."
supabase login

# Link to your project (replace with your project reference)
echo "🔗 Linking to your Supabase project..."
echo "Please run: supabase link --project-ref YOUR_PROJECT_REF"
echo "You can find your project reference in your Supabase dashboard URL"

# Deploy the functions
echo "📧 Deploying email functions..."

# Deploy send-welcome-email function
supabase functions deploy send-welcome-email

# Deploy resend-webhook function  
supabase functions deploy resend-webhook

echo "✅ Supabase functions deployed successfully!"
echo ""
echo "🎯 Next steps:"
echo "1. Run the database migration in Supabase SQL editor"
echo "2. Configure Resend webhooks"
echo "3. Test the integration"






