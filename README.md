# 🌍 Climate_Pulse

## Hyper-Local Climate Intelligence Platform

ClimaPulse is a complete, production-quality frontend web application for climate, air quality, gas, soil, water, government, and industrial environmental intelligence. It is built with **HTML5, CSS3, Vanilla JavaScript, and Tailwind CSS**, with **Chart.js**, **Lucide-style SVG icons**, and **Marked.js** used only where needed.

> ⚠️ **Phase 1 note:** All data is deterministically simulated for demonstration purposes. The same location always generates consistent mock data via a seeded pseudo-random generator.

---

## ✨ Features

- **Weather Dashboard** — live weather widget, AQI gauge, trend charts (daily/weekly), gas breakdown, climate snapshot, dynamic alert banners, email summary simulation
- **Location System** — browser geolocation with 5s timeout, city/ZIP search with suggestions, fallback to New York, deterministic data per location
- **Gas Intelligence** — pollutant cards + detail pages with Impact Engine, personal & systemic action tabs, policy tracker and subsidies
- **Soil Intelligence** — health indicator cards + localized explorer (pollution risk, regenerative planner, remediation guide, climate resilience)
- **Water Intelligence** — pH / dissolved oxygen / nitrate indicators + detail pages
- **Government Intelligence** — national compliance scorecards, local regulation explorer, industrial accountability
- **Industrial Zones** — summary cards + three zone reports with facility-level emissions and status
- **Climate Advisor** — AI chat with markdown rendering, typing animation, quick suggestions, tool-activity panel
- **Crop Adviser** — AI farming assistant with multi-image upload and FileReader previews
- **Polish** — sticky glass header, responsive/mobile nav, skeletons, error/empty states, toasts, animations, accessibility

---

## 🚀 Getting Started

You can open `index.html` directly, or run the project's own server:

```bash
npm ci
npm start
```

Then visit `http://localhost:8080`. Metrics are exposed at
`http://localhost:8080/metrics` in Prometheus format.

```bash
# Python (alternative)
python -m http.server 5500
```

---

## ☁️ Live URL

> Deployed on **Netlify** (M6). See [`docs/deployment.md`](docs/deployment.md)
> for the GitHub Pages and container options.

```text
https://funny-cucurucho-fb3ff1.netlify.app/
```

Health check every deployed copy with: `curl -i https://funny-cucurucho-fb3ff1.netlify.app/metrics`

---

## ✅ CI / CD

| Asset | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Runs `npm ci`, the test suite (`npm test`) and HTML validation on every push/PR |
| `.github/workflows/deploy.yml` | Publishes the site to GitHub Pages (`workflow_dispatch` or push to `main`) |
| `Jenkinsfile` | Local Jenkins pipeline: install → test → validate HTML → build |
| `test/` | Node `node:test` suite (54 checks) covering RNG, mock data, services, server & repo hygiene |

```bash
npm test          # run the suite locally
npx html-validate "**/*.html"
```

The CI history is the proof: every push to `main` produces a run, and the
latest run is green with the full suite passing.

---

## 🐳 Containerization & Orchestration

| Asset | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage `node:20-alpine` image → serves the static site on `:8080` |
| `docker-compose.yml` | Brings up app + Prometheus + Grafana together |
| `k8s/deployment.yaml` | 2-replica Deployment with probes and resource limits |
| `k8s/service.yaml` | ClusterIP Service (port 80 → 8080) |

```bash
docker build -t climapulse:latest .
docker compose up -d      # app :8080 · prometheus :9090 · grafana :3000
kind create cluster && kubectl apply -f k8s/
```

See [`k8s/README.md`](k8s/README.md) and [`monitoring/README.md`](monitoring/README.md).

---

## 📈 Monitoring

State is exported from the app itself at `/metrics` (uptime, request counts,
per-path rates, health). Prometheus scrapes it (`monitoring/prometheus.yml`)
and the Grafana dashboard (`monitoring/dashboard.json`) is auto-provisioned
with panels for service health, request rate and uptime. Deployment evidence
lives in [`docs/`](docs/).

---

## 📁 Project Structure

```text
ClimaPulse/
├── index.html              Dashboard
├── gases.html              Gas Intelligence
├── gas-detail.html         Gas detail (?gas=co|no2|so2|pm25|pm10|co2)
├── soil.html               Soil Intelligence
├── soil-detail.html        Soil detail (?soil=moisture|ph|carbon)
├── water.html              Water Intelligence
├── water-detail.html       Water detail (?water=ph|do|nitrate)
├── government.html         Government Intelligence
├── industrial.html         Industrial Zones
├── crop-adviser.html       Crop Adviser
├── advisor.html            Climate Advisor
├── 404.html
├── css/
│   ├── style.css           Design system & base
│   ├── components.css      Reusable components
│   ├── animations.css      Keyframes & motion
│   └── responsive.css      Responsive rules
├── js/
│   ├── app.js              Entry point / page module loader
│   ├── router.js           Simple router
│   ├── navigation.js       Header/footer/mobile nav + SVG icons
│   ├── utils.js            Helpers (loading, error, email template)
│   ├── seededRandom.js     Deterministic PRNG
│   ├── toast.js            Toast notifications
│   ├── services/           Mock data + domain services
│   ├── dashboard/          Dashboard components
│   ├── gas/                Gas pages
│   ├── soil/               Soil pages
│   ├── water/              Water pages
│   ├── government/         Government page
│   ├── industrial/         Industrial page
│   └── advisors/           AI chat interfaces
├── test/                   Node test suite (node:test)
├── server.js               Static server + /metrics endpoint
├── Dockerfile              Container image (M5)
├── docker-compose.yml      App + Prometheus + Grafana (M5/M6)
├── monitoring/             Prometheus config + Grafana dashboard (M6)
├── k8s/                    Deployment + Service manifests (M7)
├── docs/                   Deployment evidence & screenshots (M6/M7)
└── README.md
```

---

## 🧠 Deterministic Mock Data

Same location → stable data:

```
Location Name → Hash Function → Numeric Seed → PRNG → Climate Data
```

Seed logic lives in `js/seededRandom.js` and is used by `js/services/mockData.js`.

---

## 🛠 Tech

- HTML5 + CSS3 + Vanilla JavaScript (ES modules)
- Tailwind CSS (CDN)
- Chart.js (CDN)
- Marked.js (CDN, chat markdown)
- Native browser APIs: Geolocation, LocalStorage-ready, FileReader, Fetch

---

## 📜 License

Demonstration project. © 2026 ClimaPulse. Phase 1 data is simulated for demonstration purposes.
