import { google } from 'googleapis';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as path from 'path';
import * as fs from 'fs';
import { File } from 'formdata-node';

// Polyfill globally
global.File = File as any;

const myFile = new File(["Hello world!"], "hello.txt", { type: "text/plain" });

console.log(myFile.name); // hello.txt
console.log(myFile.size); // 12

// Configuration
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg';
const SHEET_NAME = process.env.SHEET_NAME || 'Meta-Keywords-sheet';
const CREDENTIALS_PATH = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.join(__dirname, '../credentials.json');

// Check if credentials file exists
if (!fs.existsSync(CREDENTIALS_PATH)) {
    console.error(`❌ Credentials file not found at: ${CREDENTIALS_PATH}`);
    console.error('Please ensure you have:');
    console.error('1. Created a Google Service Account');
    console.error('2. Downloaded the credentials.json file');
    console.error('3. Placed it in the project root directory');
    console.error('4. Or set the GOOGLE_APPLICATION_CREDENTIALS environment variable');
    process.exit(1);
}

// Load the credentials for your Google Sheet.
const auth = new google.auth.GoogleAuth({
    keyFile: CREDENTIALS_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

async function main() {
    try {
        console.log('🔍 Starting Meta Scraper Automation...');
        console.log(`📊 Spreadsheet ID: ${SPREADSHEET_ID}`);
        console.log(`📋 Sheet Name: ${SHEET_NAME}`);
        
        const urls = await getUrlsFromSheet();
        if (urls.length === 0) {
            console.log('⚠️  No URLs found in the spreadsheet.');
            return;
        }

        console.log(`✅ Found ${urls.length} URLs. Starting processing...`);
        const updatedRows = [];
        
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            if (url) {
                console.log(`🔄 Processing URL ${i + 1}/${urls.length}: ${url}`);
                const result = await processUrl(url);
                updatedRows.push([result.metaKeyword, result.status, result.remarks]);
            } else {
                console.log(`⚠️  Skipping empty or undefined URL at index ${i}`);
                updatedRows.push(['N/A', 'Failed', 'URL was empty or undefined.']);
            }
        }

        console.log('📝 All URLs processed. Updating spreadsheet...');
        await updateSheet(updatedRows);
        console.log('✅ Spreadsheet updated successfully!');

    } catch (error) {
        console.error('❌ An error occurred during execution:', error);
        process.exit(1);
    }
}

// Reads URLs from the spreadsheet.
async function getUrlsFromSheet(): Promise<string[]> {
    try {
        const range = `${SHEET_NAME}!A2:A`; // Assumes URLs are in column A, starting from row 2
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range,
        });
        const rows = response.data.values;
        if (!rows || rows.length === 0) {
            return [];
        }
        return rows.map(row => row[0]).filter(url => url && url.trim() !== '');
    } catch (error) {
        console.error('❌ Error reading from spreadsheet:', error);
        throw error;
    }
}

// Fetches the URL and extracts the meta keywords.
async function processUrl(url: string): Promise<{ metaKeyword: string, status: string, remarks: string }> {
    try {
        const { data } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000 // 10 second timeout
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
        
        if (axios.isAxiosError(error)) {
            if (error.response) {
                remarks = `Failed with HTTP status code: ${error.response.status}`;
            } else if (error.code === 'ECONNABORTED') {
                remarks = 'Request timed out.';
            } else if (error.code === 'ENOTFOUND') {
                remarks = 'Domain not found.';
            } else if (error.code === 'ECONNREFUSED') {
                remarks = 'Connection refused.';
            }
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
    try {
        const range = `${SHEET_NAME}!B2`; // Updates columns B, C, D starting from row 2
        await sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: data,
            },
        });
    } catch (error) {
        console.error('❌ Error updating spreadsheet:', error);
        throw error;
    }
}

// Handle process termination gracefully
process.on('SIGINT', () => {
    console.log('\n🛑 Process interrupted by user');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Process terminated');
    process.exit(0);
});

main();
