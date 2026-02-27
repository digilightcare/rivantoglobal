import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function handler(event) {
  // This function should be triggered by Netlify Scheduled Functions
  // It runs daily to check for leads that need 24-hour follow-up
  
  try {
    // In a real implementation, you would query a database for leads
    // that were submitted 24 hours ago and haven't been contacted
    // For now, we'll use Netlify Forms as a simple storage mechanism
    
    // Get leads from Netlify Forms (simplified approach)
    const leads = await getLeadsNeedingFollowUp();
    
    for (const lead of leads) {
      await sendFollowUpEmail(lead);
      await markFollowUpSent(lead.id);
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        followUpsSent: leads.length 
      })
    };
    
  } catch (error) {
    console.error('Follow-up scheduling error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}

async function getLeadsNeedingFollowUp() {
  // This would typically query your database
  // For now, return empty array - implement with your preferred database
  // Examples: MongoDB, PostgreSQL, Firebase, etc.
  
  console.log('Checking for leads needing 24-hour follow-up...');
  
  // TODO: Implement database query
  // SELECT * FROM leads 
  // WHERE submitted_at <= NOW() - INTERVAL '24 hours' 
  // AND follow_up_sent = false 
  // AND manually_contacted = false
  
  return []; // Replace with actual database query
}

async function sendFollowUpEmail(lead) {
  await resend.emails.send({
    from: 'Rivanto Advisory <advisory@rivantoglobal.com>',
    to: lead.email,
    subject: 'Checking in on your Strategic Revenue Review request',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: 0 auto;">
        <p>Hello ${lead.name},</p>
        
        <p>Just checking in regarding your Strategic Revenue Review request.</p>
        
        <p>If you'd like to explore it further, we're happy to connect at a convenient time.</p>
        
        <br>
        
        <p>Warm regards,</p>
        <p><strong>Rivanto Strategic Advisory</strong></p>
      </div>
    `
  });
  
  console.log(`24-hour follow-up sent to: ${lead.email}`);
}

async function markFollowUpSent(leadId) {
  // Mark in database that follow-up was sent
  // TODO: Implement database update
  // UPDATE leads SET follow_up_sent = true WHERE id = leadId
  
  console.log(`Marked follow-up as sent for lead: ${leadId}`);
}
