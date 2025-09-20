import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the request body
    const { email, name, user_id } = await req.json()

    if (!email || !name) {
      return new Response(
        JSON.stringify({ error: 'Email and name are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Send welcome email via Resend
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'VidScriptHub <noreply@vidscripthub.com>',
        to: [email],
        subject: 'Welcome to VidScriptHub! 🚀 Your Viral Script Journey Starts Now',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to VidScriptHub</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #0F0A2A; color: #ffffff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #1A0F3C, #0F0A2A); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
              .logo { font-size: 28px; font-weight: bold; color: #DAFF00; margin-bottom: 10px; }
              .content { background: rgba(26, 15, 60, 0.5); padding: 30px; border-radius: 10px; margin-bottom: 20px; }
              .cta-button { display: inline-block; background: linear-gradient(45deg, #DAFF00, #B8E600); color: #1A0F3C; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; color: #999; font-size: 12px; }
              .benefits { background: rgba(26, 15, 60, 0.3); padding: 20px; border-radius: 8px; margin: 20px 0; }
              .benefit-item { margin: 10px 0; padding-left: 20px; position: relative; }
              .benefit-item:before { content: "✓"; color: #DAFF00; font-weight: bold; position: absolute; left: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="logo">🎬 VidScriptHub</div>
                <h1 style="color: #DAFF00; margin: 0;">Welcome to the Future of Viral Content!</h1>
              </div>
              
              <div class="content">
                <h2>Hi ${name}! 👋</h2>
                <p>Welcome to VidScriptHub - the AI-powered platform that's helping creators go viral in 37 seconds!</p>
                
                <div class="benefits">
                  <h3 style="color: #DAFF00;">What you can do right now:</h3>
                  <div class="benefit-item">Generate unlimited viral scripts with AI</div>
                  <div class="benefit-item">Access our viral hook database</div>
                  <div class="benefit-item">Get platform-specific optimizations</div>
                  <div class="benefit-item">Join our community of successful creators</div>
                </div>
                
                <p><strong>Your first viral script is just one click away!</strong></p>
                
                <div style="text-align: center;">
                  <a href="${Deno.env.get('SITE_URL') || 'https://vidscripthub.com'}/dashboard" class="cta-button">🚀 Start Creating Viral Content</a>
                </div>
                
                <p><em>Pro Tip:</em> Check out our "Viral Scripts Library" for inspiration and see what's trending right now!</p>
              </div>
              
              <div class="footer">
                <p>Questions? Reply to this email - we're here to help!</p>
                <p>© 2024 VidScriptHub. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `,
      }),
    })

    if (!emailResponse.ok) {
      const errorData = await emailResponse.json()
      throw new Error(`Resend API error: ${errorData.message || 'Unknown error'}`)
    }

    const emailData = await emailResponse.json()

    // Log the email send in Supabase
    const { error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        user_id: user_id,
        email: email,
        email_type: 'welcome',
        resend_id: emailData.id,
        status: 'sent',
        sent_at: new Date().toISOString(),
      })

    if (logError) {
      console.error('Error logging email:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Welcome email sent successfully',
        email_id: emailData.id 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error in send-welcome-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})






