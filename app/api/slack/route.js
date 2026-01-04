export async function POST(request) {
  try {
    const { webhook, message } = await request.json();
    
    if (!webhook || !message) {
      return Response.json({ error: 'Missing webhook or message' }, { status: 400 });
    }
    
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    });
    
    if (response.ok) {
      return Response.json({ success: true });
    } else {
      const errorText = await response.text();
      return Response.json({ error: errorText }, { status: response.status });
    }
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
