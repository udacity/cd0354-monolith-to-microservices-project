
# Part 5. Logging  
Use logs to capture metrics.  This can help us with debugging.

### Screenshots
To verify that user activity is logged, please include a screenshot of:

```bash
kubectl logs <your pod name>
```


### Suggestions to Make Your Project Stand Out (Optional)   

Try one or more of these to take your project to the next level.

1. **Reduce Duplicate Code** - When we decomposed our API code into two separate applications, we likely had a lot of duplicate code. Optionally, you could reduce the duplicate code by abstracting them into a common library.


2. **Secure the API** - The API is only meant to be consumed by the frontend web application. Let's set up ingress rules so that only web requests from our web application can make successful API requests.


--- 

# Submission Requirements
The project will be submitted as a link to a GitHub repo or a zip file and should include screenshots to document the application's infrastructure.

### Required Screenshots
* Docker images in your repository in DockerHub
* TravisCI build pipeline showing successful build jobs
* Kubernetes `kubectl get pods` output
* Kubernetes `kubectl describe services` output
* Kubernetes `kubectl describe hpa` output  
* Kubernetes `kubectl logs <your pod name>` output 

## Clean up
Once we are done with our exercises, it helps to remove our AWS resources so that we don't accrue unnecessary charges to our AWS balance.
1. Delete the EKS cluster.
2. Delete the S3 bucket and RDS PostgreSQL database.
