pipeline {
    agent any

    environment {
        // Define your Docker Hub Registry (Change to your Docker Hub username)
        DOCKER_REGISTRY  = 'aravinth2005/crud-operations'
        DOCKER_HUB_CREDS = credentials('Samy@1234') // Jenkins Credentials ID for Docker Hub
        
        // Define your EC2 details
        EC2_IP           = 'YOUR_EC2_PUBLIC_IP'
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

        // Stage 4: Deploy the application using Docker Compose on the remote EC2 instance
        stage('Deploy Stack') {
            steps {
                echo 'Deploying to remote EC2 instance...'
                sshagent(credentials: [SSH_KEY_ID]) {
                    // Ensure the deployment directory exists on the EC2 host
                    sh "ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} 'mkdir -p /home/ubuntu/app'"
                    
                    // Copy the updated docker-compose.yaml to the EC2 server
                    sh "scp -o StrictHostKeyChecking=no ./run_mern_stack_with_docker_compose/docker-compose.yaml ubuntu@${EC2_IP}:/home/ubuntu/app/docker-compose.yaml"
                    
                    // SSH into the EC2 instance, pull the latest images from Docker Hub, and restart containers
                    sh """
                        ssh -o StrictHostKeyChecking=no ubuntu@${EC2_IP} "
                            cd /home/ubuntu/app &&
                            docker compose pull &&
                            docker compose up -d --remove-orphans
                        "
                    """
                }
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
