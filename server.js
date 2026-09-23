/**
 * ClimaPulse — Minimal static file server.
 *
 * Serves the built (static) frontend and exposes a Prometheus-format
 * `/metrics` endpoint so the app can be monitored after deployment.
 */

import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".map": "application/json",
  ".woff2": "font/woff2",
};

let startedAt = Date.now();
let totalRequests = 0;
const requestsByPath = new Map();

function contentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function resolveFilePath(pathname) {
  if (pathname === "/") return path.join(ROOT, "index.html");
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    return null;
  }
  const candidate = path.resolve(ROOT, "." + decoded.replace(/\\/g, "/"));
  const root = path.resolve(ROOT);
  if (candidate !== root && !candidate.startsWith(root + path.sep)) {
    return null;
  }
  return candidate;
}

function renderMetrics() {
  const uptime = Math.round((Date.now() - startedAt) / 1000);
  const byPath = [...requestsByPath.entries()]
    .map(([p, n]) => `climapulse_http_requests_by_path{path="${p.replace(/"/g, '\\"')}"} ${n}`)
    .join("\n");
  return [
    "# HELP climapulse_up Whether the ClimaPulse service is up.",
    "# TYPE climapulse_up gauge",
    "climapulse_up 1",
    "# HELP climapulse_uptime_seconds Application uptime in seconds.",
    "# TYPE climapulse_uptime_seconds counter",
    `climapulse_uptime_seconds ${uptime}`,
    "# HELP climapulse_http_requests_total Total number of HTTP requests served.",
    "# TYPE climapulse_http_requests_total counter",
    `climapulse_http_requests_total ${totalRequests}`,
    "# HELP climapulse_http_requests_by_path Number of requests served per path.",
    "# TYPE climapulse_http_requests_by_path counter",
    byPath,
    "",
  ].join("\n");
}

export function createApp() {
  return http.createServer(async (req, res) => {
    totalRequests += 1;

    let pathname = "/";
    try {
      pathname = new URL(req.url, "http://localhost").pathname;
    } catch {
      // keep default
    }
    requestsByPath.set(pathname, (requestsByPath.get(pathname) || 0) + 1);

    if (pathname === "/metrics") {
      res.writeHead(200, {
        "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      });
      res.end(renderMetrics());
      return;
    }

    const filePath = resolveFilePath(pathname);
    if (filePath) {
      try {
        const info = await stat(filePath);
        if (info.isFile()) {
          const body = await readFile(filePath);
          res.writeHead(200, { "Content-Type": contentType(filePath) });
          res.end(body);
          return;
        }
      } catch {
        // fall through to 404
      }
    }

    let notFound = "404 Not Found";
    try {
      notFound = await readFile(path.join(ROOT, "404.html"), "utf-8");
    } catch {
      // plain text fallback
    }
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    res.end(notFound);
  });
}

export function startServer(port = PORT, host = HOST) {
  const server = createApp();
  server.listen(port, host);
  return server;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = startServer();
  server.on("listening", () => {
    console.log(`ClimaPulse serving ${ROOT} at http://${HOST}:${PORT}`);
  });
}