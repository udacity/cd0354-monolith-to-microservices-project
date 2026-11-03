#!/usr/bin/env bash
# Deploys the Udagram microservices to the currently-configured kubectl context.
#
# Designed to be run from inside AWS CloudShell, where it builds a valid
# aws-secret.yaml from the shell's temporary STS credentials automatically.
# Safe to re-run any number of times (idempotent `kubectl apply`).
#
# Usage:
#   cd udagram-deployment
#   ./deploy.sh
#
# Before running, fill in the real values in env-configmap.yaml and
# env-secret.yaml (POSTGRES_HOST/PASSWORD, JWT_SECRET, AWS_BUCKET, etc).
# Do NOT commit real secrets back to git afterwards.

set -euo pipefail

# Always operate relative to this script's own directory so it works no
# matter which directory/tab the user invoked it from.
cd "$(dirname "${BASH_SOURCE[0]}")"

echo "==> Verifying kubectl can reach the cluster..."
if ! kubectl get nodes >/dev/null 2>&1; then
  echo "kubectl cannot reach a cluster. If you're in AWS CloudShell, try:"
  echo "  aws sts get-caller-identity   # confirm credentials are valid"
  echo "  aws eks update-kubeconfig --name <cluster-name> --region <region>"
  exit 1
fi
kubectl get nodes

echo "==> Building aws-secret.yaml from AWS CloudShell's temporary STS credentials (if available)..."
if [ -n "${AWS_CONTAINER_CREDENTIALS_FULL_URI:-}" ]; then
  CREDS=$(curl -s "$AWS_CONTAINER_CREDENTIALS_FULL_URI" -H "Authorization: $AWS_CONTAINER_AUTHORIZATION_TOKEN")
  AKID=$(echo "$CREDS" | jq -r .AccessKeyId)
  SECRET=$(echo "$CREDS" | jq -r .SecretAccessKey)
  TOKEN=$(echo "$CREDS" | jq -r .Token)

  TMP_CREDS=$(mktemp -d)
  cat > "$TMP_CREDS/credentials" <<EOF
[default]
aws_access_key_id = $AKID
aws_secret_access_key = $SECRET
aws_session_token = $TOKEN
EOF

  B64=$(base64 -w0 "$TMP_CREDS/credentials")
  cat > aws-secret.yaml <<EOF
apiVersion: v1
kind: Secret
metadata:
  name: aws-secret
type: Opaque
data:
  credentials: $B64
EOF
  rm -rf "$TMP_CREDS"
  echo "aws-secret.yaml built from CloudShell STS credentials."
else
  echo "Not running in AWS CloudShell (no AWS_CONTAINER_CREDENTIALS_FULL_URI env var)."
  echo "Make sure aws-secret.yaml already has a valid base64-encoded ~/.aws/credentials file"
  echo "before continuing (see the comment at the top of aws-secret.yaml)."
fi

echo "==> Applying all manifests..."
kubectl apply -f .

echo "==> Waiting for rollout..."
sleep 30

echo "==> Status:"
kubectl get pods
kubectl get services
kubectl get hpa

echo ""
echo "Once all pods show Running, find the reverseproxy's external hostname above"
echo "(EXTERNAL-IP column) and test it with:"
echo "  curl http://<external-hostname>:8080/api/v0/feed"
