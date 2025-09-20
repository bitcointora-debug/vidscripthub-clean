const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
const emailTemplates = {
  welcome: {
    subject: "Welcome to VidScriptHub! 🚀 Your Viral Script Journey Starts Now",
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
            <h2>Hi {{name}}! 👋</h2>
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
              <a href="{{dashboardUrl}}" class="cta-button">🚀 Start Creating Viral Content</a>
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
    `
  },

  nurture1: {
    subject: "🔥 The Secret Behind Viral Videos (Most Creators Miss This)",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Viral Video Secrets</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #0F0A2A; color: #ffffff; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1A0F3C, #0F0A2A); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
          .content { background: rgba(26, 15, 60, 0.5); padding: 30px; border-radius: 10px; margin-bottom: 20px; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #DAFF00, #B8E600); color: #1A0F3C; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; }
          .tip-box { background: rgba(255, 215, 0, 0.1); border: 1px solid #FFD700; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #DAFF00; margin: 0;">The Viral Video Secret</h1>
          </div>
          
          <div class="content">
            <h2>Hi {{name}}! 👋</h2>
            <p>I wanted to share something that changed everything for our top creators...</p>
            
            <div class="tip-box">
              <h3 style="color: #FFD700;">💡 The #1 Mistake Most Creators Make:</h3>
              <p><strong>They focus on the content, not the hook.</strong></p>
              <p>The first 3 seconds determine if your video goes viral or dies. That's why our AI analyzes the top 1% of viral videos to create hooks that actually work.</p>
            </div>
            
            <p>Want to see this in action? Check out our "Viral Hook Generator" - it's been responsible for over 2 million views for our users!</p>
            
            <div style="text-align: center;">
              <a href="{{dashboardUrl}}" class="cta-button">🎯 Try the Viral Hook Generator</a>
            </div>
            
            <p><em>Tomorrow, I'll show you the exact formula we use to make any topic go viral...</em></p>
          </div>
          
          <div class="footer">
            <p>Keep creating amazing content!</p>
            <p>© 2024 VidScriptHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  },

  abandonedCart: {
    subject: "⏰ Don't Miss Out! Your Viral Script Generator is Waiting...",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Complete Your Purchase</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #0F0A2A; color: #ffffff; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1A0F3C, #0F0A2A); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
          .content { background: rgba(26, 15, 60, 0.5); padding: 30px; border-radius: 10px; margin-bottom: 20px; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #DAFF00, #B8E600); color: #1A0F3C; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; }
          .urgency-box { background: rgba(255, 0, 0, 0.1); border: 1px solid #FF0000; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #DAFF00; margin: 0;">Complete Your Purchase</h1>
          </div>
          
          <div class="content">
            <h2>Hi {{name}}! 👋</h2>
            <p>I noticed you were interested in VidScriptHub but didn't complete your purchase...</p>
            
            <div class="urgency-box">
              <h3 style="color: #FF0000;">⏰ Limited Time Offer!</h3>
              <p><strong>Get lifetime access for just $27!</strong></p>
              <p>This special pricing expires in 24 hours. After that, the price goes back to $497.</p>
            </div>
            
            <p><strong>What you're missing out on:</strong></p>
            <ul>
              <li>Unlimited viral script generation</li>
              <li>AI-powered trend analysis</li>
              <li>Multi-platform optimization</li>
              <li>30-day money-back guarantee</li>
            </ul>
            
            <div style="text-align: center;">
              <a href="{{checkoutUrl}}" class="cta-button">🚀 Complete Your Purchase Now</a>
            </div>
            
            <p><em>Questions? Reply to this email and I'll help you get started!</em></p>
          </div>
          
          <div class="footer">
            <p>Don't let this opportunity slip away!</p>
            <p>© 2024 VidScriptHub. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
};

export default async (req, context) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { email, name, type, customData } = await req.json();

    if (!email || !name || !type) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let template;
    let html;

    switch (type) {
      case 'welcome':
        template = emailTemplates.welcome;
        html = template.html
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{dashboardUrl\}\}/g, `${process.env.SITE_URL || 'https://vidscripthub.com'}/dashboard`);
        break;

      case 'nurture1':
        template = emailTemplates.nurture1;
        html = template.html
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{dashboardUrl\}\}/g, `${process.env.SITE_URL || 'https://vidscripthub.com'}/dashboard`);
        break;

      case 'abandonedCart':
        template = emailTemplates.abandonedCart;
        html = template.html
          .replace(/\{\{name\}\}/g, name)
          .replace(/\{\{checkoutUrl\}\}/g, `${process.env.SITE_URL || 'https://vidscripthub.com'}/checkout`);
        break;

      default:
        return new Response(JSON.stringify({ error: 'Invalid email type' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    // For testing mode, we need to send to the verified email address
    // In production, you'll need to verify your domain
    const { data, error } = await resend.emails.send({
      from: 'VidScriptHub <onboarding@resend.dev>',
      to: ['bitcointora@gmail.com'], // Testing mode - only verified email
      subject: template.subject,
      html: html,
      // Add reply-to header so responses go to the original email
      reply_to: email,
    });

    if (error) {
      console.error('Error sending email:', error);
      return new Response(JSON.stringify({ error: 'Failed to send email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log email sent for analytics
    console.log('Email sent successfully:', { type, email, data });

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Email sent successfully',
      data 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
