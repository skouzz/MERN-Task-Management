pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'your-dockerhub-username/task-manager-backend'
        DOCKER_IMAGE_FRONTEND = 'your-dockerhub-username/task-manager-frontend'
    }

    stages {
        stage('Build Images') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER ./backend'
                sh 'docker build -t $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER ./frontend'
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy image $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                sh 'trivy image $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                sh 'docker push $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}