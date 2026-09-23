pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Install') {
            steps {
                bat 'npm ci'
            }
        }
        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
        stage('Validate HTML') {
            steps {
                bat 'npm install --no-save html-validate'
                bat 'npx html-validate "**/*.html"'
            }
        }
        stage('Build') {
            steps {
                echo 'Static site — no build step required'
            }
        }
    }
}