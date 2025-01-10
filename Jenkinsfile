pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        DOCKER_IMAGE_MONGO = 'skouzz/mongo' // Update this to use the latest tag
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub')
    }

    stages {
        stage('Login to Docker Hub') {
            steps {
                echo "Logging in to Docker Hub..."
                powershell """
                docker login -u ${DOCKER_HUB_CREDENTIALS_USR} -p ${DOCKER_HUB_CREDENTIALS_PSW}
                """
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

                    try {
                        echo "Running security scan on MongoDB Docker image using Trivy..."
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER}"
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        error "Security scan failed for MongoDB: ${e.message}"
                    }
                }
            }
        }

        stage('Build and Push Backend Docker Image') {
            steps {
                echo "Building backend Docker image..."
                powershell "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ./backend"
                
                echo "Pushing backend Docker image to Docker Hub..."
                powershell "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
            }
        }

        stage('Build and Push Frontend Docker Image') {
            steps {
                echo "Building frontend Docker image..."
                powershell "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ./frontend"
                
                echo "Pushing frontend Docker image to Docker Hub..."
                powershell "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
            }
        }

        stage('Build and Push MongoDB Docker Image') {
            steps {
                script {
                    if (fileExists('./mongo')) {
                        echo "Building MongoDB Docker image..."
                        powershell "docker build -t ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER} ./mongo"

                        echo "Pushing MongoDB Docker image to Docker Hub..."
                        powershell "docker push ${DOCKER_IMAGE_MONGO}:${BUILD_NUMBER}"
                    } else {
                        error "Mongo directory not found. Please check the repository structure."
                    }
                }
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            powershell "docker logout"
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Check logs for details."
        }
    }
}
