exports.handler = async (event) => {
  
  try {
    const data = JSON.parse(event.body);

    const message = `
🔥 HIGH VALUE LEAD ALERT 🔥

Revenue Tier: ${data.revenue_tier}
Rooms Segment: ${data.rooms_segment}
Lead Quality: ${data.lead_quality}

Page:
${data.page}
    `;

    // Send WhatsApp alert using CallMeBot API
    // Replace PHONE_NUMBER and API_KEY with your actual credentials
    const whatsappUrl = `https://api.callmebot.com/whatsapp.php?phone=${process.env.ALERT_PHONE_NUMBER}&text=${encodeURIComponent(message)}&apikey=${process.env.CALLMEBOT_API_KEY}`;
    
    await fetch(whatsappUrl);

    console.log('High-value lead alert sent:', data);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (error) {
    console.error('High-value alert error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
