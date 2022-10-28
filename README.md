# Udagram Image Filtering Application

## Getting started 

### Prerequisite
1. Environment

`kubectl apply -f aws-secret.yaml`

`kubectl apply -f env-secret.yaml`

`kubectl apply -f env-configmap.yaml`

2. Network

`sh aws/create-network.sh`

### 1. Database

`sh aws/create-rds.sh`

### 2. S3

`sh aws/create-s3.sh`

### 3. Backend API

`kubectl apply -f backend-feed-deployment.yaml`

`kubectl apply -f backend-feed-service.yaml`

### 4. Frontend App

## Tips
