pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        DOCKER_IMAGE_MONGO = 'skouzz/mongo'
    }

    stages {
        stage('Build Images') {
            steps {
                script {
                    try {
                        echo 'Building Backend Image...'
                        sh "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ./backend"
                        
                        echo 'Building Frontend Image...'
                        sh "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ./frontend"
                        
                        echo 'Building Mongo Image...'
                        sh "docker build -t ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER} ./mongo"
                    } catch (Exception e) {
                        echo "Error during image building: ${e.getMessage()}"
                        error('Image build failed. Check the logs for more details.')
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        echo 'Scanning Backend Image...'
                        sh "trivy image ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                        
                        echo 'Scanning Frontend Image...'
                        sh "trivy image ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                        
                        echo 'Scanning Mongo Image...'
                        sh "trivy image ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        echo "Error during security scan: ${e.getMessage()}"
                        error('Security scan failed. Check the logs for more details.')
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        echo 'Logging into Docker Hub...'
                        sh "echo ${DOCKER_HUB_CREDS_PSW} | docker login -u ${DOCKER_HUB_CREDS_USR} --password-stdin"
                        
                        echo 'Pushing Backend Image...'
                        sh "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                        
                        echo 'Pushing Frontend Image...'
                        sh "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                        
                        echo 'Pushing Mongo Image...'
                        sh "docker push ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        echo "Error during Docker push: ${e.getMessage()}"
                        error('Docker push failed. Check the logs for more details.')
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Logging out from Docker Hub...'
            sh 'docker logout'
        }
    }
}
