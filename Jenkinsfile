pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        DOCKER_HUB_USERNAME = 'skouzz'
        DOCKER_HUB_PAT = credentials('dockerhub') // Replace with your Jenkins credentials ID
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
            }
        }

        stage('Login to Docker Hub') {
            steps {
                echo "Logging into Docker Hub..."
                bat "echo ${DOCKER_HUB_PAT} | docker login -u ${DOCKER_HUB_USERNAME} --password-stdin"
            }
        }

        stage('Build Images') {
            steps {
                echo "Building backend Docker image..."
                bat "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ./backend"
                
                echo "Building frontend Docker image..."
                bat "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ./frontend"
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        echo "Running security scan on backend Docker image using Trivy..."
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Security scan failed for backend: ${e.message}"
                    }

                    try {
                        echo "Running security scan on frontend Docker image using Trivy..."
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
                echo "Pushing backend Docker image to Docker Hub..."
                bat "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                
                echo "Pushing frontend Docker image to Docker Hub..."
                bat "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            bat 'docker logout'
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
