pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
    }

    stages {
        stage('Build Images') {
            steps {
                script {
                    try {
                        echo "Building Backend Docker Image..."
                        bat 'docker build -t %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER% ./backend'
                        echo "Building Frontend Docker Image..."
                        bat 'docker build -t %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER% ./frontend'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Build Image Stage Failed: ${e.getMessage()}"
                        echo "Detailed error: ${e.printStackTrace()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        echo "Running Security Scan for Backend Image..."
                        bat 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%'
                        echo "Running Security Scan for Frontend Image..."
                        bat 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Security Scan Stage Failed: ${e.getMessage()}"
                        echo "Detailed error: ${e.printStackTrace()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        echo "Logging in to Docker Hub..."
                        bat 'echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin'
                        echo "Pushing Backend Image to Docker Hub..."
                        bat 'docker push %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%'
                        echo "Pushing Frontend Image to Docker Hub..."
                        bat 'docker push %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Push to Docker Hub Stage Failed: ${e.getMessage()}"
                        echo "Detailed error: ${e.printStackTrace()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Skipping Docker logout step...'
        }
        failure {
            echo 'Build failed. Skipping cleanup. Check the logs for more details.'
        }
        success {
            echo 'Build succeeded. Skipping cleanup.'
        }
    }
}
