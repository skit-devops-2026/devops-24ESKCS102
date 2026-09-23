# Kubernetes (Module 7)

| File | Purpose |
| --- | --- |
| `deployment.yaml` | Deployment, 2 replicas, probes, resource limits, references registry image |
| `service.yaml` | ClusterIP Service routing port 80 → 8080 |

## Run a local cluster with `kind`

```bash
# 1. Start a kind cluster
kind create cluster

# 2. Build + tag the image from M5
docker build -t climapulse:latest .
docker tag climapulse:latest ghcr.io/<your-account>/climapulse:latest
docker push ghcr.io/<your-account>/climapulse:latest

# 3. Deploy
kubectl apply -f k8s/

# 4. Verify
kubectl get pods -w          # wait for READY 1/1   <- screenshot this for docs/
kubectl get svc climapulse

# 5. Reach the app
kubectl port-forward svc/climapulse 8080:80
curl http://localhost:8080/metrics
```

For a truly pullable image (so `kubectl` pulls it instead of a local load),
the `deployment.yaml` references the container-registry image and uses
`imagePullPolicy: IfNotPresent` — flip it to `Always` once the image is pushed.

No need to install anything to practise: Play with Kubernetes and
Killercoda give you a real cluster in a browser tab.