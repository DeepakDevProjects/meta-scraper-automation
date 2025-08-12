# 🚀 Complete Automation Setup Guide

## Overview
This guide will help you set up complete automation where clicking a button in Google Sheets triggers Jenkins to run your meta scraper.

## 🔧 Step 1: Prepare Your Repository

### 1.1 Add Credentials to Repository (Temporary)
```bash
# Copy your credentials.json to the repository
cp /path/to/your/credentials.json ./credentials.json

# Commit the credentials (for testing only)
git add credentials.json
git commit -m "Add credentials for Jenkins automation"
git push origin main
```

### 1.2 Verify Repository Structure
Your repository should now have:
- ✅ `Jenkinsfile` (updated)
- ✅ `credentials.json` (added)
- ✅ `src/index.ts` (meta scraper code)
- ✅ `package.json` (dependencies)

## 📊 Step 2: Set Up Google Sheet

### 2.1 Create/Open Your Google Sheet
1. Go to: https://docs.google.com/spreadsheets/d/1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg/edit
2. Make sure you have edit access

### 2.2 Add Google Apps Script
1. In your Google Sheet, go to **Extensions** → **Apps Script**
2. Replace the default code with the content from `google-apps-script.js`
3. Save the script (Ctrl+S or Cmd+S)
4. Close the Apps Script editor

### 2.3 Test the Button
1. Refresh your Google Sheet
2. You should see a new menu: **"Trigger Jenkins"**
3. Click **"Trigger Jenkins"** → **"Trigger Jenkins Job"**

## 🏗️ Step 3: Configure Jenkins

### 3.1 Verify Jenkins Job
1. Go to: http://35.154.42.145:8080
2. Find your job: **"First pipeline job"**
3. Make sure it's configured to use the updated Jenkinsfile

### 3.2 Test Jenkins Pipeline
1. In Jenkins, click **"Build Now"**
2. Monitor the build logs
3. Verify all stages complete successfully

## 🔄 Step 4: Complete Workflow Test

### 4.1 Prepare Test Data
1. In your Google Sheet, add some URLs in column A:
   - Row 2: `https://www.google.com`
   - Row 3: `https://www.github.com`
   - Row 4: `https://www.stackoverflow.com`

### 4.2 Trigger Automation
1. Click **"Trigger Jenkins"** → **"Trigger Jenkins Job"**
2. Wait for confirmation message
3. Monitor Jenkins build progress

### 4.3 Verify Results
1. Check Jenkins build logs
2. Return to Google Sheet
3. Verify columns B, C, D are populated with results

## 🛡️ Step 5: Security (Production)

### 5.1 Remove Credentials from Repository
```bash
# Remove credentials from repository
git rm credentials.json
git commit -m "Remove credentials for security"
git push origin main
```

### 5.2 Use Jenkins Credentials Manager
1. In Jenkins, go to **Manage Jenkins** → **Manage Credentials**
2. Add new credential: **Secret file**
3. Upload your `credentials.json`
4. Update Jenkinsfile to reference the credential

## 🧪 Troubleshooting

### Common Issues:
1. **"Invalid JWT Signature"**: Download fresh credentials from Google Cloud Console
2. **"Requested entity not found"**: Check spreadsheet ID and sharing permissions
3. **Jenkins build fails**: Check build logs for specific errors
4. **Button not appearing**: Refresh Google Sheet after adding Apps Script

### Debug Commands:
```bash
# Test credentials locally
node test-new-credentials.js

# Test application locally
npm start

# Test demo mode
DEMO_MODE=true npm start
```

## 📋 Complete Workflow

1. **User opens Google Sheet** with URLs in column A
2. **User clicks "Trigger Jenkins"** from custom menu
3. **Google Apps Script** sends request to Jenkins
4. **Jenkins starts pipeline**:
   - Pulls latest code from GitHub
   - Installs dependencies
   - Runs meta scraper
   - Updates Google Sheet with results
5. **User sees results** in columns B, C, D

## 🎉 Success Indicators

- ✅ Jenkins job triggers successfully
- ✅ Pipeline completes without errors
- ✅ Google Sheet is updated with meta keywords
- ✅ Status and remarks columns show "Done" and "Successfully scraped"

## 📞 Support

If you encounter issues:
1. Check Jenkins build logs
2. Verify Google Sheet permissions
3. Test credentials locally
4. Check network connectivity to Jenkins
