import { test } from "node:test";
import assert from "node:assert/strict";

import {
  createSeededRandom,
  hashString,
  seedFromLocation,
  randBetween,
  randInt,
  pickRandom,
} from "../js/seededRandom.js";

test("createSeededRandom is deterministic for the same seed", () => {
  const a = createSeededRandom(42);
  const b = createSeededRandom(42);
  const seqA = Array.from({ length: 10 }, () => a());
  const seqB = Array.from({ length: 10 }, () => b());
  assert.deepEqual(seqA, seqB);
});

test("createSeededRandom produces values in [0, 1)", () => {
  const rand = createSeededRandom(7);
  for (let i = 0; i < 1000; i++) {
    const v = rand();
    assert.ok(v >= 0 && v < 1, `random value ${v} out of range`);
  }
});

test("different seeds produce different sequences", () => {
  const a = createSeededRandom(1)();
  const b = createSeededRandom(2)();
  assert.notEqual(a, b);
});

test("hashString is stable and case-sensitive", () => {
  assert.equal(typeof hashString("New York"), "number");
  assert.equal(hashString("New York"), hashString("New York"));
  assert.notEqual(hashString("New York"), hashString("new york"));
});

test("seedFromLocation derives a 32-bit unsigned seed", () => {
  const seed = seedFromLocation("New York", "industrial");
  assert.ok(seed >= 0 && seed <= 0xffffffff);
  assert.equal(seed, seedFromLocation("New York", "industrial"));
  assert.notEqual(seed, seedFromLocation("New York", "water"));
});

test("randBetween keeps values within the inclusive range", () => {
  const rand = createSeededRandom(99);
  for (let i = 0; i < 500; i++) {
    const v = randBetween(rand, 4, 32);
    assert.ok(v >= 4 && v <= 32);
  }
});

test("randInt returns an integer within [min, max]", () => {
  const rand = createSeededRandom(123);
  for (let i = 0; i < 500; i++) {
    const v = randInt(rand, 5, 10);
    assert.ok(Number.isInteger(v));
    assert.ok(v >= 5 && v <= 10);
  }
});

test("pickRandom returns an element of the given array", () => {
  const arr = ["a", "b", "c"];
  const rand = createSeededRandom(5);
  for (let i = 0; i < 30; i++) {
    assert.ok(arr.includes(pickRandom(rand, arr)));
  }
});