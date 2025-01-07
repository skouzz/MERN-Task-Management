pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Images') {
            steps {
                node {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat "docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER} ./backend"
                            bat "docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER} ./frontend"
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                node {
                    script {
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                node {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                            bat "docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_NUMBER}"
                            bat "docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_NUMBER}"
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            node {
                bat 'docker logout'
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed! Please check the logs for detailed error messages."
        }
    }
}
