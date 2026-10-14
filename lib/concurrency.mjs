/**
 * A deterministic interleaving of two increment operations.
 * This is a browser teaching simulation, not a Java execution environment.
 * Every frame is a detached snapshot of an operation performed on shared state.
 */
export function createConcurrencyTrace(mode = "unsafe", initialValue = 0) {
  if (!["unsafe", "safe"].includes(mode)) throw new TypeError("Unknown concurrency mode.");
  if (!Number.isSafeInteger(initialValue) || !Number.isSafeInteger(initialValue + 2)) {
    throw new TypeError("The initial value must allow two safe integer increments.");
  }
  const program = mode === "safe" ? ["acquire", "read", "write", "release"] : ["read", "write"];
  const workers = {
    A: { local: null, status: "ready", cursor: 0 },
    B: { local: null, status: "ready", cursor: 0 },
  };
  let value = initialValue;
  let owner = null;
  const frames = [];
  const capture = (actor, operation, title, explanation) => frames.push({
    index: frames.length, actor, operation, title, explanation, value, owner,
    workers: { A: { ...workers.A }, B: { ...workers.B } },
    complete: Object.values(workers).every(worker => worker.cursor === program.length),
  });
  capture(null, "ready", "One increment each. What could go wrong?",
    `Both workers will add 1 to the shared value. The expected result is ${initialValue + 2}.`);

  // Round-robin scheduling: blocked workers retain their program position.
  while (Object.values(workers).some(worker => worker.cursor < program.length)) {
    for (const actor of ["A", "B"]) {
      const worker = workers[actor];
      if (worker.cursor === program.length) continue;
      const operation = program[worker.cursor];
      if (operation === "acquire" && owner !== null) {
        if (worker.status !== "waiting") {
          worker.status = "waiting";
          capture(actor, "wait", `Worker ${actor} waits for the lock.`,
            `Worker ${owner} owns the lock. ${actor} cannot read or overwrite the shared value yet.`);
        }
        continue;
      }
      let title;
      let explanation;
      if (operation === "acquire") {
        owner = actor;
        worker.status = "locked";
        title = `Worker ${actor} takes the lock.`;
        explanation = "Only the lock owner can enter the read-and-write section.";
      } else if (operation === "read") {
        worker.local = value;
        worker.status = "reading";
        title = `Worker ${actor} reads ${value}.`;
        explanation = `It keeps a local copy of ${value}. ${mode === "safe" ? "The lock protects this value until the write finishes." : "Reading the value does not reserve it."}`;
      } else if (operation === "write") {
        const previous = value;
        value = worker.local + 1;
        worker.status = "written";
        title = `Worker ${actor} writes ${value}.`;
        explanation = previous === value
          ? `Its stale copy was ${worker.local}. Adding 1 writes ${value} again, so one update is lost.`
          : `Local copy ${worker.local} + 1 replaces the shared value ${previous} with ${value}.`;
      } else {
        owner = null;
        worker.status = "done";
        title = `Worker ${actor} releases the lock.`;
        explanation = actor === "A"
          ? "Worker B can now read the updated value and safely make its own increment."
          : "Both increments are preserved. The shared value matches the expected result.";
      }
      worker.cursor += 1;
      if (worker.cursor === program.length) worker.status = "done";
      capture(actor, operation, title, explanation);
    }
  }
  return { mode, initialValue, expected: initialValue + 2, frames };
}
