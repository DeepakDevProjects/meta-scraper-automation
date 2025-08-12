# Meta Scraper Automation

A Node.js application that scrapes meta keywords from URLs stored in a Google Sheet and updates the results back to the sheet.

## Features

- 🔍 Scrapes meta keywords from URLs
- 📊 Reads URLs from Google Sheets
- 📝 Updates results back to Google Sheets
- 🎭 Demo mode for testing without Google credentials
- 🛡️ Robust error handling and logging
- ⚡ Fast processing with configurable timeouts

## Prerequisites

- Node.js 18+ 
- Google Cloud Project with Google Sheets API enabled
- Google Service Account with appropriate permissions

## Installation

1. Clone the repository:
```bash
git clone https://github.com/DeepakDevProjects/meta-scraper-automation.git
cd meta-scraper-automation
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Google Service Account Setup

### 1. Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API

### 2. Create a Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Name it (e.g., "meta-scraper-service")
4. Grant "Editor" role
5. Create and download the JSON key file

### 3. Configure Credentials
1. Rename the downloaded file to `credentials.json`
2. Place it in the project root directory
3. **Important**: Add `credentials.json` to your `.gitignore` to keep it secure

### 4. Share Your Google Sheet
1. Open your Google Sheet
2. Click "Share" and add your service account email (found in `credentials.json`)
3. Grant "Editor" access

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SPREADSHEET_ID` | Your Google Sheet ID | `1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg` |
| `SHEET_NAME` | Sheet name within the spreadsheet | `Meta-Keywords-sheet` |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to credentials file | `./credentials.json` |
| `DEMO_MODE` | Run in demo mode (no Google Sheets) | `false` |

### Google Sheet Format

Your Google Sheet should have the following structure:

| A (URLs) | B (Meta Keywords) | C (Status) | D (Remarks) |
|----------|-------------------|------------|-------------|
| Header    | Header            | Header     | Header      |
| https://example.com | (auto-filled) | (auto-filled) | (auto-filled) |
| https://another.com | (auto-filled) | (auto-filled) | (auto-filled) |

## Usage

### Normal Mode (with Google Sheets)
```bash
npm start
```

### Demo Mode (without Google Sheets)
```bash
DEMO_MODE=true npm start
```

### Development Mode
```bash
npm run dev
```

## Troubleshooting

### "Invalid JWT Signature" Error

This error occurs when the service account credentials are invalid. Here's how to fix it:

1. **Download Fresh Credentials**:
   - Go to Google Cloud Console > IAM & Admin > Service Accounts
   - Find your service account and click on it
   - Go to "Keys" tab
   - Create a new key (JSON format)
   - Download and replace your existing `credentials.json`

2. **Check Service Account Permissions**:
   - Ensure the service account has "Editor" access to your Google Sheet
   - Verify the service account email in the sheet's sharing settings

3. **Verify Project Settings**:
   - Make sure Google Sheets API is enabled in your Google Cloud Project
   - Check that the service account is in the correct project

### "Requested entity was not found" Error

This means the spreadsheet ID is incorrect or the service account lacks access:

1. **Verify Spreadsheet ID**:
   - Open your Google Sheet
   - Copy the ID from the URL: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Update the `SPREADSHEET_ID` environment variable

2. **Check Sheet Access**:
   - Ensure the service account email has access to the spreadsheet
   - Try sharing the sheet with "Anyone with the link" temporarily for testing

### Other Common Issues

- **Timeout Errors**: Increase the timeout in the code if processing large URLs
- **Rate Limiting**: Add delays between requests if processing many URLs
- **Missing Meta Tags**: Some websites don't have meta keywords - this is normal

## Development

### Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Run in development mode with ts-node
- `npm run clean` - Remove compiled files
- `npm start` - Run the compiled application

### Project Structure

```
meta-scraper-automation/
├── src/
│   └── index.ts          # Main application logic
├── dist/                 # Compiled JavaScript (auto-generated)
├── credentials.json      # Google service account credentials
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

ISC License

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Run in demo mode to test basic functionality
3. Verify your Google Cloud setup
4. Check the console output for detailed error messages
