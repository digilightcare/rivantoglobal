import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {

  const data = JSON.parse(event.body);
  const { name, email, company, phone, message } = data;

  try {

    // Store lead for 24-hour follow-up tracking
    await storeLeadForFollowUp({ name, email, company, phone, message });

    // INTERNAL ALERT TO YOUR GMAIL
    await resend.emails.send({
      from: 'Rivanto Website <noreply@rivantoglobal.com>',
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
      from: 'Rivanto Advisory <advisory@rivantoglobal.com>',
      to: email,
      subject: 'Your Strategic Revenue Review Request is Received',
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <p>Hi ${name.split(' ')[0]},</p>

          <p>Thank you for requesting your Strategic Revenue Review.</p>

          <p>Our advisory team has received your submission and will review it carefully.</p>

          <p>If your request aligns with our strategic review criteria, we will connect with you.</p>

          <br>

          <p>Warm regards,</p>
          <p>Rivanto Strategic Advisory</p>
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

async function storeLeadForFollowUp(leadData) {
  // Store lead data for 24-hour follow-up tracking
  // In production, this would save to your preferred database
  
  const leadWithTimestamp = {
    ...leadData,
    submitted_at: new Date().toISOString(),
    follow_up_sent: false,
    manually_contacted: false
  };
  
  // TODO: Implement database storage
  // Examples:
  // - MongoDB: db.leads.insertOne(leadWithTimestamp)
  // - PostgreSQL: INSERT INTO leads VALUES (...)
  // - Firebase: firebase.database().ref('leads').push(leadWithTimestamp)
  
  // For now, we'll log the data that would be stored
  console.log('Lead stored for 24-hour follow-up tracking:', leadWithTimestamp);
  
  // In a real implementation, you would return the lead ID
  return { id: 'temp-id', ...leadWithTimestamp };
}
