import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {

  const data = JSON.parse(event.body);
  const { name, email, company, phone, message } = data;

  try {

    // INTERNAL ALERT TO YOUR GMAIL
    await resend.emails.send({
      from: 'Rivanto Website <onboarding@resend.dev>',
      to: 'rivantoglobal@gmail.com',
      subject: 'New Strategic Revenue Review Request Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #d32f2f;">New Strategic Revenue Review Request</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Company:</strong> ${company}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a></p>
            <p style="margin: 10px 0;"><strong>Message:</strong> ${message || 'No message provided'}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Please review and initiate qualification process if aligned.<br>
              <em>– Rivanto Website</em>
            </p>
          </div>
        </div>
      `,
    });

    // 📩 CUSTOMER ACKNOWLEDGEMENT EMAIL
    await resend.emails.send({
      from: 'Rivanto Global <onboarding@resend.dev>',
      to: email,
      subject: 'Your Strategic Revenue Review Request is Received',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Strategic Revenue Review Request Received</h2>
          
          <p>Dear ${name},</p>

          <p>Thank you for submitting your Strategic Revenue Review request.</p>

          <p>Our advisory team will carefully review your submission to understand alignment with our structured growth framework.</p>

          <p>If your request aligns with our advisory scope, a member of our strategy team will connect with you.</p>

          <p>This process ensures we provide meaningful and relevant engagement.</p>

          <br>

          <p>Warm regards,</p>
          <strong>Rivanto Strategic Advisory</strong>
        </div>
      `
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('Email sending error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
