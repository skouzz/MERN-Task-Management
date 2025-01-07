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
                sh 'docker build -t $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER ./backend'
                sh 'docker build -t $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER ./frontend'
                sh 'docker build -t $DOCKER_IMAGE_MONGO:$BUILD_NUMBER ./mongo'
            }
        }

        stage('Security Scan') {
            steps {
                sh 'trivy image $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                sh 'trivy image $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
                sh 'trivy image $DOCKER_IMAGE_MONGO:$BUILD_NUMBER'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh 'echo $DOCKER_HUB_CREDS_PSW | docker login -u $DOCKER_HUB_CREDS_USR --password-stdin'
                sh 'docker push $DOCKER_IMAGE_BACKEND:$BUILD_NUMBER'
                sh 'docker push $DOCKER_IMAGE_FRONTEND:$BUILD_NUMBER'
                sh 'docker push $DOCKER_IMAGE_MONGO:$BUILD_NUMBER'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}
