export async function POST(request) {
  try {
    // Slack sends interaction payloads as form-urlencoded with a 'payload' field
    const formData = await request.formData();
    const payloadStr = formData.get('payload');
    
    if (!payloadStr) {
      return Response.json({ error: 'No payload' }, { status: 400 });
    }
    
    const payload = JSON.parse(payloadStr);
    
    const { type, user, actions, channel, message, response_url } = payload;
    
    if (type !== 'block_actions') {
      return Response.json({ error: 'Unsupported interaction type' }, { status: 400 });
    }
    
    const action = actions[0];
    const actionId = action.action_id;
    const username = user.username || user.name || 'Unknown';
    
    // Determine approval status
    let statusText, statusEmoji;
    if (actionId === 'approve_alert') {
      statusEmoji = '✅';
      statusText = `Approved by @${username}`;
    } else if (actionId === 'reject_alert') {
      statusEmoji = '❌';
      statusText = `Rejected by @${username}`;
    } else if (actionId === 'correcting_alert') {
      statusEmoji = '🔧';
      statusText = `Correcting by @${username}`;
    } else {
      return Response.json({ error: 'Unknown action' }, { status: 400 });
    }
    
    // Get the original message blocks and update them
    const originalBlocks = message.blocks || [];
    
    // Remove the actions block and add the status
    const updatedBlocks = originalBlocks
      .filter(block => block.type !== 'actions')
      .concat([
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${statusEmoji} *${statusText}*`
          }
        }
      ]);
    
    // Update the original message using response_url
    const updateResponse = await fetch(response_url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        replace_original: true,
        blocks: updatedBlocks,
        text: message.text + ` - ${statusText}`
      })
    });
    
    if (!updateResponse.ok) {
      console.error('Failed to update message:', await updateResponse.text());
    }
    
    // Also forward to Zapier webhook for any additional automation
    try {
      await fetch('https://hooks.zapier.com/hooks/catch/9760594/3gtib6w/silent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: actionId,
          user: username,
          channel: channel.name || channel.id,
          timestamp: new Date().toISOString(),
          alertData: action.value
        })
      });
    } catch (zapierErr) {
      console.error('Zapier webhook error:', zapierErr);
      // Don't fail the request if Zapier fails
    }
    
    // Return empty 200 to acknowledge receipt
    return new Response('', { status: 200 });
    
  } catch (error) {
    console.error('Interaction handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
