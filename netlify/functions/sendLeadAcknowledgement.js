import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {

  const data = JSON.parse(event.body);
  const { name, email, company, phone, message } = data;

  try {

    // CLIENT EMAIL
    await resend.emails.send({
      from: 'Rivanto Advisory <onboarding@resend.dev>',
      to: email,
      subject: 'Your Strategic Revenue Review Request is Received',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #000; border-bottom: 2px solid #000; padding-bottom: 10px;">Dear ${name},</h2>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Thank you for requesting your Strategic Revenue Review.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            We've successfully received your submission.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            Our strategy team will now review your business details to understand your positioning and potential growth opportunities.
          </p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">
            If your request aligns with our review criteria, a member of our advisory team will connect with you.
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="font-size: 16px; line-height: 1.6; color: #333; margin: 0;">
              Warm regards,<br>
              <strong>Team Rivanto</strong><br>
              <em>Strategic Growth Advisory</em>
            </p>
          </div>
        </div>
      `,
    });

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
