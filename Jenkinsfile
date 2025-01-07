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
                        bat 'docker build -t %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER% ./backend'
                        bat 'docker build -t %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER% ./frontend'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Build Image Stage Failed: ${e.getMessage()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }

        stage('Security Scan') {
            steps {
                script {
                    try {
                        bat 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%'
                        bat 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Security Scan Stage Failed: ${e.getMessage()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    try {
                        bat 'echo %DOCKER_HUB_CREDS_PSW% | docker login -u %DOCKER_HUB_CREDS_USR% --password-stdin'
                        bat 'docker push %DOCKER_IMAGE_BACKEND%:%BUILD_NUMBER%'
                        bat 'docker push %DOCKER_IMAGE_FRONTEND%:%BUILD_NUMBER%'
                    } catch (Exception e) {
                        currentBuild.result = 'FAILURE'
                        echo "Push to Docker Hub Stage Failed: ${e.getMessage()}"
                        throw e  // Rethrow to mark the build as failed
                    }
                }
            }
        }
    }

    post {
        always {
            echo 'Cleaning up Docker session...'
            bat 'docker logout'
        }
        failure {
            echo 'Build failed. Check the logs for more details.'
        }
        success {
            echo 'Build succeeded.'
        }
    }
}
