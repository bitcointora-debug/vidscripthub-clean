import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Webhook signature verification function
async function verifyWebhookSignature(payload: string, signature: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder()
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signatureBuffer = Uint8Array.from(atob(signature), c => c.charCodeAt(0))
    const payloadBuffer = encoder.encode(payload)
    
    const expectedSignature = await crypto.subtle.sign('HMAC', key, payloadBuffer)
    const expectedSignatureBuffer = new Uint8Array(expectedSignature)
    
    if (signatureBuffer.length !== expectedSignatureBuffer.length) {
      return false
    }
    
    for (let i = 0; i < signatureBuffer.length; i++) {
      if (signatureBuffer[i] !== expectedSignatureBuffer[i]) {
        return false
      }
    }
    
    return true
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the raw body for signature verification
    const body = await req.text()
    const signature = req.headers.get('resend-signature')
    const webhookSecret = Deno.env.get('RESEND_WEBHOOK_SECRET') || 'whsec_4R7XpUVK+Rr77qZSPAPiL/gucmLGTi/d'
    
    // Verify webhook signature
    if (signature && webhookSecret) {
      const isValid = await verifyWebhookSignature(body, signature, webhookSecret)
      if (!isValid) {
        console.error('Invalid webhook signature')
        return new Response(
          JSON.stringify({ error: 'Invalid signature' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Parse the webhook payload
    const payload = JSON.parse(body)
    console.log('Resend webhook payload:', payload)

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Handle different event types
    const eventType = payload.type
    const emailId = payload.data?.id || payload.id

    switch (eventType) {
      case 'email.sent':
        await supabaseClient
          .from('email_logs')
          .update({ 
            status: 'sent',
            resend_id: emailId,
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      case 'email.delivered':
        await supabaseClient
          .from('email_logs')
          .update({ 
            status: 'delivered',
            delivered_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      case 'email.bounced':
        await supabaseClient
          .from('email_logs')
          .update({ 
            status: 'bounced',
            error_message: payload.data?.reason || 'Email bounced',
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      case 'email.complained':
        await supabaseClient
          .from('email_logs')
          .update({ 
            status: 'bounced',
            error_message: 'Complaint received',
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      case 'email.opened':
        // Log email open event
        await supabaseClient
          .from('email_logs')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      case 'email.clicked':
        // Log email click event
        await supabaseClient
          .from('email_logs')
          .update({ 
            updated_at: new Date().toISOString()
          })
          .eq('resend_id', emailId)
        break

      default:
        console.log('Unhandled event type:', eventType)
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed' }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error processing Resend webhook:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
