# Docs — Deployment evidence

This folder is the home for the evidence the DevOps course asks you to commit.
The milestone scanner checks that this directory contains the deployment
screenshot(s) and, for M7, a `kubectl get pods` screenshot.

## Required screenshots

1. **Deployment screenshot** (M6) — save as `docs/deployment-screenshot.png`
   Show your *live, deployed* ClimaPulse answering an HTTP request (a browser
   tab or `curl` output against the live URL below).

2. **`kubectl get pods` screenshot** (M7, committed under `docs/`) — save as
   `docs/kubectl-get-pods.png`
   Show the `climapulse` pod(s) in `Ready` state from a local `kind`/`k3d`
   cluster.

How to capture the second one:

```bash
kind create cluster
docker build -t climapulse:latest .
docker tag climapulse:latest ghcr.io/<your-account>/climapulse:latest
docker push ghcr.io/<your-account>/climapulse:latest   # then ImagePullPolicy: Always
kubectl apply -f k8s/
kubectl get pods          # <- screenshot this
kubectl port-forward svc/climapulse 8080:80
curl http://localhost:8080/metrics
```

See `../k8s/README.md` and `../README.md` for the full runbook.