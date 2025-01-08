pipeline {
    agent any

    environment {
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
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

        stage('Push to Docker Hub') {
            steps {
                echo "Pushing backend Docker image..."
                powershell "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
            }
        }
    }

    post {
        always {
            echo "Cleaning up..."
            powershell "docker logout"
        }
    }
}
