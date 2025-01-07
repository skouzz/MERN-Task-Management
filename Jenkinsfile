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
                script {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        bat "docker build -t %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER% .\\backend"
                        bat "docker build -t %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER% .\\frontend"
                        bat "docker build -t %DOCKER_IMAGE_MONGO%:%BUILD_NUMBER% .\\mongo"
                    }
                }
            }
        }

        stage('Security Scan (Trivy Docker Container)') {
            steps {
                script {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%"
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%"
                        bat "docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image %DOCKER_IMAGE_MONGO%:%BUILD_NUMBER%"
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    catchError(buildResult: 'FAILURE', stageResult: 'FAILURE') {
                        bat "echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin"
                        bat "docker push %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%"
                        bat "docker push %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%"
                        bat "docker push %DOCKER_IMAGE_MONGO%:%BUILD_NUMBER%"
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
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check error messages for details.'
        }
    }
}
