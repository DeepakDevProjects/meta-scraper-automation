// This function creates a custom menu in the spreadsheet.
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('Trigger Jenkins')
      .addItem('Trigger Jenkins Job', 'triggerJenkins')
      .addToUi();
}

function triggerJenkins() {
  const jenkinsBaseUrl = 'http://13.203.228.92/:8080';
  const jobName = 'First%20pipeline%20job';
  const username = 'admin';
  const apiToken = '111300ea72005c6d3aaa3a71e23be3da2a';
  const authHeader = 'Basic ' + Utilities.base64Encode(username + ':' + apiToken);

  try {
    // Show loading message
    SpreadsheetApp.getUi().alert('🚀 Triggering Jenkins job... Please wait.');
    
    // 1. Get crumb
    const crumbResponse = UrlFetchApp.fetch(jenkinsBaseUrl + '/crumbIssuer/api/json', {
      method: 'get',
      headers: {
        'Authorization': authHeader
      },
      muteHttpExceptions: true
    });

    if (crumbResponse.getResponseCode() !== 200) {
      throw new Error('Failed to get CSRF crumb: ' + crumbResponse.getResponseCode());
    }

    const crumbJson = JSON.parse(crumbResponse.getContentText());
    const crumbField = crumbJson.crumbRequestField;
    const crumbValue = crumbJson.crumb;

    // 2. Trigger the Jenkins job
    const buildUrl = `${jenkinsBaseUrl}/job/${jobName}/build?token=myToken`;

    const response = UrlFetchApp.fetch(buildUrl, {
      method: 'post',
      headers: {
        'Authorization': authHeader,
        [crumbField]: crumbValue
      },
      muteHttpExceptions: true
    });

    const responseCode = response.getResponseCode();
    if (responseCode === 201 || responseCode === 200) {
      SpreadsheetApp.getUi().alert('✅ Jenkins job successfully triggered!\n\n📊 The meta scraper will now:\n• Read URLs from this sheet\n• Scrape meta keywords\n• Update results back to the sheet\n\n⏱️ This may take a few minutes to complete.');
    } else {
      const errorText = response.getContentText();
      SpreadsheetApp.getUi().alert('❌ Failed to trigger Jenkins job.\nResponse Code: ' + responseCode + '\nError: ' + errorText);
    }
  } catch(e) {
    SpreadsheetApp.getUi().alert('❌ An error occurred: ' + e.toString());
  }
}
