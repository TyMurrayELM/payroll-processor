export async function GET() {
  // Build webhook config from environment variables
  // Format: SLACK_WEBHOOK_BRANCH_DIVISION (spaces/dashes become underscores)
  const webhooks = {};
  
  // Map environment variables to branch|division keys
  const mappings = [
    { key: 'Corporate|Arbor', env: 'SLACK_WEBHOOK_CORPORATE_ARBOR' },
    // Add more mappings as you add more webhooks:
    // { key: 'Las Vegas|Maintenance', env: 'SLACK_WEBHOOK_LAS_VEGAS_MAINTENANCE' },
    // { key: 'Phoenix - North|Irrigation', env: 'SLACK_WEBHOOK_PHOENIX_NORTH_IRRIGATION' },
  ];
  
  for (const mapping of mappings) {
    const webhook = process.env[mapping.env];
    if (webhook) {
      webhooks[mapping.key] = webhook;
    }
  }
  
  return Response.json(webhooks);
}
