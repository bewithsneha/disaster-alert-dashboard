pipeline {
    agent any

    environment {
        DOCKER_IMAGE_FRONTEND = 'disaster-alert-frontend'
        DOCKER_IMAGE_BACKEND = 'disaster-alert-backend'
    }

    stages {
        stage('Checkout') {
            steps {
                // Re-enabled checkout: Jenkins needs to pull the code to build it
                checkout scm 
            }
        }

        stage('Verify Tools') {
            steps {
                sh 'docker --version'
                sh 'docker-compose --version'
            }
        }

        stage('Build Backend Image') {
            steps {
                script {
                    dir('backend') {
                        sh "docker build -t ${DOCKER_IMAGE_BACKEND}:latest ."
                    }
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                script {
                    dir('frontend') {
                        sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:latest ."
                    }
                }
            }
        }

        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose down'
                sh 'docker-compose up -d'
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}