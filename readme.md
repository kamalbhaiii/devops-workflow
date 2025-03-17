# DevOps CICD Workflow

This repository demonstrates the implementation of DevOps best practices, including containerization, orchestration, CI/CD, and infrastructure as code.

## Table of Contents
- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Dockerization](#dockerization)
- [CI/CD Pipeline](#cicd-pipeline)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Future Improvements](#future-improvements)

---
## Project Overview
This project includes a full-stack web application with DevOps best practices applied. The key goals are:
- Automate the deployment process using CI/CD.
- Use Docker for containerized development.
- Orchestrate services using Kubernetes.

---
## Technologies Used
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **CI/CD**: Jenkins

---
## Project Structure
```
root/
│── backend/              # Node.js backend service
│── frontend/             # React.js frontend application
│── k8s/                  # Kubernetes manifests
│── Jenkinsfile           # Jenkins CI/CD pipeline script
│── docker-compose.yaml   # Local containerized development
│── README.md             # Documentation
```

---
## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Docker & Docker Compose
- Kubernetes (minikube or a cloud cluster)
- Jenkins (if using Jenkins pipeline)
- Node.js & npm

### Local Development Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/kamalbhaiii/devops-workflow.git
   cd interview-task
   ```
2. Run the application using Docker Compose:
   ```sh
   docker-compose -f docker-compose.yaml up -d
   ```
3. Access the frontend at `http://localhost:3000` and the backend at `http://localhost:5000`.

---
## Dockerization
### Backend Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["node", "server.js"]
```
### Frontend Dockerfile
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "start"]
```

---
## CI/CD Pipeline
### Jenkinsfile
```groovy
pipeline {
    agent any
    
    environment {
        DOCKERHUB_CREDENTIALS = 'dockerhub'
        FRONTEND_IMAGE = 'kamalbhaiii/frontend'
        BACKEND_IMAGE = 'kamalbhaiii/backend'
        IMAGE_TAG = 'latest'
    }

    stages{
        stage('Checkout Code') {
            steps{
                git 'https://github.com/kamalbhaiii/interview-task.git'
            }
        }
        stage('Remove Images locally') {
            steps {
                bat 'docker rmi backend:%IMAGE_TAG% || exit 0'
                bat 'docker rmi frontend:%IMAGE_TAG% || exit 0'
                bat 'docker rmi %BACKEND_IMAGE%:%IMAGE_TAG% || exit 0'
                bat 'docker rmi %FRONTEND_IMAGE%:%IMAGE_TAG% || exit 0'
            }
        }
        stage('Build image') {
            steps {
                bat 'docker build -t backend:%IMAGE_TAG% ./backend'
                bat 'docker build -t frontend:%IMAGE_TAG% ./frontend'
            }
        }
        stage('Docker login') {
            steps{
                script {
                    withCredentials([usernamePassword(credentialsId: DOCKERHUB_CREDENTIALS, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                        bat "echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin"
                    }
                }
            }
        }
        stage ('Push Backend Image') {
            steps {
                bat 'docker tag backend:%IMAGE_TAG% %BACKEND_IMAGE%:%IMAGE_TAG%'
                bat 'docker push %BACKEND_IMAGE%:%IMAGE_TAG%'
            }
        }
        stage ('Push Frontend Image') {
            steps {
                bat 'docker tag frontend:%IMAGE_TAG% %FRONTEND_IMAGE%:%IMAGE_TAG%'
                bat 'docker push %FRONTEND_IMAGE%:%IMAGE_TAG%'
            }
        }
        stage ('Remove images') {
            steps {
                bat 'docker rmi backend:%IMAGE_TAG% || exit 0'
                bat 'docker rmi frontend:%IMAGE_TAG% || exit 0'
                bat 'docker rmi %BACKEND_IMAGE%:%IMAGE_TAG% || exit 0'
                bat 'docker rmi %FRONTEND_IMAGE%:%IMAGE_TAG% || exit 0'
            }
        }
        stage('Run all k8s files file') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'kubeconfig', variable: 'KUBECONFIG')]) {
                        bat 'kubectl apply -f k8s/'
                    }
                }
            }
        }
    }
}
```
---
## Kubernetes Deployment
### Backend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: backend:latest
          ports:
            - containerPort: 5000
```
### Frontend Deployment
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: frontend
          image: frontend:latest
          ports:
            - containerPort: 3000
```
### Backend Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: backend-service
spec:
  selector:
    app: backend
  ports:
    - protocol: TCP
      port: 5000
      targetPort: 5000
  type: LoadBalancer
```
### Frontend Service
```yaml
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
spec:
  selector:
    app: frontend
  ports:
    - protocol: TCP
      port: 5173
      targetPort: 5173
  type: LoadBalancer
```
---
## Future Improvements
- Implement a Blue-Green Deployment strategy.
- Automate infrastructure provisioning with Terraform.
- Add automated performance testing in CI/CD pipeline.

---
## Conclusion
This repository serves as a well-structured example of implementing DevOps best practices in a full-stack project. Contributions and feedback are welcome!

