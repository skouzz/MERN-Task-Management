# Task Manager MERN Application with DevOps Integration

A full-stack task management application built with the MERN stack featuring comprehensive DevOps practices including containerization, orchestration, and monitoring.

## Application Features

- User authentication (register/login)
- Create, read, update, and delete tasks
- Drag-and-drop task management
- Responsive design with Tailwind CSS
- Real-time updates
- Due date tracking

## DevOps Architecture

### Containerization
- Docker containers for each service
  ```bash
  # Build frontend image
  docker build -t task-manager-frontend ./frontend
  # Build backend image
  docker build -t task-manager-backend ./backend
  ```
- Multi-stage builds for optimization
  ```dockerfile
  # Example of multi-stage build for frontend
  FROM node:18 AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm install
  COPY . .
  RUN npm run build

  FROM nginx:alpine
  COPY --from=builder /app/dist /usr/share/nginx/html
  ```
- Docker Compose for local development
  ```yaml
  version: '3.8'
  services:
    frontend:
      build: ./frontend
      ports:
        - "5173:5173"
      environment:
        - VITE_API_URL=http://backend:5000
    backend:
      build: ./backend
      ports:
        - "5000:5000"
      environment:
        - MONGODB_URI=mongodb://mongo:27017/task-manager
    mongo:
      image: mongo:latest
      volumes:
        - mongodb_data:/data/db

  volumes:
    mongodb_data:
  ```
- Container security scanning with Trivy
  ```bash
  # Scan container images
  trivy image task-manager-frontend
  trivy image task-manager-backend
  ```

### Continuous Integration/Deployment
- Jenkins pipeline stages:
  ```groovy
  pipeline {
    agent any
    stages {
      stage('Build') {
        steps {
          sh 'docker build -t task-manager-frontend ./frontend'
          sh 'docker build -t task-manager-backend ./backend'
        }
      }
      stage('Security Scan') {
        steps {
          sh 'trivy image task-manager-frontend'
          sh 'trivy image task-manager-backend'
        }
      }
      stage('Push to Registry') {
        steps {
          sh 'docker push yourregistry/task-manager-frontend'
          sh 'docker push yourregistry/task-manager-backend'
        }
      }
    }
  }
  ```
- GitOps with ArgoCD
  ```yaml
  # Application manifest example
  apiVersion: argoproj.io/v1alpha1
  kind: Application
  metadata:
    name: task-manager
    namespace: argocd
  spec:
    project: default
    source:
      repoURL: https://github.com/yourusername/task-manager.git
      targetRevision: HEAD
      path: k8s
    destination:
      server: https://kubernetes.default.svc
      namespace: task-manager
  ```
- Helm Charts structure:
  ```
  helm/task-manager/
  ├── Chart.yaml
  ├── values.yaml
  ├── templates/
  │   ├── deployment.yaml
  │   ├── service.yaml
  │   ├── ingress.yaml
  │   └── configmap.yaml
  ```

### Kubernetes Orchestration
- Local cluster setup:
  ```bash
  # Start Minikube
  minikube start --driver=docker --cpus=2 --memory=4096

  # OR start Kind
  kind create cluster --name task-manager
  ```
- Apply Kubernetes manifests:
  ```bash
  # Apply base configurations
  kubectl apply -f k8s/base/

  # Apply environment-specific overlays
  kubectl apply -k k8s/overlays/development/
  ```
- ConfigMaps and Secrets:
  ```yaml
  apiVersion: v1
  kind: ConfigMap
  metadata:
    name: task-manager-config
  data:
    API_URL: "http://backend-service:5000"
    MONGODB_URI: "mongodb://mongo-service:27017/task-manager"
  ```

### Monitoring Stack
- Prometheus setup:
  ```yaml
  # prometheus-values.yaml
  prometheus:
    prometheusSpec:
      serviceMonitorSelectorNilUsesHelmValues: false
      serviceMonitorSelector: {}
      serviceMonitorNamespaceSelector: {}
  ```
- Grafana deployment:
  ```bash
  helm install grafana grafana/grafana \
    --namespace monitoring \
    --set persistence.enabled=true \
    --set adminPassword='your-admin-password'
  ```
- Custom metrics example:
  ```javascript
  // Backend metrics endpoint
  const prometheus = require('prom-client');
  const taskCounter = new prometheus.Counter({
    name: 'tasks_created_total',
    help: 'Total number of created tasks'
  });
  ```

## Prerequisites

