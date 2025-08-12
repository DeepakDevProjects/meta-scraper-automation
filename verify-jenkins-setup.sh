#!/bin/bash

echo "🔍 Jenkins Pipeline Job Verification Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Manual Verification Checklist:${NC}"
echo ""

echo -e "${GREEN}✅ Step 1: Jenkins Access${NC}"
echo "   - Go to: http://35.154.42.145:8080"
echo "   - Login with your credentials"
echo "   - Verify you can see 'First pipeline job'"
echo ""

echo -e "${GREEN}✅ Step 2: Job Configuration${NC}"
echo "   - Click on 'First pipeline job'"
echo "   - Click 'Configure'"
echo "   - Verify these settings:"
echo ""

echo -e "${YELLOW}   General Tab:${NC}"
echo "   - Job name: 'First pipeline job'"
echo "   - Description: Added"
echo "   - Discard old builds: Checked"
echo ""

echo -e "${YELLOW}   Build Triggers Tab:${NC}"
echo "   - Trigger builds remotely: CHECKED"
echo "   - Authentication Token: 'myToken'"
echo ""

echo -e "${YELLOW}   Build Environment Tab:${NC}"
echo "   - Use secret text(s) or file(s): CHECKED"
echo "   - Secret file binding:"
echo "     * Variable: GOOGLE_CREDENTIALS"
echo "     * Credentials: google-service-account-key"
echo "     * Target: credentials.json"
echo ""

echo -e "${YELLOW}   Pipeline Tab:${NC}"
echo "   - Definition: 'Pipeline script from SCM'"
echo "   - SCM: Git"
echo "   - Repository URL: https://github.com/DeepakDevProjects/meta-scraper-automation.git"
echo "   - Branches to build: */main"
echo "   - Script Path: Jenkinsfile"
echo ""

echo -e "${GREEN}✅ Step 3: Credentials Setup${NC}"
echo "   - Go to Manage Jenkins → Manage Credentials"
echo "   - Look for credential: 'google-service-account-key'"
echo "   - Type should be: Secret file"
echo ""

echo -e "${GREEN}✅ Step 4: Node.js Tool${NC}"
echo "   - Go to Manage Jenkins → Global Tool Configuration"
echo "   - Look for NodeJS installation: 'node-20'"
echo "   - Version should be: Node.js 20.x.x"
echo ""

echo -e "${GREEN}✅ Step 5: Test Build${NC}"
echo "   - Click 'Build Now' on your job"
echo "   - Monitor the build progress"
echo "   - Check for these stages:"
echo "     * Checkout Code"
echo "     * Install Dependencies"
echo "     * Setup Credentials"
echo "     * Compile TypeScript"
echo "     * Run Meta Scraper"
echo ""

echo -e "${GREEN}✅ Step 6: Google Apps Script${NC}"
echo "   - Open your Google Sheet"
echo "   - Go to Extensions → Apps Script"
echo "   - Verify the triggerJenkins function exists"
echo "   - Refresh the sheet to see 'Trigger Jenkins' menu"
echo ""

echo -e "${GREEN}✅ Step 7: Complete Workflow Test${NC}"
echo "   - Add URLs to column A in Google Sheet"
echo "   - Click 'Trigger Jenkins' → 'Trigger Jenkins Job'"
echo "   - Monitor Jenkins build"
echo "   - Verify results in Google Sheet"
echo ""

echo -e "${YELLOW}🚨 Common Issues to Check:${NC}"
echo ""
echo "1. Credentials not found:"
echo "   - Verify credential ID: 'google-service-account-key'"
echo "   - Check credential type is 'Secret file'"
echo ""

echo "2. Node.js not found:"
echo "   - Verify tool name: 'node-20'"
echo "   - Check auto-install is enabled"
echo ""

echo "3. Repository not found:"
echo "   - Verify repository URL is correct"
echo "   - Check branch name is 'main'"
echo ""

echo "4. Pipeline script not found:"
echo "   - Verify Jenkinsfile exists in repository"
echo "   - Check script path is exactly 'Jenkinsfile'"
echo ""

echo -e "${GREEN}🎯 Success Indicators:${NC}"
echo ""
echo "✅ Jenkins build completes successfully"
echo "✅ All pipeline stages pass"
echo "✅ Credentials are found and used"
echo "✅ Meta scraper runs without errors"
echo "✅ Google Sheet is updated with results"
echo "✅ No credentials stored in repository"
echo ""

echo -e "${YELLOW}📞 If you encounter issues:${NC}"
echo "1. Check Jenkins build logs for specific errors"
echo "2. Verify all configuration settings match this checklist"
echo "3. Test credentials locally with: node test-new-credentials.js"
echo "4. Check Google Sheet permissions and sharing"
echo ""

echo -e "${GREEN}🎉 Your Jenkins pipeline should be ready for automation!${NC}"
