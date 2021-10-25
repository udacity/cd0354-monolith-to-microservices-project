# Part 4 - Container Orchestration with Kubernetes

## Prerequisites
We will need to set up our CLI to interface with Kubernetes, our Kubernetes cluster in EKS, and connecting our CLI tool with the newly-created cluster.

### kubectl
For this section we will need to use `kubectl`. Verify that you have the `kubectl` utility installed locally by running the following command:
```bash
kubectl version --short
```
This should print a response with a `Client Version` if it's successful.

### EKS Cluster Creation
We will be creating an EKS cluster with the AWS console.

Follow the instructions provided by AWS on [Creating an Amazon EKS Cluster](https://docs.aws.amazon.com/eks/latest/userguide/create-cluster.html).

Make sure that you are following the steps for _AWS Management Console_ and not _eksctl_ or _AWS CLI_ (you are welcome to try creating a cluster with these alternate methods, but this course will be supporting the _AWS Management Console_ workflow).

During the creation process, the EKS console will provide dropdown menus for selecting options such as IAM roles and VPCs. If none exist for you, follow the documentation that are linked in the EKS console.

#### Tips
* For the _Cluster Service Role_ in the creation process, create an [AWS role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) for EKS. Make sure you attach the policies for `AmazonEKSClusterPolicy`, `AmazonEC2ContainerServiceFullAccess`, and `AmazonEKSServicePolicy`.
* If you don't have a [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/how-it-works.html), create one with the `IPv4 CIDR block` value `10.0.0.0/16`. Make sure you select `No IPv6 CIDR block`.
* Your _Cluster endpoint access_ should be set to _Public_
* Your cluster may take ~20 minutes to be created. Once it's ready, it should be marked with an _Active_ status.

> We use the AWS console and `kubectl` to create and interface with EKS. <a href="https://eksctl.io/introduction/#installation" target="_blank">eksctl</a> is an AWS-supported tool for creating clusters through a CLI interface. Note that we will provide limited support if you choose to use `eksctl` to manage your cluster.

### EKS Node Groups
Once your cluster is created, we will need to add Node Groups so that the cluster has EC2 instances to process the workloads.

Follow the instructions provided by AWS on [Creating a Managed Node Group](https://docs.aws.amazon.com/eks/latest/userguide/create-managed-node-group.html). Similar to before, make sure you're following the steps for _AWS Management Console_.

#### Tips
* For the _Node IAM Role_ in the creation process, create an [AWS role](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_roles.html) for EKS Node Groups. Make sure you attach the policies for `AmazonEKSWorkerNodePolicy`, `AmazonEC2ContainerRegistryReadOnly`, and `AmazonEKS_CNI_Policy`.
* We recommend using `m5.large` instance types
* We recommend setting 2 minimum nodes, 3 maximum nodes


### Connecting kubectl with EKS
Follow the instructions provided by AWS on [Create a kubeconfig for Amazon EKS](https://docs.aws.amazon.com/eks/latest/userguide/create-kubeconfig.html). This will make it such that your `kubectl` will be running against your newly-created EKS cluster.

#### Verify Cluster and Connection
Once `kubectl` is configured to communicate with your EKS cluster, run the following to validate that it's working:
```bash
kubectl get nodes
```
This should return information regarding the nodes that were created in your EKS clusteer.


### Deployment
In this step, you will deploy the Docker containers for the frontend web application and backend API applications in their respective pods.

Recall that while splitting the monolithic app into microservices, you used the values saved in the environment variables, as well as AWS CLI was configured locally. Similar values are required while instantiating containers from the Dockerhub images. 

1. **ConfigMap:** Create `env-configmap.yaml`, and save all your configuration values (non-confidential environments variables) in that file. 


2. **Secret:** Do not store the PostgreSQL username and passwords in the `env-configmap.yaml` file. Instead, create `env-secret.yaml` file to store the confidential values, such as login credentials. Unlike the AWS credentials, these values do not need to be Base64 encoded.


3. **Secret:** Create *aws-secret.yaml* file to store your AWS login credentials. Replace `___INSERT_AWS_CREDENTIALS_FILE__BASE64____` with the Base64 encoded credentials (not the regular username/password). 
     * Mac/Linux users: If you've configured your AWS CLI locally, check the contents of `~/.aws/credentials` file using `cat ~/.aws/credentials` . It will display the `aws_access_key_id` and `aws_secret_access_key` for your AWS profile(s). Now, you need to select the applicable pair of `aws_access_key` from the output of the `cat` command above and convert that string into `base64` . You use commands, such as:
```bash
# Use a combination of head/tail command to identify lines you want to convert to base64
# You just need two correct lines: a right pair of aws_access_key_id and aws_secret_access_key
cat ~/.aws/credentials | tail -n 5 | head -n 2
# Convert 
cat ~/.aws/credentials | tail -n 5 | head -n 2 | base64
```
     * **Windows users:** Copy a pair of *aws_access_key* from the AWS credential file and paste it into the encoding field of this third-party website: https://www.base64encode.org/ (or any other). Encode and copy/paste the result back into the *aws-secret.yaml*  file.

<br data-md>


4. **Deployment configuration:** Create *deployment.yaml* file individually for each service. While defining container specs, make sure to specify the same images you've pushed to the Dockerhub earlier. Ultimately, the frontend web application and backend API applications should run in their respective pods.

5. **Service configuration: **Similarly, create the *service.yaml* file thereby defining the right services/ports mapping.


Once, all deployment and service files are ready, you can use commands like:
```bash
# Apply env variables and secrets
kubectl apply -f aws-secret.yaml
kubectl apply -f env-secret.yaml
kubectl apply -f env-configmap.yaml
# Deployments - Double check the Dockerhub image name and version in the deployment files
kubectl apply -f backend-feed-deployment.yaml
# Do the same for other three deployment files
# Service
kubectl apply -f backend-feed-service.yaml
# Do the same for other three service files
```
Make sure to check the image names in the deployment files above. 



## Connecting k8s services to access the application

If the deployment is successful, and services are created, there are two options to access the application:
1. If you deployed the services as CLUSTERIP, then you will have to [forward a local port to a port on the "frontend" Pod](https://kubernetes.io/docs/tasks/access-application-cluster/port-forward-access-application-cluster/#forward-a-local-port-to-a-port-on-the-pod). In this case, you don't need to change the URL variable locally. 


2. If you exposed the "frontend" deployment using a Load Balancer's External IP, then you'll have to update the URL environment variable locally, and re-deploy the images with updated env variables. 

Below, we have explained method #2, as mentioned above. 

### Expose External IP

Use this link to <a href="https://kubernetes.io/docs/tutorials/stateless-application/expose-external-ip-address/" target="_blank">expose an External IP</a> address to access your application in the EKS Cluster.

```bash
# Check the deployment names and their pod status
kubectl get deployments
# Create a Service object that exposes the frontend deployment:
kubectl expose deployment frontend --type=LoadBalancer --name=publicfrontend
kubectl get services publicfrontend
# Note down the External IP, such as 
# a5e34958a2ca14b91b020d8aeba87fbb-1366498583.us-east-1.elb.amazonaws.com
# Check name, ClusterIP, and External IP of all deployments
kubectl get services 
```


### Update the environment variables 

Once you have the External IP of your front end and reverseproxy deployment, Change the API endpoints in the following places locally:

* Environment variables - Replace the http://**localhost**:8100 string with the Cluster-IP of the *frontend* service.  After replacing run `source ~/.zshrc` and verify using `echo $URL`



*  *udagram-deployment/env-configmap.yaml* file - Replace http://localhost:8100 string with the Cluster IP of the *frontend*. 



* *udagram-frontend/src/environments/environment.ts* file - Replace 'http://localhost:8080/api/v0' string with either the Cluster IP of the *reverseproxy* deployment.  



*  *udagram-frontend/src/environments/environment.prod.ts* - Replace 'http://localhost:8080/api/v0' string. 



* Retag in the `.travis.yaml` (say use v3, v4, v5, ...) as well as deployment YAML files

Then, push your changes to the Github repo. Travis will automatically build and re-push images to your Dockerhub. 
Next, re-apply configmap and re-deploy to the k8s cluster.
```bash
kubectl apply -f env-configmap.yaml
# Rolling update "frontend" containers of "frontend" deployment, updating the image
kubectl set image deployment frontend frontend=sudkul/udagram-frontend:v3
# Do the same for other three deployments
```
Check your deployed application at the External IP of your *publicfrontend* service. 

>**Note**: There can be multiple ways of setting up the deployment in the k8s cluster. As long as your deployment is successful, and fulfills [Project Rubric](https://review.udacity.com/#!/rubrics/2804/view), you are good go ahead!

## Troubleshoot
1. Use this command to see the STATUS of your pods:
```bash
kubectl get pods
kubectl describe pod <pod-id>
# An example:
# kubectl logs backend-user-5667798847-knvqz
# Error from server (BadRequest): container "backend-user" in pod "backend-user-5667798847-knvqz" is waiting to start: trying and failing to pull image
```
In case of `ImagePullBackOff` or `ErrImagePull` or `CrashLoopBackOff`, review your deployment.yaml file(s) if they have the right image path. 


2. Look at what's there inside the running container. [Open a Shell to a running container](https://kubernetes.io/docs/tasks/debug-application-cluster/get-shell-running-container/) as:
```bash
kubectl get pods
# Assuming "backend-feed-68d5c9fdd6-dkg8c" is a pod
kubectl exec --stdin --tty backend-feed-68d5c9fdd6-dkg8c -- /bin/bash
# See what values are set for environment variables in the container
printenv | grep POST
# Or, you can try "curl <cluster-IP-of-backend>:8080/api/v0/feed " to check if services are running.
# This is helpful to see is backend is working by opening a bash into the frontend container
```

3. When you are sure that all pods are running successfully, then use developer tools in the browser to see the precise reason for the error. 
  - If your frontend is loading properly, and showing *Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error"....*, it is possibly because the *udagram-frontend/src/environments/environment.ts* file has incorrectly defined the ‘apiHost’ to whom forward the requests. 
  - If your frontend is **not** not loading, and showing *Error: Uncaught (in promise): HttpErrorResponse: {"headers":{"normalizedNames":{},"lazyUpdate":null,"headers":{}},"status":0,"statusText":"Unknown Error", ....* , it is possibly because URL variable is not set correctly. 
  - In the case of *Failed to load resource: net::ERR_CONNECTION_REFUSED* error as well, it is possibly because the URL variable is not set correctly.

## Screenshots
So that we can verify that your project is deployed, please include the screenshots of the following commands with your completed project. 
```bash
# Kubernetes pods are deployed properly
kubectl get pods 
# Kubernetes services are set up properly
kubectl describe services
# You have horizontal scaling set against CPU usage
kubectl describe hpa
```
