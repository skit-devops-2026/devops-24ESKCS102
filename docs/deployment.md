# Deployment guide

ClimaPulse is a static frontend served by a tiny Node server. It can be
deployed anywhere plain HTTP works. The status badges and "Live URL" in the
root `README.md` are filled in once the app is live.

## Option A — GitHub Pages (fastest, no cost)

1. In **repo Settings → Pages → Build and deployment**, set **Source** to
   **GitHub Actions**.
2. Run the **Deploy to GitHub Pages** workflow (`.github/workflows/deploy.yml`)
   from the Actions tab.
3. The site is published at:
   `https://skit-devops-2026.github.io/Devops_24ESKCS102/`
4. Put that URL in the **Live URL** section of `README.md`.

## Option B — Render / Railway / Fly.io

- Keep the `Dockerfile` as the build job (it is a valid `npm ci` + `npm start`
  container).
- Render "Static Site"? No — deploy as a **Web Service** using the Dockerfile.
- Render exposes port 80 externally; tell it the app listens on `8080`
  (Env `PORT=8080`) or set `PORT=8080` in the service.
- Paste the resulting `https://climapulse.onrender.com`-style URL into the
  **Live URL** section of `README.md`.

## Monitor the running app

`/metrics` is served by `server.js` in Prometheus exposition format. Point the
deployed copy at Prometheus and open the Grafana dashboard in `monitoring/`:

```bash
docker compose up -d
open http://localhost:3000   # Grafana, admin / admin
open http://localhost:9090   # Prometheus
```

## Minimal runbook

```bash
npm ci
npm test
npm start            # serves on http://localhost:8080 (override with PORT=8081 if Jenkins holds 8080)
curl http://localhost:8081/metrics
```

> On machines where Jenkins already listens on `:8080`, run
> `PORT=8081 npm start` and hit `http://localhost:8081`.