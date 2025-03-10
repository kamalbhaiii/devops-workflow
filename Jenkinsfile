pipeline {
    agent any

    stages{
        stage("Checkout git") {
            steps{
                git branch='master', url='https://github.com/kamalbhaiii/interview-task.git'
            }
        }
        stage('Stop running containers of compose') {
            steps {
                bat 'docker-compose -f compose.yaml down'
            }
        }
        stage('Remove all images') {
            steps {
                bat 'docker rmi mongo:latest || TRUE'
                bat 'docker rmi mongo-express ||TRUE'
                bat 'docker rmi interview-task-backend || TRUE'
                bat 'docker rmi interview-task-frontend || TRUE' 
            }
        }
        stage('Build and Pull the required images') {
            steps {
                bat 'docker pull mongo:latest'
                bat 'docker pull mongo-express:latest'
                bat 'docker build -t interview-task-frontend ./frontend'
                bat 'docker build -t interview-task-backend ./backend'
            }
        }
        stage('Run docker compose file'){
            steps {
                bat 'docker-compose -f compose.yaml up -d'
            }
        }
    }
}
