import { test } from "node:test";
import assert from "node:assert/strict";

import { getIndustrialData } from "../js/services/industrialService.js";
import { getWaterIndicators, waterStatusColor } from "../js/water/water.js";
import {
  getScorecards,
  getPolicies,
  getAccountability,
} from "../js/services/governmentService.js";
import { getCurrent as getAirQuality } from "../js/services/airQualityService.js";
import { getCurrent as getWeather } from "../js/services/weatherService.js";

test("getIndustrialData returns three zones with computed totals", () => {
  const data = getIndustrialData("Delhi");
  assert.equal(data.zones.length, 3);
  assert.ok(data.totals.facilities > 0);
  assert.ok(data.totals.co2 > 0);
  assert.ok(data.zones.every((z) => z.factories.length === 3));
});

test("getIndustrialData is deterministic per location", () => {
  assert.deepEqual(getIndustrialData("Delhi"), getIndustrialData("Delhi"));
});

test("getWaterIndicators returns ph, do and nitrate", () => {
  const indicators = getWaterIndicators("Mumbai");
  assert.deepEqual(indicators.map((i) => i.key), ["ph", "do", "nitrate"]);
  assert.ok(indicators.every((i) => typeof i.value === "number"));
});

test("waterStatusColor maps statuses to colours", () => {
  assert.equal(waterStatusColor("Optimal"), "#10b981");
  assert.equal(waterStatusColor("Critical"), "#dc2626");
  assert.equal(waterStatusColor("Unknown"), "#64748b");
});

test("governmentService returns scorecards, policies and accountability", async () => {
  const scorecards = await getScorecards();
  assert.ok(scorecards.length >= 5);
  const policies = await getPolicies("Delhi");
  assert.ok(Array.isArray(policies));
  const accountability = await getAccountability();
  assert.ok(Array.isArray(accountability));
});

test("airQualityService and weatherService expose current conditions", async () => {
  const aqi = await getAirQuality("New York");
  assert.ok(typeof aqi.aqi === "number");
  const weather = await getWeather("New York");
  assert.ok(typeof weather.temperature === "number");
  assert.ok(typeof weather.condition === "string");
});