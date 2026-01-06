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
    const userId = user.id;
    const username = user.username || user.name || 'Unknown';
    
    // Users authorized to Approve/Reject
    const authorizedUsers = [
      'U02KTLUT3EE',
      'U03ED3EU7K7',
      'U03E1EZM8VB',
      'U01SAQ269FH',
      'U09RJFKEX4P',
      'U01S4KLNLJ3',
      'U06C4MEKGCB',
      'U05DGQ4TFQC',
      'U04D4KMSPE3',
      'U08LDDY4V5K',
      'U06UYKXHN4W',
      'U06B2MRQC3V',
      'U03RCLGQFU5',
      'U07JRUEEYRW',
      'U01QVSRPV63'
    ];
    
    // Check authorization for Approve/Reject (Correcting is open to anyone)
    if ((actionId === 'approve_alert' || actionId === 'reject_alert') && !authorizedUsers.includes(userId)) {
      // Send ephemeral message (only visible to the user who clicked)
      await fetch(response_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          response_type: 'ephemeral',
          replace_original: false,
          text: '⛔ You are not authorized to Approve or Reject. Please contact a supervisor.'
        })
      });
      return new Response('', { status: 200 });
    }
    
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
    
    // Return empty 200 to acknowledge receipt
    return new Response('', { status: 200 });
    
  } catch (error) {
    console.error('Interaction handler error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
