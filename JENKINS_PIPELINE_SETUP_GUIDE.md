# 🏗️ Jenkins Pipeline Job Setup Guide

## Overview
This guide will help you verify that your Jenkins pipeline job is configured correctly for the meta scraper automation.

## ✅ Step-by-Step Verification Checklist

### 🔧 Step 1: Create/Verify Pipeline Job

#### 1.1 Access Jenkins
1. Go to: http://35.154.42.145:8080
2. Login with your credentials
3. You should see your job: **"First pipeline job"**

#### 1.2 Job Configuration Verification
1. Click on your job name
2. Click **"Configure"** in the left sidebar
3. Verify these settings:

**General Tab:**
- ✅ **Job name**: "First pipeline job"
- ✅ **Description**: Add a description like "Meta scraper automation pipeline"
- ✅ **Discard old builds**: Check this and set to keep last 10 builds

**Build Triggers Tab:**
- ✅ **Poll SCM**: Unchecked (we trigger via Google Apps Script)
- ✅ **Trigger builds remotely**: Check this
- ✅ **Authentication Token**: Set to `myToken` (matches your Google Apps Script)

**Build Environment Tab:**
- ✅ **Use secret text(s) or file(s)**: **CHECK THIS**
- ✅ **Secret file binding**:
  - Variable: `GOOGLE_CREDENTIALS`
  - Credentials: `google-service-account-key` (select from dropdown)
  - Target: `credentials.json`

**Pipeline Tab:**
- ✅ **Definition**: "Pipeline script from SCM"
- ✅ **SCM**: Git
- ✅ **Repository URL**: `https://github.com/DeepakDevProjects/meta-scraper-automation.git`
- ✅ **Branches to build**: `*/main`
- ✅ **Script Path**: `Jenkinsfile`

### 🔐 Step 2: Configure Credentials (If Not Done)

#### 2.1 Access Credentials Manager
1. Go to **Manage Jenkins** → **Manage Credentials**
2. Click on **"(global)"** domain
3. Look for credential: `google-service-account-key`

#### 2.2 Create Credential (If Missing)
1. Click **"Add Credentials"**
2. Select **"Secret file"**
3. Fill in:
   - **Kind**: Secret file
   - **Scope**: Global
   - **ID**: `google-service-account-key`
   - **Description**: `Google Service Account credentials for meta scraper`
   - **Secret**: Upload your `credentials.json` file
4. Click **"Create"**

### 🛠️ Step 3: Verify Node.js Installation

#### 3.1 Check Node.js Tool
1. Go to **Manage Jenkins** → **Global Tool Configuration**
2. Look for **NodeJS installations**
3. Verify you have:
   - **Name**: `node-20`
   - **Version**: Node.js 20.x.x
   - **Install automatically**: Checked

#### 3.2 Install Node.js (If Missing)
1. Click **"Add NodeJS"**
2. Configure:
   - **Name**: `node-20`
   - **Install automatically**: Checked
   - **Version**: Select latest Node.js 20.x
3. Click **"Save"**

### 🔄 Step 4: Test Pipeline Configuration

#### 4.1 Manual Build Test
1. Go to your job page
2. Click **"Build Now"**
3. Monitor the build:
   - Should show "Started by user [your-username]"
   - Should progress through all stages
   - Should complete successfully

#### 4.2 Check Build Logs
Look for these success indicators:
```
✅ Checkout Code - Completed
✅ Install Dependencies - Completed  
✅ Setup Credentials - Completed
✅ Compile TypeScript - Completed
✅ Run Meta Scraper - Completed
```

### 🚨 Step 5: Common Issues & Solutions

#### Issue 1: "Credentials file not found"
**Solution:**
- Verify credential is configured in job settings
- Check credential ID matches exactly: `google-service-account-key`
- Ensure credential type is "Secret file"

#### Issue 2: "Node.js not found"
**Solution:**
- Go to Global Tool Configuration
- Add Node.js installation
- Make sure name matches: `node-20`

#### Issue 3: "Git repository not found"
**Solution:**
- Verify repository URL is correct
- Check branch name is `main`
- Ensure Jenkins has access to GitHub

#### Issue 4: "Pipeline script not found"
**Solution:**
- Verify Jenkinsfile exists in repository root
- Check script path is exactly: `Jenkinsfile`
- Ensure Jenkinsfile is committed and pushed

### �� Step 6: Complete Configuration Checklist

**Job Settings:**
- [ ] Job name: "First pipeline job"
- [ ] Remote trigger enabled with token: `myToken`
- [ ] Pipeline script from SCM: Git
- [ ] Repository URL: `https://github.com/DeepakDevProjects/meta-scraper-automation.git`
- [ ] Branch: `*/main`
- [ ] Script path: `Jenkinsfile`

**Credentials:**
- [ ] Credential ID: `google-service-account-key`
- [ ] Credential type: Secret file
- [ ] Credential bound to: `GOOGLE_CREDENTIALS`
- [ ] Target file: `credentials.json`

**Tools:**
- [ ] Node.js tool name: `node-20`
- [ ] Node.js version: 20.x.x
- [ ] Auto-install enabled

**Build Environment:**
- [ ] "Use secret text(s) or file(s)" checked
- [ ] Secret file binding configured
- [ ] Variable name: `GOOGLE_CREDENTIALS`

### 🧪 Step 7: Test Complete Workflow

#### 7.1 Prepare Test Data
1. Open your Google Sheet
2. Add test URLs in column A:
   - Row 2: `https://www.google.com`
   - Row 3: `https://www.github.com`
   - Row 4: `https://www.stackoverflow.com`

#### 7.2 Trigger via Google Apps Script
1. Click **"Trigger Jenkins"** → **"Trigger Jenkins Job"**
2. Wait for confirmation message
3. Go to Jenkins to monitor build

#### 7.3 Verify Results
1. Check Jenkins build completes successfully
2. Return to Google Sheet
3. Verify columns B, C, D are populated

### 🎯 Success Indicators

**Jenkins Build:**
- ✅ All stages complete without errors
- ✅ "Credentials file found and ready" in logs
- ✅ "Meta Scraper completed successfully" in logs
- ✅ Build status: SUCCESS

**Google Sheet:**
- ✅ Meta keywords populated in column B
- ✅ Status shows "Done" in column C
- ✅ Remarks show "Successfully scraped" in column D

### 📞 Troubleshooting Commands

**Check Jenkins Configuration:**
```bash
# Verify Jenkinsfile syntax
curl -X POST http://35.154.42.145:8080/job/First%20pipeline%20job/descriptorByName/org.jenkinsci.plugins.workflow.cps.CpsFlowDefinition/checkScriptCompile -d "script=@Jenkinsfile"

# Check job configuration
curl -X GET http://35.154.42.145:8080/job/First%20pipeline%20job/config.xml
```

**Test Credentials Locally:**
```bash
# If you have credentials locally
node test-new-credentials.js
```

### 🔧 Advanced Configuration

#### Environment Variables
You can also set these in Jenkins job configuration:
- `SPREADSHEET_ID`: `1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg`
- `SHEET_NAME`: `Meta-Keywords-sheet`

#### Build Parameters
Consider adding these parameters for flexibility:
- `SPREADSHEET_ID` (string parameter)
- `SHEET_NAME` (string parameter)
- `DEMO_MODE` (boolean parameter)

## 🎉 Final Verification

After completing all steps:
1. **Manual build** should succeed
2. **Google Apps Script trigger** should work
3. **Meta scraper** should update Google Sheet
4. **No credentials** should be in repository
5. **All stages** should complete successfully

If any step fails, check the build logs for specific error messages and refer to the troubleshooting section above.
