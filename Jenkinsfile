pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        DOCKER_HUB_USERNAME = 'skouzz'  // Your Docker Hub username
        DOCKER_HUB_PAT = 'dckr_pat_A63exY7o4rFLQ0m11Dx1WkAAZmM'  // Your Docker Hub Personal Access Token
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
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

        stage('Docker Hub Login') {  // Separate login stage
            steps {
                echo "Logging into Docker Hub using personal access token..."
                bat """
                    echo %DOCKER_HUB_PAT% | docker login --username %DOCKER_HUB_USERNAME% --password-stdin
                """
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing backend Docker image..."
                bat "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                
                echo "Pushing frontend Docker image..."
                bat "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
            }
        }
    }

    post {
        always {
            echo "Logging out of Docker..."
            bat 'docker logout'
        }
        success {
            echo "Build and push completed successfully!"
        }
        failure {
            echo "Build failed, please check the logs for more details."
        }
    }
}
