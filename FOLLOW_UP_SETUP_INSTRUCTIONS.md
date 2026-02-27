# 24-Hour Follow-Up Email System Setup

## ✅ What's Implemented

1. **Scheduled Function**: `/netlify/functions/scheduleFollowUp.js`
2. **Lead Storage**: Lead data tracking in main acknowledgement function
3. **Follow-up Logic**: Daily check for leads needing 24-hour follow-up
4. **Professional Email**: Non-urgent advisory positioning maintained

## 🚀 Database Integration Required

The follow-up system needs a database to track lead submissions and follow-up status. Choose one of these options:

### Option 1: MongoDB (Recommended)

```javascript
// In sendLeadAcknowledgement.js
const { MongoClient } = require('mongodb');

async function storeLeadForFollowUp(leadData) {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const leadWithTimestamp = {
    ...leadData,
    submitted_at: new Date(),
    follow_up_sent: false,
    manually_contacted: false
  };
  
  const result = await client.db('rivanto').collection('leads').insertOne(leadWithTimestamp);
  await client.close();
  
  return { id: result.insertedId, ...leadWithTimestamp };
}

// In scheduleFollowUp.js
async function getLeadsNeedingFollowUp() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  const leads = await client.db('rivanto').collection('leads').find({
    submitted_at: { $lte: twentyFourHoursAgo },
    follow_up_sent: false,
    manually_contacted: false
  }).toArray();
  
  await client.close();
  return leads;
}
```

### Option 2: Firebase

```javascript
// In sendLeadAcknowledgement.js
const admin = require('firebase-admin');

async function storeLeadForFollowUp(leadData) {
  const leadWithTimestamp = {
    ...leadData,
    submitted_at: admin.firestore.Timestamp.now(),
    follow_up_sent: false,
    manually_contacted: false
  };
  
  const docRef = await admin.firestore().collection('leads').add(leadWithTimestamp);
  return { id: docRef.id, ...leadWithTimestamp };
}

// In scheduleFollowUp.js
async function getLeadsNeedingFollowUp() {
  const twentyFourHoursAgo = admin.firestore.Timestamp.now();
  twentyFourHoursAgo.seconds -= 24 * 60 * 60;
  
  const snapshot = await admin.firestore()
    .collection('leads')
    .where('submitted_at', '<=', twentyFourHoursAgo)
    .where('follow_up_sent', '==', false)
    .where('manually_contacted', '==', false)
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

## 🔧 Environment Variables Needed

Add these to Netlify Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rivanto
```

Or for Firebase:

```
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

## 📧 Follow-Up Email Content

**Subject:** Checking in on your Strategic Revenue Review request

**Body:**
```
Hello [Name],

Just checking in regarding your Strategic Revenue Review request.

If you'd like to explore it further, we're happy to connect at a convenient time.

Warm regards,
Rivanto Strategic Advisory
```

## ⏰ Schedule Configuration

- **Frequency:** Daily at 2 AM UTC
- **Trigger:** 24 hours after form submission
- **Once Only:** Follow-up sent only once per lead
- **No Urgency:** Professional advisory tone maintained

## 🎯 Manual Override

To prevent follow-up for manually contacted leads:

```javascript
// Add this to your manual contact process
await markAsManuallyContacted(leadId);

async function markAsManuallyContacted(leadId) {
  await db.collection('leads').updateOne(
    { id: leadId },
    { $set: { manually_contacted: true } }
  );
}
```

## 📊 Complete Flow

1. **Form Submit** → Lead stored with timestamp
2. **24 Hours Later** → Scheduled function runs
3. **Check Conditions** → No manual contact + no follow-up sent
4. **Send Email** → Professional follow-up message
5. **Mark Sent** → Prevent duplicate follow-ups

## 🚀 Deployment Steps

1. **Choose Database** (MongoDB/Firebase/PostgreSQL)
2. **Add Environment Variables** to Netlify
3. **Update Functions** with database code
4. **Deploy** to Netlify
5. **Test** form submission and 24-hour follow-up

## ✅ Result

Complete premium advisory loop:
- ✔ Instant acknowledgement
- ✔ WhatsApp entry
- ✔ Internal alert
- ✔ 24-hr soft follow-up

Professional lead nurturing without pressure tactics.
