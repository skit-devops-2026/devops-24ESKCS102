import { test } from "node:test";
import assert from "node:assert/strict";

import { createApp } from "../server.js";

function listen(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({ server, base: `http://127.0.0.1:${port}` });
    });
  });
}

test("serves the dashboard at /", async () => {
  const { server, base } = await listen(createApp());
  try {
    const res = await fetch(`${base}/`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/html/);
    const body = await res.text();
    assert.match(body, /ClimaPulse/);
  } finally {
    server.close();
  }
});

test("serves css and js assets with the right content types", async () => {
  const { server, base } = await listen(createApp());
  try {
    const css = await fetch(`${base}/css/style.css`);
    assert.equal(css.status, 200);
    assert.match(css.headers.get("content-type"), /text\/css/);
    const js = await fetch(`${base}/js/app.js`);
    assert.equal(js.status, 200);
    assert.match(js.headers.get("content-type"), /javascript/);
  } finally {
    server.close();
  }
});

test("/metrics returns Prometheus-format metrics", async () => {
  const { server, base } = await listen(createApp());
  try {
    await fetch(`${base}/`);
    await fetch(`${base}/gases.html`);
    const res = await fetch(`${base}/metrics`);
    assert.equal(res.status, 200);
    assert.match(res.headers.get("content-type"), /text\/plain/);
    const body = await res.text();
    assert.ok(body.includes("# HELP climapulse_uptime_seconds"));
    assert.ok(body.includes("# TYPE climapulse_http_requests_total counter"));
    assert.match(body, /climapulse_http_requests_total \d+/);
    assert.match(body, /climapulse_http_requests_by_path\{path="\/metrics"\} \d+/);
    assert.ok(body.includes("climapulse_up 1"));
  } finally {
    server.close();
  }
});

test("unknown paths return 404 with SPA fallback page", async () => {
  const { server, base } = await listen(createApp());
  try {
    const res = await fetch(`${base}/does-not-exist.html`);
    assert.equal(res.status, 404);
    const body = await res.text();
    assert.match(body, /404|Not Found/i);
  } finally {
    server.close();
  }
});