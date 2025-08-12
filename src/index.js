"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var googleapis_1 = require("googleapis");
var axios_1 = require("axios");
var cheerio = require("cheerio");
var path = require("path");
var formdata_node_1 = require("formdata-node");
// Polyfill globally
global.File = formdata_node_1.File;
var myFile = new formdata_node_1.File(["Hello world!"], "hello.txt", { type: "text/plain" });
console.log(myFile.name); // hello.txt
console.log(myFile.size); // 12
// Load the credentials for your Google Sheet.
// IMPORTANT: You must create a service account and place the key file
// named 'credentials.json' in the root of your project.
// The service account must have editor access to your spreadsheet.
var auth = new googleapis_1.google.auth.GoogleAuth({
    keyFile: path.join(__dirname, '../credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
var sheets = googleapis_1.google.sheets({ version: 'v4', auth: auth });
// Replace with your spreadsheet ID and sheet name.
var SPREADSHEET_ID = '1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg';
var SHEET_NAME = 'Meta-Keywords-sheet';
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var urls, updatedRows, i, url, result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    return [4 /*yield*/, getUrlsFromSheet()];
                case 1:
                    urls = _a.sent();
                    if (urls.length === 0) {
                        console.log('No URLs found in the spreadsheet.');
                        return [2 /*return*/];
                    }
                    console.log("Found ".concat(urls.length, " URLs. Starting processing..."));
                    updatedRows = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < urls.length)) return [3 /*break*/, 6];
                    url = urls[i];
                    if (!url) return [3 /*break*/, 4];
                    console.log("Processing URL: ".concat(url));
                    return [4 /*yield*/, processUrl(url)];
                case 3:
                    result = _a.sent();
                    updatedRows.push([result.metaKeyword, result.status, result.remarks]);
                    return [3 /*break*/, 5];
                case 4:
                    console.log("Skipping empty or undefined URL at index ".concat(i));
                    updatedRows.push(['N/A', 'Failed', 'URL was empty or undefined.']);
                    _a.label = 5;
                case 5:
                    i++;
                    return [3 /*break*/, 2];
                case 6:
                    console.log('All URLs processed. Updating spreadsheet...');
                    return [4 /*yield*/, updateSheet(updatedRows)];
                case 7:
                    _a.sent();
                    console.log('Spreadsheet updated successfully!');
                    return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.error('An error occurred during execution:', error_1);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
// Reads URLs from the spreadsheet.
function getUrlsFromSheet() {
    return __awaiter(this, void 0, void 0, function () {
        var range, response, rows;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    range = "".concat(SHEET_NAME, "!A2:A");
                    return [4 /*yield*/, sheets.spreadsheets.values.get({
                            spreadsheetId: SPREADSHEET_ID,
                            range: range,
                        })];
                case 1:
                    response = _a.sent();
                    rows = response.data.values;
                    if (!rows || rows.length === 0) {
                        return [2 /*return*/, []];
                    }
                    return [2 /*return*/, rows.map(function (row) { return row[0]; })];
            }
        });
    });
}
// Fetches the URL and extracts the meta keywords.
function processUrl(url) {
    return __awaiter(this, void 0, void 0, function () {
        var data, $, metaTag, metaKeyword, error_2, remarks, status_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, axios_1.default.get(url, {
                            headers: {
                                // User-Agent is often required to avoid being blocked by websites.
                                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                            },
                            timeout: 5000 // 5 second timeout
                        })];
                case 1:
                    data = (_a.sent()).data;
                    $ = cheerio.load(data);
                    metaTag = $('meta[name="keywords"]');
                    metaKeyword = metaTag.attr('content') || 'Not Found';
                    return [2 /*return*/, {
                            metaKeyword: metaKeyword,
                            status: 'Done',
                            remarks: 'Successfully scraped meta keyword.'
                        }];
                case 2:
                    error_2 = _a.sent();
                    remarks = 'Failed to fetch or process URL.';
                    status_1 = 'Failed';
                    if (axios_1.default.isAxiosError(error_2) && error_2.response) {
                        remarks = "Failed with HTTP status code: ".concat(error_2.response.status);
                    }
                    else if (axios_1.default.isAxiosError(error_2) && error_2.code === 'ECONNABORTED') {
                        remarks = 'Request timed out.';
                    }
                    return [2 /*return*/, {
                            metaKeyword: 'N/A',
                            status: status_1,
                            remarks: remarks
                        }];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Updates the spreadsheet with the results.
function updateSheet(data) {
    return __awaiter(this, void 0, void 0, function () {
        var range;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    range = "".concat(SHEET_NAME, "!B2");
                    return [4 /*yield*/, sheets.spreadsheets.values.update({
                            spreadsheetId: SPREADSHEET_ID,
                            range: range,
                            valueInputOption: 'USER_ENTERED',
                            requestBody: {
                                values: data,
                            },
                        })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main();
