pipeline {
    agent any

    environment {
        // Define your Docker Hub Registry (Change 'aravinthaaarav' to your Docker Hub username)
        DOCKER_REGISTRY  = 'aravinth2005/crud-operations'
        DOCKER_HUB_CREDS = credentials('Samy@1234') // Jenkins Credentials ID for Docker Hub
    }

    stages {
        // Stage 1: Pull the latest code from GitHub
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // Stage 2: Build the Docker images using the Dockerfiles in run_mern_stack_with_docker_compose
        stage('Build Images') {
            steps {
                script {
                    echo 'Building Backend Docker Image...'
                    dockerBackend = docker.build("${DOCKER_REGISTRY}-backend:latest", "./run_mern_stack_with_docker_compose/backend")

                    echo 'Building Frontend Docker Image...'
                    dockerFrontend = docker.build("${DOCKER_REGISTRY}-frontend:latest", "./run_mern_stack_with_docker_compose/frontend")
                }
            }
        }

        // Stage 3: Authenticate and Push the images to Docker Hub
        stage('Push Images') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'Samy@1234') {
                        echo 'Pushing Backend Image to Docker Hub...'
                        dockerBackend.push()

                        echo 'Pushing Frontend Image to Docker Hub...'
                        dockerFrontend.push()
                    }
                }
            }
        }

        // Stage 4: Deploy the application using Docker Compose
        stage('Deploy Stack') {
            steps {
                echo 'Deploying application using Docker Compose...'
                // If running Jenkins directly on your target deployment server:
                dir('run_mern_stack_with_docker_compose') {
                    sh 'docker compose down || true'
                    sh 'docker compose up -d'
                }
                
                // NOTE: If your Jenkins server is separate from your production EC2 server,
                // you would use the Jenkins sshagent plugin to run:
                // sshagent(credentials: ['ec2-ssh-key']) {
                //     sh "ssh -o StrictHostKeyChecking=no ubuntu@<EC2_IP> 'cd /app && docker compose pull && docker compose up -d'"
                // }
            }
        }
    }

    post {
        always {
            // Clean workspace to save disk space on Jenkins node
            cleanWs()
        }
        success {
            echo 'CI/CD Pipeline executed successfully!'
        }
        failure {
            echo 'CI/CD Pipeline failed. Check console output for errors.'
        }
    }
}
