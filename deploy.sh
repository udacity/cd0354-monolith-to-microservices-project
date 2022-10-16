kubectl delete deploy backend-feed
kubectl delete deploy backend-user
kubectl delete deploy reverseproxy
kubectl delete deploy frontend

kubectl apply -f backend-feed-deployment.yaml
kubectl apply -f backend-feed-service.yaml

kubectl apply -f backend-user-deployment.yaml
kubectl apply -f backend-user-service.yaml

kubectl apply -f reverseproxy-deployment.yaml
kubectl apply -f reverseproxy-service.yaml

kubectl apply -f frontend-deployment.yaml
kubectl apply -f frontend-service.yaml