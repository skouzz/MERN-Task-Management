pipeline {
    agent any

    environment {
        // Replace with your Docker Hub credentials ID
        DOCKER_HUB_CREDS = credentials('dockerhub-skouzz') // Updated credentials ID
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
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
                sh 'docker build -t $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER ./backend'
                
                echo "Building frontend Docker image..."
                sh 'docker build -t $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER ./frontend'
            }
        }

        stage('Security Scan') {
            steps {
                echo "Running security scan on backend Docker image..."
                sh 'trivy image $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                
                echo "Running security scan on frontend Docker image..."
                sh 'trivy image $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "Logging into Docker Hub..."
                    // Docker login using Jenkins credentials
                    sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                    
                    echo "Pushing backend Docker image..."
                    sh 'docker push $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                    
                    echo "Pushing frontend Docker image..."
                    sh 'docker push $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
                }
            }
        }
    }

    post {
        always {
            echo "Logging out of Docker..."
            sh 'docker logout'
        }
        success {
            echo "Build and push completed successfully!"
        }
        failure {
            echo "Build failed, please check the logs for more details."
        }
    }
}
