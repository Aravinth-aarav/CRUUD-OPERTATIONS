pipeline {
    agent any

    environment {
        // Define your Docker Hub Registry (Change to your Docker Hub username)
        DOCKER_REGISTRY  = 'aravinth2005/crud-operations'
        DOCKER_HUB_CREDS = credentials('docker-hub-credentials') // Jenkins Credentials ID for Docker Hub
        
        // Define your EC2 details
        EC2_IP           = '13.201.2.39'
        SSH_KEY_ID       = 'ec2-ssh-key' // Jenkins Credentials ID for your EC2 .pem private key
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
                echo 'Building Backend Docker Image...'
                bat "docker build -t ${DOCKER_REGISTRY}-backend:latest ./run_mern_stack_with_docker_compose/backend"

                echo 'Building Frontend Docker Image...'
                bat "docker build -t ${DOCKER_REGISTRY}-frontend:latest ./run_mern_stack_with_docker_compose/frontend"
            }
        }

        // Stage 3: Authenticate and Push the images to Docker Hub
        stage('Push Images') {
            steps {
                echo 'Logging into Docker Hub and pushing images...'
                withCredentials([usernamePassword(credentialsId: 'docker-hub-credentials', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    bat "echo %DOCKER_PASS%| docker login -u %DOCKER_USER% --password-stdin"
                    bat "docker push ${DOCKER_REGISTRY}-backend:latest"
                    bat "docker push ${DOCKER_REGISTRY}-frontend:latest"
                }
            }
        }

        // Stage 4: Deploy the application using Docker Compose on the remote EC2 instance
        stage('Deploy Stack') {
            steps {
                echo 'Deploying to remote EC2 instance...'
                withCredentials([sshUserPrivateKey(credentialsId: SSH_KEY_ID, keyFileVariable: 'KEY_FILE')]) {
                    // Ensure the deployment directory exists on the EC2 host (runs SSH command to Linux EC2)
                    bat "ssh -i \"%KEY_FILE%\" -o StrictHostKeyChecking=no ubuntu@${EC2_IP} \"mkdir -p /home/ubuntu/app\""
                    
                    // Copy the updated docker-compose.yaml to the EC2 server (SCP transfer from Windows to Linux)
                    bat "scp -i \"%KEY_FILE%\" -o StrictHostKeyChecking=no ./run_mern_stack_with_docker_compose/docker-compose.yaml ubuntu@${EC2_IP}:/home/ubuntu/app/docker-compose.yaml"
                    
                    // SSH into the EC2 instance, pull the latest images from Docker Hub, and restart containers
                    bat "ssh -i \"%KEY_FILE%\" -o StrictHostKeyChecking=no ubuntu@${EC2_IP} \"cd /home/ubuntu/app && docker compose pull && docker compose up -d --remove-orphans\""
                }
            }
        }
    }

    post {
        success {
            echo 'CI/CD Pipeline executed successfully!'
        }
        failure {
            echo 'CI/CD Pipeline failed. Check console output for errors.'
        }
    }
}

