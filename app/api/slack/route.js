export async function POST(request) {
  try {
    const { channel, text } = await request.json();
    
    if (!channel || !text) {
      return Response.json({ error: 'Missing channel or text' }, { status: 400 });
    }
    
    const botToken = process.env.SLACK_BOT_TOKEN;
    if (!botToken) {
      return Response.json({ error: 'Slack bot token not configured' }, { status: 500 });
    }
    
    const response = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${botToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        channel: channel,
        text: text
      })
    });
    
    const result = await response.json();
    
    if (result.ok) {
      return Response.json({ success: true });
    } else {
      return Response.json({ error: result.error || 'Slack API error' }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
