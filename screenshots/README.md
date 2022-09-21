# Screenshots
To help review your infrastructure, please include the following screenshots in this directory::

## Deployment Pipeline
* DockerHub showing containers that you have pushed
* GitHub repository’s settings showing your Travis webhook (can be found in Settings - Webhook)
* Travis CI showing a successful build and deploy job

## Kubernetes
* To verify Kubernetes pods are deployed properly
```bash
kubectl get pods
```
* To verify Kubernetes services are properly set up
```bash
kubectl describe services
```
* To verify that you have horizontal scaling set against CPU usage
```bash
kubectl describe hpa
```
* To verify that you have set up logging with a backend application
```bash
kubectl logs {pod_name}
```


## udagram front-end url 

`http://a8dddeb05b0ea45eba85a107124b11c7-778549903.us-east-1.elb.amazonaws.com`


## udagram back-end url 

`a3861bcefec6046cb9a6769af72dcf9e-1850535507.us-east-1.elb.amazonaws.com:8080`
