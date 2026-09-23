import { test } from "node:test";
import assert from "node:assert/strict";

import { search, geocode, getSuggestions } from "../js/services/geocodeService.js";

test("search returns suggestions for a partial query", () => {
  const results = search("new");
  assert.ok(results.length > 0);
  const names = results.map((r) => r.name.toLowerCase());
  assert.ok(names.some((n) => n.includes("new york")));
});

test("search is empty for a blank query", () => {
  assert.deepEqual(search(""), []);
  assert.deepEqual(search("   "), []);
});

test("geocode resolves known locations to fixed coordinates", () => {
  const nyc = geocode("New York");
  assert.equal(nyc.name, "New York");
  assert.equal(nyc.isKnown, true);
  assert.equal(nyc.lat, 40.7128);
  assert.equal(nyc.lon, -74.006);
});

test("geocode maps unaccented spelling to known locations", () => {
  const sp = geocode("sao paulo");
  assert.equal(sp.isKnown, true);
  assert.equal(sp.name, "Sao Paulo");
});

test("geocode is deterministic for unknown locations", () => {
  const a = geocode("Atlantis");
  const b = geocode("Atlantis");
  assert.deepEqual(a, b);
  assert.equal(a.isKnown, false);
  assert.ok(a.lat >= -55 && a.lat <= 60);
});

test("getSuggestions returns the known location list", () => {
  const suggestions = getSuggestions();
  assert.ok(Array.isArray(suggestions));
  assert.ok(suggestions.length >= 5);
});