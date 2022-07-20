# Udagram Deployment

Deployment folder is folder includes *.yaml files to deploy service feed,user,reverse, frontend and setting config aws-secret, env parameters.
To apply deployment,service and setting env,credentials run as command bellow:

kubectl apply -f aws-secret.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f env-configmap.yaml

kubectl apply -f deployment-feed-backend.yaml
kubectl apply -f service-feed-backend.yaml

# Do the same for other three service files (feed,user, frontend, reserveproxy)

# Check the deployment names and their pod status
kubectl get deployments
# Create a Service object that exposes the frontend deployment
# The command below will ceates an external load balancer and assigns a fixed, external IP to the Service.
kubectl expose deployment frontend --type=LoadBalancer --name=publicfrontend
# Repeat the process for the *reverseproxy* deployment. 
# Check name, ClusterIP, and External IP of all deployments
kubectl get services 
kubectl get pods # It should show the STATUS as Running
