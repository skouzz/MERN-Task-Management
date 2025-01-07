pipeline {
    agent any
    
    tools {
        git 'Default'
    }

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                script {
                    try {
                        bat "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ./backend"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Build backend image failed: ${e.message}"
                    }
                    try {
                        bat "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ./frontend"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Build frontend image failed: ${e.message}"
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Security scan failed for backend: ${e.message}"
                    }
                    try {
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Security scan failed for frontend: ${e.message}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                            bat "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                            bat "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                        }
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Docker push failed: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                bat 'docker info || echo "Docker is not running."'
                bat 'docker logout || echo "Docker logout failed."'
                cleanWs()
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed! Please check the logs for detailed error messages."
        }
    }
}
