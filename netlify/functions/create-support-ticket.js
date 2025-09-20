const { Resend } = require('resend');

const resend = new Resend('re_AF4EQg7d_2DT8dE4zoXaRbYBGXy7Q8bS4');

// Support ticket email template
const supportTicketTemplate = {
  subject: "New Support Ticket Created - {{ticketId}}",
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Support Ticket Created</title>
      <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1A0F3C, #0F0A2A); padding: 30px; text-align: center; border-radius: 10px; margin-bottom: 20px; }
        .logo { font-size: 28px; font-weight: bold; color: #DAFF00; margin-bottom: 10px; }
        .content { background: white; padding: 30px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .ticket-info { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .priority { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; text-transform: uppercase; }
        .priority-urgent { background: #fee; color: #c53030; }
        .priority-high { background: #fef5e7; color: #dd6b20; }
        .priority-medium { background: #fefce8; color: #d69e2e; }
        .priority-low { background: #f0fff4; color: #38a169; }
        .footer { text-align: center; color: #666; font-size: 12px; }
        .cta-button { display: inline-block; background: linear-gradient(45deg, #DAFF00, #B8E600); color: #1A0F3C; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🎫 VidScriptHub Support</div>
          <h1 style="color: #DAFF00; margin: 0;">Support Ticket Created</h1>
        </div>
        
        <div class="content">
          <h2>Hi {{userName}}! 👋</h2>
          <p>Thank you for contacting VidScriptHub support. We've received your ticket and our team will get back to you soon.</p>
          
          <div class="ticket-info">
            <h3 style="margin-top: 0;">Ticket Details</h3>
            <p><strong>Ticket ID:</strong> {{ticketId}}</p>
            <p><strong>Subject:</strong> {{subject}}</p>
            <p><strong>Category:</strong> {{category}}</p>
            <p><strong>Priority:</strong> <span class="priority priority-{{priority}}">{{priority}}</span></p>
            <p><strong>Created:</strong> {{createdAt}}</p>
          </div>
          
          <h3>What happens next?</h3>
          <ul>
            <li>Our support team will review your ticket within 2 hours</li>
            <li>You'll receive a response via email</li>
            <li>We'll work to resolve your issue as quickly as possible</li>
            <li>You can track progress by replying to this email</li>
          </ul>
          
          <div style="text-align: center;">
            <a href="https://vidscripthub.com/support" class="cta-button">View Support Center</a>
          </div>
          
          <p><em>Need immediate assistance? You can also reach us via live chat on our website.</em></p>
        </div>
        
        <div class="footer">
          <p>Questions? Reply to this email - we're here to help!</p>
          <p>© 2024 VidScriptHub. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `
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
    const ticketData = await req.json();

    if (!ticketData.name || !ticketData.email || !ticketData.subject || !ticketData.description) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Generate ticket ID
    const ticketId = `TICKET-${Date.now()}`;
    const createdAt = new Date().toLocaleString();

    // Prepare email content
    const html = supportTicketTemplate.html
      .replace(/\{\{ticketId\}\}/g, ticketId)
      .replace(/\{\{userName\}\}/g, ticketData.name)
      .replace(/\{\{subject\}\}/g, ticketData.subject)
      .replace(/\{\{category\}\}/g, ticketData.category)
      .replace(/\{\{priority\}\}/g, ticketData.priority)
      .replace(/\{\{createdAt\}\}/g, createdAt);

    const subject = supportTicketTemplate.subject.replace(/\{\{ticketId\}\}/g, ticketId);

    // Send confirmation email to user
    const { data, error } = await resend.emails.send({
      from: 'VidScriptHub Support <onboarding@resend.dev>',
      to: ['bitcointora@gmail.com'], // Testing mode - only verified email
      reply_to: ticketData.email, // User's email for responses
      subject: subject,
      html: html,
    });

    if (error) {
      console.error('Error sending support ticket email:', error);
      return new Response(JSON.stringify({ error: 'Failed to send confirmation email' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Log ticket creation for analytics
    console.log('Support ticket created:', { 
      ticketId, 
      email: ticketData.email, 
      category: ticketData.category, 
      priority: ticketData.priority 
    });

    // In a real implementation, you would also:
    // 1. Save the ticket to a database
    // 2. Send notification to support team
    // 3. Create a ticket in your support system (Zendesk, Freshdesk, etc.)

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Support ticket created successfully',
      ticketId: ticketId,
      data 
    }), {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in create-support-ticket function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};






