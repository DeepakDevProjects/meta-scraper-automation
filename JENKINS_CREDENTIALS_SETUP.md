# 🔐 Jenkins Credentials Setup Guide

## Overview
This guide will help you configure Jenkins to automatically handle the Google service account credentials without storing them in the repository.

## 🏗️ Step 1: Configure Jenkins Credentials Manager

### 1.1 Access Jenkins Credentials
1. Go to your Jenkins instance: http://35.154.42.145:8080
2. Click **"Manage Jenkins"** in the left sidebar
3. Click **"Manage Credentials"**
4. Click on **"(global)"** domain

### 1.2 Add Google Service Account Credential
1. Click **"Add Credentials"**
2. Select credential type: **"Secret file"**
3. Fill in the details:
   - **Kind**: Secret file
   - **Scope**: Global
   - **ID**: `google-service-account-key`
   - **Description**: `Google Service Account credentials for meta scraper`
   - **Secret**: Upload your `credentials.json` file
4. Click **"Create"**

## 🔧 Step 2: Configure Jenkins Job

### 2.1 Update Job Configuration
1. Go to your Jenkins job: **"First pipeline job"**
2. Click **"Configure"**
3. Scroll down to **"Build Environment"** section
4. Check **"Use secret text(s) or file(s)"**
5. Click **"Add"** → **"Secret file"**
6. Configure the binding:
   - **Variable**: `GOOGLE_CREDENTIALS`
   - **Credentials**: Select `google-service-account-key` (the one you created)
   - **Target**: `credentials.json`
7. Click **"Save"**

### 2.2 Alternative: Pipeline Credentials Binding
If you prefer to handle credentials in the pipeline, add this to your Jenkinsfile:

```groovy
pipeline {
    agent any
    
    environment {
        SPREADSHEET_ID = '1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg'
        SHEET_NAME = 'Meta-Keywords-sheet'
    }
    
    stages {
        stage('Setup Credentials') {
            steps {
                script {
                    // Bind credentials to workspace
                    withCredentials([file(credentialsId: 'google-service-account-key', variable: 'GOOGLE_CREDENTIALS')]) {
                        sh 'cp $GOOGLE_CREDENTIALS credentials.json'
                        sh 'chmod 600 credentials.json'
                    }
                }
            }
        }
        
        // ... rest of your stages
    }
}
```

## 🧪 Step 3: Test the Setup

### 3.1 Verify Credentials
1. Run a test build in Jenkins
2. Check the build logs for:
   - ✅ "Credentials file found and ready"
   - ✅ Service Account email displayed
   - ✅ Project ID displayed

### 3.2 Test Complete Workflow
1. Add URLs to your Google Sheet
2. Click "Trigger Jenkins" button
3. Monitor Jenkins build
4. Verify results in Google Sheet

## 🔒 Security Benefits

### ✅ What This Achieves:
- **No credentials in repository** - Secure by design
- **Automatic credential injection** - Jenkins handles it
- **Credential rotation** - Easy to update without code changes
- **Access control** - Only authorized users can access credentials
- **Audit trail** - Jenkins logs credential usage

### 🛡️ Best Practices:
- **Rotate credentials regularly** - Update the credential in Jenkins
- **Limit access** - Only give necessary permissions to service account
- **Monitor usage** - Check Jenkins logs for credential access
- **Backup credentials** - Keep a secure backup of your service account key

## 🚨 Troubleshooting

### Common Issues:

1. **"Credentials file not found"**
   - Verify credential is configured in Jenkins
   - Check credential ID matches in job configuration
   - Ensure credential type is "Secret file"

2. **"Invalid JWT Signature"**
   - Update the credential in Jenkins with fresh key
   - Verify service account has correct permissions
   - Check if key has expired

3. **"Permission denied"**
   - Verify service account email has access to Google Sheet
   - Check Google Cloud project settings
   - Ensure Google Sheets API is enabled

### Debug Commands:
```bash
# Check if credentials file exists
ls -la credentials.json

# Verify file permissions
chmod 600 credentials.json

# Test credentials locally (if available)
node test-new-credentials.js
```

## 📋 Complete Workflow

1. **User clicks "Trigger Jenkins"** in Google Sheet
2. **Google Apps Script** sends request to Jenkins
3. **Jenkins starts pipeline** with automatic credential injection
4. **Pipeline runs meta scraper** using injected credentials
5. **Results update** back to Google Sheet
6. **Credentials are cleaned up** automatically

## 🎯 Success Indicators

- ✅ Jenkins job starts without credential errors
- ✅ Pipeline shows "Credentials file found and ready"
- ✅ Meta scraper runs successfully
- ✅ Google Sheet is updated with results
- ✅ No credentials stored in repository

## 📞 Support

If you encounter issues:
1. Check Jenkins credential configuration
2. Verify service account permissions
3. Test credentials locally
4. Review Jenkins build logs
5. Check Google Cloud Console for API errors
