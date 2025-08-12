pipeline {
    agent any

    // Defines the Node.js version to use.
    tools {
        nodejs 'node-20' 
    }

    stages {
        stage('Checkout Code') {
            steps {
                // Checkout the project from your Git repository.
                git branch: 'main', url: 'http://github.com/DeepakDevProjects/meta-scraper-automation'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Compile TypeScript') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Run Application') {
            steps {
                sh 'npm start'
            }
        }
    }

    // This is the Slack notification block.
    post {
        always {
            // Sends a message to the Slack channel with the build status.
            slackSend channel: '#your-slack-channel', message: "Build ${currentBuild.fullDisplayName} finished with status ${currentBuild.result}"
        }
    }
}