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
        // Jenkins will need access to credentials.json
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
                    // Check if credentials file exists
                    if (fileExists('credentials.json')) {
                        echo '✅ Credentials file found'
                    } else {
                        error '❌ Credentials file not found. Please add credentials.json to the repository or configure it in Jenkins.'
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
                        sh 'npm start'
                        echo '✅ Meta Scraper completed successfully!'
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
        }
        failure {
            echo '💥 Pipeline failed!'
        }
    }
}
