import { test } from "node:test";
import assert from "node:assert/strict";

import {
  formatNumber,
  formatTemp,
  formatPercent,
  degreesToDirection,
  debounce,
  escapeHtml,
} from "../js/utils.js";

test("formatNumber adds thousands separators with fixed decimals", () => {
  assert.equal(formatNumber(1234567, 0), "1,234,567");
  assert.equal(formatNumber(1234.567, 2), "1,234.57");
  assert.equal(formatNumber(0, 0), "0");
});

test("formatTemp rounds and appends degree symbol", () => {
  assert.equal(formatTemp(21.6), "22°");
  assert.equal(formatTemp(-3.2), "-3°");
});

test("formatPercent rounds to an integer percentage", () => {
  assert.equal(formatPercent(45.5), "46%");
  assert.equal(formatPercent(0), "0%");
});

test("degreesToDirection maps compass degrees to labels", () => {
  assert.equal(degreesToDirection(0), "N");
  assert.equal(degreesToDirection(45), "NE");
  assert.equal(degreesToDirection(90), "E");
  assert.equal(degreesToDirection(180), "S");
  assert.equal(degreesToDirection(270), "W");
  assert.equal(degreesToDirection(360), "N");
});

test("debounce only invokes after the wait window", async () => {
  let calls = 0;
  const fn = debounce(() => calls++, 15);
  fn();
  fn();
  fn();
  assert.equal(calls, 0);
  await new Promise((r) => setTimeout(r, 40));
  assert.equal(calls, 1);
});

test("escapeHtml neutralises script injection", () => {
  const elStub = {
    _text: "",
    set textContent(value) {
      this._text = value;
    },
    get innerHTML() {
      const map = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };
      return String(this._text).replace(/[&<>"']/g, (c) => map[c]);
    },
  };
  globalThis.document = { createElement: () => elStub };
  assert.equal(escapeHtml("<script>alert(1)</script>"), "&lt;script&gt;alert(1)&lt;/script&gt;");
  assert.equal(escapeHtml(""), "");
  assert.equal(escapeHtml(null), "");
});