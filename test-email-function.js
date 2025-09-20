const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function testEmail() {
  try {
    console.log('Testing email function...');
    
    const { data, error } = await resend.emails.send({
      from: 'VidScriptHub <onboarding@resend.dev>',
      to: ['jegoalex@gmail.com'],
      subject: 'Test Email from VidScriptHub',
      html: '<h1>Test Email</h1><p>This is a test email to verify the function works.</p>',
    });

    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success:', data);
    }
  } catch (err) {
    console.error('Exception:', err);
  }
}

testEmail();






