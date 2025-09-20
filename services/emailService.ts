import { Resend } from 'resend';

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Email templates
export const emailTemplates = {
  welcome: {
    subject: "Your FREE Viral Script Template is Ready! 🚀 (Worth $97)",
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
          .download-box { background: rgba(255, 215, 0, 0.1); border: 2px solid #DAFF00; padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; }
          .download-button { display: inline-block; background: linear-gradient(45deg, #FF6B35, #F7931E); color: white; padding: 18px 35px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 15px 0; font-size: 18px; box-shadow: 0 4px 15px rgba(255, 107, 53, 0.3); }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🎬 VidScriptHub</div>
            <h1 style="color: #DAFF00; margin: 0;">Your FREE Viral Script Template is Ready!</h1>
          </div>
          
          <div class="content">
            <h2>Hi {{name}}! 👋</h2>
            <p>Welcome to VidScriptHub! You just made the smartest decision for your content creation journey.</p>
            
            <div class="download-box">
              <h3 style="color: #DAFF00; margin-top: 0;">🎁 FREE GIFT: Viral Script Template</h3>
              <p style="font-size: 18px; margin: 15px 0;"><strong>Worth $97 - Yours FREE!</strong></p>
              <p>This isn't just any template - it's the <strong>exact formula</strong> that's generated millions of views across TikTok, Instagram Reels, and YouTube Shorts.</p>
              
              <div style="text-align: center; margin: 25px 0;">
                <a href="{{siteUrl}}/FREE_Viral_Script_Template.html" class="download-button">📥 Download Your FREE Script Template</a>
              </div>
              
              <div class="benefits">
                <h4 style="color: #DAFF00; margin-top: 0;">What you're getting:</h4>
                <div class="benefit-item">The proven 5-part viral structure</div>
                <div class="benefit-item">10 viral hooks you can steal and adapt</div>
                <div class="benefit-item">Platform-specific optimization tips</div>
                <div class="benefit-item">Success metrics to track</div>
                <div class="benefit-item">Pro tips for maximum virality</div>
              </div>
            </div>
            
            <p><strong>But here's the thing...</strong></p>
            <p>This template is just the beginning. While other creators are spending 6+ hours researching and writing scripts that get 200 views, you now have access to the same viral formulas that the top 1% of creators use.</p>
            
            <p><strong>Want to see how easy it is to create viral content?</strong></p>
            <p>Tomorrow, I'll show you how to use this template to create your first viral script in under 5 minutes.</p>
            
            <div style="text-align: center;">
              <a href="{{dashboardUrl}}" class="cta-button">🚀 Start Creating Viral Content</a>
            </div>
            
            <p><em>Until then, download your template and start thinking about:</em></p>
            <ul>
              <li>What problem does your audience struggle with?</li>
              <li>What solution can you provide?</li>
              <li>What proof do you have that it works?</li>
            </ul>
            
            <p><strong>Ready to go viral?</strong></p>
            <p>Keep an eye on your inbox tomorrow. I'm going to show you something that will blow your mind about viral content creation.</p>
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

  nurture2: {
    subject: "📈 This Creator Went from 0 to 1M Views in 30 Days (Here's How)",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Success Story</title>
        <style>
          body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #0F0A2A; color: #ffffff; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #1A0F3C, #0F0A2A); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
          .content { background: rgba(26, 15, 60, 0.5); padding: 30px; border-radius: 10px; margin-bottom: 20px; }
          .cta-button { display: inline-block; background: linear-gradient(45deg, #DAFF00, #B8E600); color: #1A0F3C; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; color: #999; font-size: 12px; }
          .testimonial { background: rgba(0, 255, 0, 0.1); border: 1px solid #00FF00; padding: 20px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #DAFF00; margin: 0;">From 0 to 1M Views in 30 Days</h1>
          </div>
          
          <div class="content">
            <h2>Hi {{name}}! 👋</h2>
            <p>Meet Sarah, a fitness creator who went from 0 followers to 1 million views in just 30 days using VidScriptHub...</p>
            
            <div class="testimonial">
              <h3 style="color: #00FF00;">💬 Sarah's Success Story:</h3>
              <p><em>"I was struggling to get even 100 views on my fitness videos. Then I found VidScriptHub and everything changed. My first viral script got 50K views in 24 hours! Now I'm at 1M+ views and growing my fitness business."</em></p>
              <p><strong>- Sarah M., Fitness Creator</strong></p>
            </div>
            
            <p><strong>What made the difference?</strong></p>
            <p>Sarah used our "Trending Topics" feature to find what was going viral in fitness, then used our AI to create scripts that matched the algorithm's preferences.</p>
            
            <div style="text-align: center;">
              <a href="{{dashboardUrl}}" class="cta-button">📊 Find Trending Topics in Your Niche</a>
            </div>
            
            <p><em>Tomorrow, I'll show you the exact posting schedule that maximizes viral potential...</em></p>
          </div>
          
          <div class="footer">
            <p>Your success story could be next!</p>
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

// Email service functions
export const emailService = {
  // Send welcome email
  async sendWelcomeEmail(email: string, name: string) {
    try {
      const template = emailTemplates.welcome;
      const html = template.html
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{dashboardUrl\}\}/g, `${process.env.SITE_URL}/dashboard`)
        .replace(/\{\{siteUrl\}\}/g, process.env.SITE_URL || 'https://vidscripthub.com');

      const { data, error } = await resend.emails.send({
        from: 'VidScriptHub <noreply@vidscripthub.com>',
        to: [email],
        subject: template.subject,
        html: html,
      });

      if (error) {
        console.error('Error sending welcome email:', error);
        return { success: false, error };
      }

      console.log('Welcome email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error };
    }
  },

  // Send nurture email
  async sendNurtureEmail(email: string, name: string, sequence: number) {
    try {
      const template = sequence === 1 ? emailTemplates.nurture1 : emailTemplates.nurture2;
      const html = template.html
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{dashboardUrl\}\}/g, `${process.env.SITE_URL}/dashboard`);

      const { data, error } = await resend.emails.send({
        from: 'VidScriptHub <noreply@vidscripthub.com>',
        to: [email],
        subject: template.subject,
        html: html,
      });

      if (error) {
        console.error('Error sending nurture email:', error);
        return { success: false, error };
      }

      console.log('Nurture email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending nurture email:', error);
      return { success: false, error };
    }
  },

  // Send abandoned cart email
  async sendAbandonedCartEmail(email: string, name: string) {
    try {
      const template = emailTemplates.abandonedCart;
      const html = template.html
        .replace(/\{\{name\}\}/g, name)
        .replace(/\{\{checkoutUrl\}\}/g, `${process.env.SITE_URL}/checkout`);

      const { data, error } = await resend.emails.send({
        from: 'VidScriptHub <noreply@vidscripthub.com>',
        to: [email],
        subject: template.subject,
        html: html,
      });

      if (error) {
        console.error('Error sending abandoned cart email:', error);
        return { success: false, error };
      }

      console.log('Abandoned cart email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending abandoned cart email:', error);
      return { success: false, error };
    }
  },

  // Send custom email
  async sendCustomEmail(email: string, subject: string, html: string) {
    try {
      const { data, error } = await resend.emails.send({
        from: 'VidScriptHub <noreply@vidscripthub.com>',
        to: [email],
        subject: subject,
        html: html,
      });

      if (error) {
        console.error('Error sending custom email:', error);
        return { success: false, error };
      }

      console.log('Custom email sent successfully:', data);
      return { success: true, data };
    } catch (error) {
      console.error('Error sending custom email:', error);
      return { success: false, error };
    }
  }
};


