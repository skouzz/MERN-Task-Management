pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
    }

    stages {
        stage('Build Images') {
            steps {
                script {
                    try {
                        bat "docker build -t %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER% .\\backend"
                    } catch (Exception e) {
                        error "Error during building backend image: ${e.message}"
                    }
                    try {
                        bat "docker build -t %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER% .\\frontend"
                    } catch (Exception e) {
                        error "Error during building frontend image: ${e.message}"
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        bat "trivy image %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%"
                    } catch (Exception e) {
                        error "Error during security scan of backend image: ${e.message}"
                    }
                    try {
                        bat "trivy image %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%"
                    } catch (Exception e) {
                        error "Error during security scan of frontend image: ${e.message}"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        bat "echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin"
                    } catch (Exception e) {
                        error "Error during Docker Hub login: ${e.message}"
                    }
                    try {
                        bat "docker push %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%"
                    } catch (Exception e) {
                        error "Error during pushing backend image to Docker Hub: ${e.message}"
                    }
                    try {
                        bat "docker push %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%"
                    } catch (Exception e) {
                        error "Error during pushing frontend image to Docker Hub: ${e.message}"
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                try {
                    bat 'docker logout'
                } catch (Exception e) {
                    echo "Error during Docker logout: ${e.message}"
                }
            }
        }
    }
}
