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
  console.log('🚀 Function started');

  try {
    const data = JSON.parse(event.body);
    const { name, email, company, phone, message } = data;
    
    console.log('📋 Form data received:', { name, email, company, phone });

    // Send internal email if Resend is available
    if (resend) {
      try {
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
            </div>
          `,
        });
        console.log('✅ Internal email sent successfully');
      } catch (emailError) {
        console.error('❌ Internal email failed:', emailError);
      }
    }

    // Send customer email if Resend is available
    if (resend) {
      try {
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
          `,
        });
        console.log('✅ Customer email sent successfully');
      } catch (emailError) {
        console.error('❌ Customer email failed:', emailError);
      }
    }

    // Store in Firestore if available
    if (db) {
      try {
        await db.collection("leads").add({
          name,
          email,
          phone,
          company,
          message,
          contactedManually: false,
          followUpSent: false,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        console.log('✅ Lead stored in Firestore successfully');
      } catch (firestoreError) {
        console.error('❌ Firestore storage failed:', firestoreError);
      }
    }

    console.log('🎉 Function completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('❌ Function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
}
