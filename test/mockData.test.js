import { test } from "node:test";
import assert from "node:assert/strict";

import {
  KNOWN_LOCATIONS,
  getAqiCategoryInfo,
  POLLUTANTS,
  generateClimateData,
  getHourlyTrends,
  getWeeklyTrends,
  getSoilIntelligence,
  getCountryScorecards,
  getLocalPolicies,
  getIndustrialAccountability,
  degToDir,
  uvLabel,
  severityFromPercent,
} from "../js/services/mockData.js";

test("KNOWN_LOCATIONS covers the documented default cities", () => {
  const names = KNOWN_LOCATIONS.map((l) => l.name.toLowerCase());
  for (const city of ["new york", "london", "mumbai", "delhi"]) {
    assert.ok(names.includes(city), `missing known location: ${city}`);
  }
});

test("getAqiCategoryInfo maps AQI thresholds correctly", () => {
  assert.equal(getAqiCategoryInfo(0).label, "Good");
  assert.equal(getAqiCategoryInfo(50).label, "Good");
  assert.equal(getAqiCategoryInfo(51).label, "Moderate");
  assert.equal(getAqiCategoryInfo(100).label, "Moderate");
  assert.equal(getAqiCategoryInfo(101).label, "Unhealthy for Sensitive Groups");
  assert.equal(getAqiCategoryInfo(300).label, "Very Unhealthy");
  assert.equal(getAqiCategoryInfo(301).label, "Hazardous");
});

test("POLLUTANTS contains the five core pollutants", () => {
  const keys = POLLUTANTS.map((p) => p.key);
  assert.deepEqual(keys, ["co", "no2", "so2", "pm25", "pm10"]);
});

test("generateClimateData is deterministic per location", () => {
  const a = generateClimateData("New York");
  const b = generateClimateData("New York");
  assert.deepEqual(a, b);
});

test("generateClimateData differs across locations", () => {
  const a = JSON.stringify(generateClimateData("Delhi"));
  const b = JSON.stringify(generateClimateData("Iowa"));
  assert.notEqual(a, b);
});

test("generateClimateData returns a valid bundle", () => {
  const data = generateClimateData("Mumbai");
  assert.ok(data.weather && typeof data.weather.temperature === "number");
  assert.ok(data.airQuality && typeof data.airQuality.aqi === "number");
  assert.ok(Number.isInteger(data.airQuality.aqi) && data.airQuality.aqi >= 12);
  assert.ok(data.airQuality.pollutants && data.airQuality.pollutants.length === 5);
  assert.ok(data.snapshot && typeof data.snapshot.anomaly === "string");
});

test("getHourlyTrends returns 24 hourly points", () => {
  const points = getHourlyTrends("New York");
  assert.equal(points.length, 24);
  assert.ok(points.every((p) => typeof p.temperature === "number"));
});

test("getWeeklyTrends returns 7 daily points", () => {
  const points = getWeeklyTrends("New York");
  assert.equal(points.length, 7);
});

test("getSoilIntelligence returns deterministic indicators", () => {
  const soil = getSoilIntelligence("Punjab");
  assert.ok(soil.isAgriRegion);
  const keys = Object.keys(soil.indicators);
  assert.deepEqual(keys, ["moisture", "ph", "carbon"]);
  assert.ok(typeof soil.indicators.moisture.value === "number");
  assert.ok(Array.isArray(soil.module1.sources));
  assert.ok(Array.isArray(soil.module3));
});

test("getCountryScorecards and accountability data are present", () => {
  const scorecards = getCountryScorecards();
  assert.ok(scorecards.length >= 3);
  const names = scorecards.map((s) => s.name);
  assert.ok(names.includes("India"));
  assert.ok(Array.isArray(getIndustrialAccountability()));
});

test("getLocalPolicies returns list for a known location", () => {
  const policies = getLocalPolicies("Delhi");
  assert.ok(Array.isArray(policies));
  assert.ok(policies.length > 0);
});

test("degToDir maps degrees to compass directions", () => {
  assert.equal(degToDir(0), "N");
  assert.equal(degToDir(90), "E");
  assert.equal(degToDir(225), "SW");
});

test("uvLabel buckets UV index levels", () => {
  assert.equal(uvLabel(2), "Low");
  assert.equal(uvLabel(6), "High");
  assert.equal(uvLabel(11), "Extreme");
});

test("severityFromPercent is monotonic", () => {
  assert.equal(severityFromPercent(10).label, "Low");
  assert.equal(severityFromPercent(70).label, "Elevated");
  assert.equal(severityFromPercent(100).label, "Severe");
});