import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const requiredFiles = [
  "package.json",
  "README.md",
  ".gitignore",
  "Jenkinsfile",
  "Dockerfile",
  "docker-compose.yml",
  ".github/workflows/ci.yml",
  "k8s/deployment.yaml",
  "k8s/service.yaml",
  "monitoring/prometheus.yml",
  "monitoring/dashboard.json",
  "server.js",
];

const htmlPages = [
  "index.html",
  "gases.html",
  "gas-detail.html",
  "soil.html",
  "soil-detail.html",
  "water.html",
  "water-detail.html",
  "government.html",
  "industrial.html",
  "crop-adviser.html",
  "advisor.html",
  "404.html",
];

test("all DevOps milestone artefacts are present", () => {
  for (const file of requiredFiles) {
    assert.ok(fs.existsSync(path.join(ROOT, file)), `missing required file: ${file}`);
  }
});

test("all application pages exist", () => {
  for (const page of htmlPages) {
    assert.ok(fs.existsSync(path.join(ROOT, page)), `missing page: ${page}`);
  }
});

test("page modules referenced by each app page exist", () => {
  for (const page of htmlPages) {
    const html = fs.readFileSync(path.join(ROOT, page), "utf-8");
    const refs = [...html.matchAll(/src="(js\/[^"]+\.js)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      assert.ok(fs.existsSync(path.join(ROOT, ref)), `${page} references missing file: ${ref}`);
    }
  }
});

test("css assets referenced by each page exist", () => {
  for (const page of htmlPages) {
    const html = fs.readFileSync(path.join(ROOT, page), "utf-8");
    const refs = [...html.matchAll(/href="(css\/[^"]+\.css)"/g)].map((m) => m[1]);
    for (const ref of refs) {
      assert.ok(fs.existsSync(path.join(ROOT, ref)), `${page} references missing css: ${ref}`);
    }
  }
});

test("package.json declares a test script", () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, "package.json"), "utf-8"));
  assert.ok(typeof pkg.scripts.test === "string" && pkg.scripts.test.length > 0);
});

test("CI workflow runs the test suite", () => {
  const ci = fs.readFileSync(path.join(ROOT, ".github/workflows/ci.yml"), "utf-8");
  assert.match(ci, /npm (ci|install)/);
  assert.match(ci, /npm test/);
});

test("no build artifacts or secrets are tracked in git", () => {
  const tracked = execSync("git ls-files", { cwd: ROOT, encoding: "utf-8" })
    .split("\n")
    .filter(Boolean);
  for (const file of tracked) {
    assert.ok(!file.startsWith("node_modules/"), `node_modules tracked: ${file}`);
    assert.ok(!file.startsWith("venv/"), `venv tracked: ${file}`);
    assert.ok(!file.startsWith("dist/"), `dist tracked: ${file}`);
    assert.notEqual(file, ".env", ".env must never be committed");
  }
});

test(".gitignore excludes build artifacts before they are created", () => {
  const gitignore = fs.readFileSync(path.join(ROOT, ".gitignore"), "utf-8");
  for (const entry of ["node_modules/", "venv/", "dist/", ".env"]) {
    assert.ok(gitignore.includes(entry), `.gitignore missing entry: ${entry}`);
  }
});

test("README.md is filled in and not a template stub", () => {
  const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf-8");
  assert.ok(readme.trim().length > 1000);
  assert.ok(!/lorem ipsum/i.test(readme));
});

test("k8s manifests are internally consistent, monitoring dashboard is valid JSON", () => {
  const dep = fs.readFileSync(path.join(ROOT, "k8s/deployment.yaml"), "utf-8");
  const svc = fs.readFileSync(path.join(ROOT, "k8s/service.yaml"), "utf-8");
  assert.match(dep, /apiVersion: apps\/v1/);
  assert.match(dep, /kind: Deployment/);
  assert.match(svc, /kind: Service/);
  assert.match(dep, /containerPort: 8080/);
  assert.match(svc, /targetPort: 8080/);
  assert.ok(dep.includes("app: climapulse"));
  assert.ok(svc.includes("app: climapulse"));
  assert.match(dep, /image: ghcr\.io\//);
  assert.match(dep, /path: \/metrics/);
  const dashboard = JSON.parse(
    fs.readFileSync(path.join(ROOT, "monitoring/dashboard.json"), "utf-8")
  );
  assert.equal(dashboard.title, "ClimaPulse");
  assert.ok(dashboard.panels.length >= 2);
});