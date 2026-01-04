# Payroll Processor - Encore Landscape Management

Convert Aspire data exports to NetSuite upload format.

## Features

- Upload PTO/Holiday data from Aspire Time Entry Grid Export (.xlsx)
- Upload regular hours from Aspire Data Dump (.csv)
- Upload employee mapping from NetSuite Employee Export (.xls)
- Automatic pay period detection (Monday-Sunday)
- Summary statistics by Branch and Division
- Drill-down to see individual employees
- Identify employees under 40 hours or with no hours
- Slack integration for alerts (bot token approach)
- Export to NetSuite-compatible CSV

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

### Option 1: Via GitHub

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Click "Deploy"

### Option 2: Via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

## Environment Variables

In Vercel, add this environment variable:

- `SLACK_BOT_TOKEN` - Your Slack bot token (starts with `xoxb-`)

## Slack Channel Mappings

Channel mappings are configured in `public/index.html` in the `slackChannels` object and `getSlackChannel` function:

- Corporate | Arbor → C06JT9Q4A3B
- Corporate | Enhancements → C06JTB3QS0Z
- Corporate | Spray → C06U9K3EKT7
- Corporate | Fleet & Equipment → C0896PY7EAF
- Las Vegas | (any division) → C04RB0JRMRS
- Phoenix * | Maintenance → C04V05RE822
- Phoenix * | Irrigation → C04V05RE822

To add more channels, edit the `slackChannels` object or update the `getSlackChannel` function logic.

## File Structure

```
├── app/
│   ├── api/
│   │   └── slack/
│   │       └── route.js    # API route for Slack bot messages
│   ├── globals.css
│   ├── layout.js
│   └── page.js             # Redirects to static HTML
├── public/
│   └── index.html          # Main application
├── package.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## License

Internal use only - Encore Landscape Management
