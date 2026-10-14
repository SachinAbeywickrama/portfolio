"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createConcurrencyTrace } from "../lib/concurrency.mjs";
import styles from "./ExperimentLab.module.css";

const statusLabels = { ready: "Ready", locked: "Lock acquired", reading: "Value read", written: "Value written", waiting: "Waiting", done: "Complete" };

function Worker({ name, worker, active, ownsLock, mode }) {
  return <div className={`${styles.worker} ${active ? styles.activeWorker : ""}`}>
    <div className={styles.workerTop}><span className={styles.workerId}>{name}</span><span className={styles.workerState}>{statusLabels[worker.status]}</span></div>
    <h4>Worker {name}</h4>
    <p className={styles.task}>shared + 1</p>
    <div className={styles.local}><span>Local copy</span><strong>{worker.local ?? "—"}</strong></div>
    <span className={styles.lockState}>{mode === "safe" ? (ownsLock ? "◆ Owns the lock" : worker.status === "waiting" ? "◇ Waiting for lock" : "◇ Lock protected") : "↳ Unprotected access"}</span>
  </div>;
}

export default function ExperimentLab() {
  const [mode, setMode] = useState("unsafe");
  const [position, setPosition] = useState(0);
  const [running, setRunning] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const runningRef = useRef(false);
  const timerRef = useRef(null);
  const runButtonRef = useRef(null);
  const trace = useMemo(() => createConcurrencyTrace(mode), [mode]);
  const frame = trace.frames[position];
  const last = trace.frames.length - 1;

  function stop() {
    runningRef.current = false;
    window.clearTimeout(timerRef.current);
    setRunning(false);
  }

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) {
        runningRef.current = false;
        window.clearTimeout(timerRef.current);
        setRunning(false);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      window.clearTimeout(timerRef.current);
      runningRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    if (position >= last) {
      runningRef.current = false;
      setRunning(false);
      return;
    }
    timerRef.current = window.setTimeout(() => {
      if (runningRef.current) setPosition(current => Math.min(current + 1, last));
    }, 850);
    return () => window.clearTimeout(timerRef.current);
  }, [position, running, last]);

  function reset(nextMode = mode) {
    stop();
    setMode(nextMode);
    setPosition(0);
  }

  function run() {
    if (runningRef.current) { stop(); return; }
    if (reducedMotion) { setPosition(last); return; }
    if (position === last) setPosition(0);
    runningRef.current = true;
    setRunning(true);
  }

  function step() {
    stop();
    setPosition(current => current === last ? 0 : current + 1);
  }

  return <section id="lab" className={styles.lab} aria-labelledby="lab-title">
    <div className={styles.heading}>
      <div><p className={styles.eyebrow}><span>01 / The proving ground</span><span className={styles.liveTag}>Interactive</span></p><h1 id="lab-title">Two workers.<br />One <em>shared value.</em></h1></div>
      <p className={styles.introduction}>Two tasks add one to the same number. Simple enough—until they overlap. Run it, break it, then try the better design.</p>
    </div>

    <div className={styles.console}>
      <div className={styles.toolbar}>
        <div className={styles.modeGroup} role="group" aria-label="Choose the concurrency design">
          <button type="button" aria-pressed={mode === "unsafe"} onClick={() => reset("unsafe")}>First attempt</button>
          <button type="button" aria-pressed={mode === "safe"} onClick={() => reset("safe")}>Improved design <span aria-hidden="true">↗</span></button>
        </div>
        <span className={styles.experimentLabel}>EXPERIMENT 001 <span aria-hidden="true">/</span> LOST UPDATE</span>
      </div>

      <div className={styles.diagram} role="group" aria-label="Two workers and the shared counter">
        <Worker name="A" worker={frame.workers.A} active={frame.actor === "A"} ownsLock={frame.owner === "A"} mode={mode} />
        <div className={`${styles.shared} ${frame.complete ? styles.finished : ""}`}>
          <span className={styles.sharedLabel}>Shared counter</span>
          <div className={styles.counter}>{String(frame.value).padStart(2, "0")}</div>
          <p className={styles.expected}>Expected <strong>02</strong></p>
          <span className={styles.result}>{frame.complete ? (mode === "unsafe" ? "One update lost" : "Both updates preserved") : (frame.owner ? `Lock held by ${frame.owner}` : mode === "safe" ? "Mutex enabled" : "No synchronization")}</span>
        </div>
        <Worker name="B" worker={frame.workers.B} active={frame.actor === "B"} ownsLock={frame.owner === "B"} mode={mode} />
      </div>

      <div className={styles.readout}>
        <div className={styles.progressRow}><span className={styles.stepCount}>STEP {String(position).padStart(2, "0")} <span>/ {String(last).padStart(2, "0")}</span></span><div className={styles.progress} role="progressbar" aria-label="Simulation progress" aria-valuemin={0} aria-valuemax={last} aria-valuenow={position}>{trace.frames.slice(1).map((event, index) => <span key={event.index} className={index < position ? styles.progressComplete : ""} />)}</div></div>
        <div className={styles.explanation} aria-live="polite" aria-atomic="true"><h3>{frame.title}</h3><p>{frame.explanation}</p></div>
        {frame.complete && mode === "unsafe" && <button type="button" className={styles.compare} onClick={() => { reset("safe"); runButtonRef.current?.focus(); }}>Now try the improved design <span aria-hidden="true">↗</span></button>}
        <div className={styles.bottomRow}>
          <div className={styles.controls}>
            <button ref={runButtonRef} className={styles.run} type="button" onClick={run}><span aria-hidden="true">{running ? "Ⅱ" : "↗"}</span>{running ? "Pause" : frame.complete ? "Run again" : "Run experiment"}</button>
            <button type="button" onClick={step} disabled={running}>Step <span aria-hidden="true">→</span></button>
            <button type="button" onClick={() => reset()} aria-label="Reset experiment">Reset <span aria-hidden="true">↺</span></button>
          </div>
          <p className={styles.simulationNote}>Browser simulation<br /><span>Two workers · deterministic scheduling</span></p>
        </div>
        {reducedMotion && <p className={styles.motionNote}>Reduced motion is on. Run shows the result immediately; Step explores each operation.</p>}
      </div>

      <details className={styles.underneath}>
        <summary>What changes under the hood?<span aria-hidden="true">+</span></summary>
        <div className={styles.underneathContent}><p>An increment contains a read and a write. Without a lock, both workers can read the same old value. A mutex makes the whole operation exclusive, so the second worker reads the first worker’s result.</p><pre aria-label="Conceptual increment algorithm"><code>{mode === "safe" ? "acquire(lock)\n  local = shared\n  shared = local + 1\nrelease(lock)" : "local = shared\n// Another worker may read here.\nshared = local + 1"}</code></pre><p className={styles.conceptNote}>Conceptual algorithm. This fixed browser simulation illustrates interleaving; it does not execute Java threads.</p><a href="/work/engineering-experiments">Explore the engineering experiments <span aria-hidden="true">↗</span></a></div>
      </details>
    </div>
    <p className={styles.footnote}><span aria-hidden="true">↳</span> The difference is a small design decision. The result is a system you can trust.</p>
  </section>;
}
