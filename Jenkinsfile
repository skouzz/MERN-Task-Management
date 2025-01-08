pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        DOCKER_HUB_CREDENTIALS = credentials('dockerhub') // Reference your Docker Hub credentials in Jenkins
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
