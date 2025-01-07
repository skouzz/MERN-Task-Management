pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-skouzz') // Updated Docker Hub credentials ID
        BACKEND_IMAGE = 'skouzz/backend'
        FRONTEND_IMAGE = 'skouzz/frontend'
        MONGO_IMAGE = 'mongo'
    }
    stages {
        stage('Checkout Code') {
            steps {
                echo "Checking out code from GitHub..."
                checkout scm
            }
        }
        stage('Build Docker Images') {
            steps {
                script {
                    echo "Building backend Docker image..."
                    sh 'docker build -t $BACKEND_IMAGE ./backend'

                    echo "Building frontend Docker image..."
                    sh 'docker build -t $FRONTEND_IMAGE ./frontend'
                }
            }
        }
        stage('Push Docker Images') {
            steps {
                script {
                    echo "Logging into Docker Hub..."
                    sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'

                    echo "Pushing backend Docker image..."
                    sh 'docker push $BACKEND_IMAGE'

                    echo "Pushing frontend Docker image..."
                    sh 'docker push $FRONTEND_IMAGE'
                }
            }
        }
        stage('Run MongoDB Container') {
            steps {
                script {
                    echo "Running MongoDB container..."
                    sh 'docker run -d --name mongodb -p 27017:27017 $MONGO_IMAGE'
                }
            }
        }
        stage('Clean Up') {
            steps {
                script {
                    echo "Cleaning up dangling Docker images..."
                    sh 'docker image prune -f'
                }
            }
        }
    }
    post {
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed. Please check the logs for details."
        }
    }
}
