# Monitoring (Module 6)

The app serves Prometheus metrics at `/metrics`:

```
climapulse_up
climapulse_uptime_seconds
climapulse_http_requests_total
climapulse_http_requests_by_path{path="/..."}
```

## What is in here

| File | Purpose |
| --- | --- |
| `prometheus.yml` | Prometheus scrape config (targets `web:8080` inside compose) |
| `dashboard.json` | Grafana dashboard (service up, request rate, uptime, requests per path) |
| `grafana-datasources.yaml` | Provions Prometheus as a Grafana datasource |
| `grafana-dashboards.yaml` | Auto-provisions the dashboard |

## Run the full stack

```bash
docker compose up -d
```

- App:  http://localhost:8081
- Metrics: http://localhost:8081/metrics
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000 (admin / admin)

Then open the **ClimaPulse** dashboard and confirm the `climapulse_up` panel
reads 1 — that is the health check that proves the app is alive after it ships.

## Cloud deployment

Replace `static_configs[0].targets` in `prometheus.yml` with your live host and
repoint the Grafana datasource URL accordingly.