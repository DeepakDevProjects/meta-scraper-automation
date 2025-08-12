pipeline {
    agent any

    // Defines the Node.js version to use.
    tools {
        nodejs 'node-20' 
    }

    environment {
        // Environment variables for the application
        SPREADSHEET_ID = '1u_6w8LhMj-zg8qQxg71zNRmdzdbVPDm1UKDNj_9IAtg'
        SHEET_NAME = 'Meta-Keywords-sheet'
        // Credentials will be injected by Jenkins
        GOOGLE_APPLICATION_CREDENTIALS = "${WORKSPACE}/credentials.json"
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the project from your Git repository.
                git branch: 'main', url: 'https://github.com/DeepakDevProjects/meta-scraper-automation.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Setup Credentials') {
            steps {
                script {
                    echo '🔐 Setting up Google Service Account credentials...'
                    
                    // Bind credentials from Jenkins Credentials Manager
                    withCredentials([file(credentialsId: 'google-service-account-key', variable: 'GOOGLE_CREDENTIALS')]) {
                        // Copy credentials to workspace
                        sh 'cp $GOOGLE_CREDENTIALS credentials.json'
                        sh 'chmod 600 credentials.json'
                        
                        // Verify credentials
                        if (fileExists('credentials.json')) {
                            echo '✅ Credentials file created successfully'
                            def credentials = readJSON file: 'credentials.json'
                            echo "📧 Service Account: ${credentials.client_email}"
                            echo "🆔 Project ID: ${credentials.project_id}"
                        } else {
                            error '❌ Failed to create credentials file'
                        }
                    }
                }
            }
        }
        
        stage('Compile TypeScript') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Run Meta Scraper') {
            steps {
                script {
                    try {
                        echo '🚀 Starting Meta Scraper Automation...'
                        echo "📊 Target Spreadsheet: ${SPREADSHEET_ID}"
                        echo "📋 Sheet Name: ${SHEET_NAME}"
                        
                        sh 'npm start'
                        
                        echo '✅ Meta Scraper completed successfully!'
                        echo '📝 Results have been updated in the Google Sheet'
                    } catch (error) {
                        echo "❌ Meta Scraper failed: ${error}"
                        currentBuild.result = 'FAILURE'
                        error 'Meta Scraper job failed'
                    }
                }
            }
        }
    }

    // This is the Slack notification block.
    post {
        always {
            // Sends a message to the Slack channel with the build status.
            slackSend channel: '#your-slack-channel', message: "Build ${currentBuild.fullDisplayName} finished with status ${currentBuild.result}"
        }
        success {
            echo '🎉 Pipeline completed successfully!'
            echo '📊 Meta keywords have been scraped and updated in Google Sheet'
        }
        failure {
            echo '💥 Pipeline failed!'
            echo '🔍 Check the build logs for detailed error information'
        }
        cleanup {
            // Clean up sensitive files
            script {
                if (fileExists('credentials.json')) {
                    sh 'rm -f credentials.json'
                    echo '🧹 Credentials file cleaned up'
                }
            }
        }
    }
}
