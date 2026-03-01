exports.handler = async (event) => {
  
  try {
    const data = JSON.parse(event.body);

    const message = `🔥 HIGH VALUE LEAD ALERT 🔥

Revenue Tier: ${data.revenue_tier}
Rooms Segment: ${data.rooms_segment}
Lead Quality: ${data.lead_quality}

Page:
${data.page}`;

    // Send Telegram alert using Telegram Bot API
    const telegramUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    
    await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    console.log('High-value lead Telegram alert sent:', data);

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
