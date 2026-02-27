import { Resend } from 'resend';
const admin = require("firebase-admin");

// Initialize Firebase with error handling
let db;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
  } else {
    console.log('⚠️ FIREBASE_SERVICE_ACCOUNT not found, skipping Firebase');
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
}

// Initialize Resend with error handling
let resend;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
    console.log('✅ Resend initialized successfully');
  } else {
    console.log('⚠️ RESEND_API_KEY not found, skipping email sending');
  }
} catch (error) {
  console.error('❌ Resend initialization failed:', error);
}

export async function handler(event) {
  // This function should be triggered by Netlify Scheduled Functions
  // It runs daily to check for leads that need 24-hour follow-up
  
  try {
    // Get leads from Firestore that need 24-hour follow-up
    const leads = await getLeadsNeedingFollowUp();
    
    for (const doc of leads) {
      const lead = { id: doc.id, ...doc.data() };
      await sendFollowUpEmail(lead);
      await markFollowUpSent(doc.id);
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
  console.log('Checking for leads needing 24-hour follow-up...');
  
  // Get leads submitted 24+ hours ago that haven't been contacted or followed up
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const snapshot = await db.collection("leads")
    .where("createdAt", "<=", twentyFourHoursAgo)
    .where("contactedManually", "==", false)
    .where("followUpSent", "==", false)
    .get();
  
  return snapshot.docs;
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
  // Mark in Firestore that follow-up was sent
  await db.collection("leads").doc(leadId).update({
    followUpSent: true
  });
  
  console.log(`Marked follow-up as sent for lead: ${leadId}`);
}
