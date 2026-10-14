import test from "node:test";
import assert from "node:assert/strict";
import { createConcurrencyTrace } from "../lib/concurrency.mjs";

test("unprotected reads reproduce a lost update, including nonzero initial values", () => {
  for (const initial of [-3, 0, 17]) {
    const trace = createConcurrencyTrace("unsafe", initial);
    assert.deepEqual(trace.frames.slice(1).map(frame => `${frame.actor}:${frame.operation}`),
      ["A:read", "B:read", "A:write", "B:write"]);
    assert.equal(trace.frames.at(-1).value, initial + 1);
    assert.equal(trace.expected, initial + 2);
    assert.equal(trace.frames.at(-1).complete, true);
  }
});

test("the mutex preserves both increments and every protected access has ownership", () => {
  for (const initial of [-3, 0, 17]) {
    const trace = createConcurrencyTrace("safe", initial);
    const events = trace.frames.slice(1);
    assert.ok(events.some(frame => frame.operation === "wait" && frame.actor === "B"));
    for (const frame of events) {
      if (["read", "write"].includes(frame.operation)) assert.equal(frame.owner, frame.actor);
      if (frame.operation === "wait") {
        assert.notEqual(frame.owner, frame.actor);
        assert.equal(frame.workers[frame.actor].local, null);
      }
    }
    assert.equal(trace.frames.at(-1).value, trace.expected);
    assert.equal(trace.frames.at(-1).owner, null);
    assert.equal(trace.frames.at(-1).complete, true);
    assert.equal(trace.frames.at(-1).workers.A.status, "done");
    assert.equal(trace.frames.at(-1).workers.B.status, "done");
  }
});

test("reads and writes use real state, and historical snapshots do not mutate", () => {
  for (const mode of ["unsafe", "safe"]) {
    const { frames } = createConcurrencyTrace(mode, 10);
    assert.equal(frames[0].value, 10);
    assert.equal(frames[0].workers.A.local, null);
    for (let index = 1; index < frames.length; index += 1) {
      const frame = frames[index];
      const previous = frames[index - 1];
      if (frame.operation === "read") assert.equal(frame.workers[frame.actor].local, previous.value);
      if (frame.operation === "write") assert.equal(frame.value, previous.workers[frame.actor].local + 1);
      else assert.equal(frame.value, previous.value);
      assert.notEqual(frame.workers.A, previous.workers.A);
      assert.equal(frame.complete, index === frames.length - 1);
    }
  }
});

test("invalid modes and unsafe numeric values are rejected", () => {
  assert.throws(() => createConcurrencyTrace("unknown"), TypeError);
  assert.throws(() => createConcurrencyTrace("safe", Number.MAX_SAFE_INTEGER), TypeError);
  assert.throws(() => createConcurrencyTrace("safe", NaN), TypeError);
});
