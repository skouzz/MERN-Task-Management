pipeline {
    agent any

    environment {
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials')
        DOCKER_IMAGE_BACKEND = 'skouzz/backend'
        DOCKER_IMAGE_FRONTEND = 'skouzz/frontend'
        BUILD_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Check Docker') {
            steps {
                script {
                    try {
                        bat 'docker info'
                    } catch (Exception e) {
                        error "Docker is not running or not accessible: ${e.message}"
                    }
                }
            }
        }

        stage('Build Images') {
            parallel {
                stage('Build Backend') {
                    steps {
                        script {
                            bat """
                                docker build -t ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} ./backend
                            """
                        }
                    }
                }
                stage('Build Frontend') {
                    steps {
                        script {
                            bat """
                                docker build -t ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} ./frontend
                            """
                        }
                    }
                }
            }
        }

        stage('Security Scan') {
            parallel {
                stage('Scan Backend') {
                    steps {
                        script {
                            bat """
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image \
                                --exit-code 1 \
                                --severity HIGH,CRITICAL \
                                ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG}
                            """
                        }
                    }
                }
                stage('Scan Frontend') {
                    steps {
                        script {
                            bat """
                                docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image \
                                --exit-code 1 \
                                --severity HIGH,CRITICAL \
                                ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}
                            """
                        }
                    }
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
                        bat """
                            echo %DOCKER_PASSWORD% | docker login -u %DOCKER_USER% --password-stdin
                            docker push ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG}
                            docker push ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG}
                        """
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                // Clean up images
                bat """
                    docker rmi ${DOCKER_IMAGE_BACKEND}:${BUILD_TAG} || true
                    docker rmi ${DOCKER_IMAGE_FRONTEND}:${BUILD_TAG} || true
                    docker logout || true
                """
            }
        }
        success {
            echo "Pipeline completed successfully!"
        }
        failure {
            echo "Pipeline failed! Check the logs for details."
        }
    }
}
