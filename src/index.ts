import { google } from 'googleapis';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';

// Load the credentials for your Google Sheet.
// IMPORTANT: You must create a service account and place the key file
// named 'credentials.json' in the root of your project.
// The service account must have editor access to your spreadsheet.
const auth = new google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Replace with your spreadsheet ID and sheet name.
const SPREADSHEET_ID = '1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg';
const SHEET_NAME = 'Meta-Keywords-sheet';

async function main() {
    try {
        const urls = await getUrlsFromSheet();
        if (urls.length === 0) {
            console.log('No URLs found in the spreadsheet.');
            return;
        }

        console.log(`Found ${urls.length} URLs. Starting processing...`);
        const updatedRows = [];
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            if (url) {
                console.log(`Processing URL: ${url}`);
                const result = await processUrl(url);
                updatedRows.push([result.metaKeyword, result.status, result.remarks]);
            } else {
                console.log(`Skipping empty or undefined URL at index ${i}`);
                updatedRows.push(['N/A', 'Failed', 'URL was empty or undefined.']);
            }
        }

        console.log('All URLs processed. Updating spreadsheet...');
        await updateSheet(updatedRows);
        console.log('Spreadsheet updated successfully!');

    } catch (error) {
        console.error('An error occurred during execution:', error);
    }
}

// Reads URLs from the spreadsheet.
async function getUrlsFromSheet(): Promise<string[]> {
    const range = `${SHEET_NAME}!A2:A`; // Assumes URLs are in column A, starting from row 2
    const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
    });
    const rows = response.data.values;
    if (!rows || rows.length === 0) {
        return [];
    }
    return rows.map(row => row[0]);
}

// Fetches the URL and extracts the meta keywords.
async function processUrl(url: string): Promise<{ metaKeyword: string, status: string, remarks: string }> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                // User-Agent is often required to avoid being blocked by websites.
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 5000 // 5 second timeout
        });
        const $ = cheerio.load(data);
        const metaTag = $('meta[name="keywords"]');
        const metaKeyword = metaTag.attr('content') || 'Not Found';
        
        return {
            metaKeyword: metaKeyword,
            status: 'Done',
            remarks: 'Successfully scraped meta keyword.'
        };
    } catch (error) {
        let remarks = 'Failed to fetch or process URL.';
        let status = 'Failed';
        if (axios.isAxiosError(error) && error.response) {
            remarks = `Failed with HTTP status code: ${error.response.status}`;
        } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
            remarks = 'Request timed out.';
        }
        return {
            metaKeyword: 'N/A',
            status: status,
            remarks: remarks
        };
    }
}

// Updates the spreadsheet with the results.
async function updateSheet(data: string[][]) {
    const range = `${SHEET_NAME}!B2`; // Updates columns B, C, D starting from row 2
    await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: data,
        },
    });
}

main();