### Application Requirements
- Node.js (v14 or higher)
- MongoDB installed locally or MongoDB Atlas account
- Git

### DevOps Requirements
- Docker and Docker Compose
- Kubernetes cluster (Minikube/Kind)
- Jenkins
- Helm
- ArgoCD
- Prometheus & Grafana

## Project Structure

\`\`\`
task-manager/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── index.js
│   ├── Dockerfile
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── index.html
│   └── package.json
├── k8s/
│   ├── base/
│   │   ├── deployments/
│   │   ├── services/
│   │   └── configmaps/
│   └── overlays/
│       ├── development/
│       └── production/
├── helm/
│   └── task-manager/
├── monitoring/
│   ├── prometheus/
│   └── grafana/
├── Jenkinsfile
└── docker-compose.yml
\`\`\`

## Installation and Setup

### Application Setup

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd task-manager
\`\`\`

2. Install backend dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

3. Install frontend dependencies:
\`\`\`bash
cd ../frontend
npm install
\`\`\`

### DevOps Setup

1. Start local Kubernetes cluster:
\`\`\`bash
# Initialize Minikube
minikube start --driver=docker
# Enable ingress addon
minikube addons enable ingress
# Set docker env
eval $(minikube docker-env)
\`\`\`

2. Install Helm charts:
\`\`\`bash
# Add required Helm repositories
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo add grafana https://grafana.github.io/helm-charts
helm repo update

# Install application chart
helm install task-manager ./helm/task-manager
\`\`\`

3. Deploy monitoring stack:
\`\`\`bash
# Create monitoring namespace
kubectl create namespace monitoring

# Install Prometheus
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring \
  -f monitoring/prometheus/values.yaml

# Install Grafana
helm install grafana grafana/grafana \
  --namespace monitoring \
  -f monitoring/grafana/values.yaml
\`\`\`

4. Setup ArgoCD:
\`\`\`bash
# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443
\`\`\`

## Development Workflow

### Local Development
1. Start the development environment:
\`\`\`bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
\`\`\`

2. Access the application at \`http://localhost:5173\`

### CI/CD Pipeline

The Jenkins pipeline includes:
1. Code checkout
2. Build Docker images
3. Security scan with Trivy
4. Push to Docker Hub
5. Deploy to Kubernetes via ArgoCD

Example pipeline execution:
\`\`\`bash
# Trigger Jenkins build
curl -X POST http://jenkins-url/job/task-manager/build

# Monitor ArgoCD sync status
argocd app sync task-manager
argocd app get task-manager
\`\`\`

## Monitoring and Observability

### Metrics Collection
- Application metrics via Prometheus
  ```bash
  # Port forward Prometheus
  kubectl port-forward svc/prometheus-operated 9090:9090 -n monitoring
  ```
- Node and container metrics
  ```bash
  # View node metrics
  kubectl top nodes
  # View pod metrics
  kubectl top pods
  ```
- Custom business metrics
  ```javascript
  // Example custom metric in Node.js
  const counter = new prometheus.Counter({
    name: 'task_manager_operations_total',
    help: 'Total number of task operations',
    labelNames: ['operation_type']
  });
  ```

### Dashboards
- Access Grafana:
  ```bash
  # Get Grafana admin password
  kubectl get secret grafana -n monitoring -o jsonpath="{.data.admin-password}" | base64 --decode
  
  # Port forward Grafana
  kubectl port-forward svc/grafana 3000:80 -n monitoring
  ```
- Import dashboards:
  - Node Exporter Dashboard ID: 1860
  - Kubernetes Cluster Dashboard ID: 315
  - Custom Task Manager Dashboard (provided in monitoring/grafana/dashboards)

## API Endpoints

### Authentication
- POST \`/api/users/register\` - Register a new user
- POST \`/api/users/login\` - Login user

### Tasks
- GET \`/api/tasks\` - Get all tasks for authenticated user
- POST \`/api/tasks\` - Create a new task
- PATCH \`/api/tasks/:id\` - Update a task
- DELETE \`/api/tasks/:id\` - Delete a task

## Technologies Used

### Application Stack
- React with TypeScript
- Node.js & Express.js
- MongoDB
- Tailwind CSS
- Hello Pangea DnD

### DevOps Stack
- Docker & Docker Compose
- Kubernetes
- Jenkins
- ArgoCD
- Helm
- Prometheus
- Grafana
- Trivy

## Contributing

1. Fork the repository
2. Create your feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add some amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
