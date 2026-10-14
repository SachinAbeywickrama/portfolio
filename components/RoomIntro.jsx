"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./RoomIntro.module.css";

const SESSION_KEY = "sachin-room-intro-v1";
const DURATION = 2200;
let playedInMemory = false;

// A single vanishing room, drawn locally rather than loaded as an image.
const columns = Array.from({ length: 11 }, (_, index) => 360 + index * 72);
const rows = Array.from({ length: 7 }, (_, index) => 260 + index * 80);
const depths = [0.18, 0.4, 0.67];

export default function RoomIntro() {
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const shouldPlayRef = useRef(null);

  const dismiss = useCallback(() => {
    shouldPlayRef.current = false;
    delete document.documentElement.dataset.introActive;
    setVisible(false);
  }, []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Preserve the decision across React's development effect replay.
    if (shouldPlayRef.current === null) {
      let alreadyPlayed = playedInMemory;
      try {
        alreadyPlayed ||= window.sessionStorage.getItem(SESSION_KEY) === "1";
      } catch {
        // An in-memory flag still avoids repeats if storage is unavailable.
      }
      shouldPlayRef.current = !alreadyPlayed && !motion.matches;
      playedInMemory = true;
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // The portfolio and intro remain usable when storage is disabled.
      }
    }

    if (!shouldPlayRef.current || motion.matches) return;

    document.documentElement.dataset.introActive = "true";
    setVisible(true);
    const timeout = window.setTimeout(dismiss, DURATION + 150);
    const onKeyDown = (event) => {
      if (event.key === "Escape") dismiss();
    };
    const onFocus = (event) => {
      if (!overlayRef.current?.contains(event.target)) dismiss();
    };
    const onMotionChange = (event) => {
      if (event.matches) dismiss();
    };
    const onVisibilityChange = () => {
      if (document.hidden) dismiss();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });
    motion.addEventListener("change", onMotionChange);

    return () => {
      delete document.documentElement.dataset.introActive;
      window.clearTimeout(timeout);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
      motion.removeEventListener("change", onMotionChange);
    };
  }, [dismiss]);

  // Server-rendered and no-JavaScript visits show the portfolio immediately.
  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className={styles.intro}
      style={{ "--intro-duration": `${DURATION}ms` }}
      data-room-intro=""
      onAnimationEnd={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className={styles.scene} aria-hidden="true">
        <svg className={styles.room} viewBox="0 0 1440 1000" preserveAspectRatio="none" focusable="false">
          <g className={styles.structure}>
            <path d="M360 260H1080V740H360Z M0 0 360 260 M1440 0 1080 260 M0 1000 360 740 M1440 1000 1080 740" />
            {columns.slice(1, -1).map((x) => (
              <path key={`column-${x}`} d={`M${x} 260V740 M${x} 260 ${720 + (x - 720) * 2} 0 M${x} 740 ${720 + (x - 720) * 2} 1000`} />
            ))}
            {rows.slice(1, -1).map((y) => (
              <path key={`row-${y}`} d={`M0 ${500 + (y - 500) * 2.1} 360 ${y}H1080L1440 ${500 + (y - 500) * 2.1}`} />
            ))}
            {depths.map((depth) => {
              const left = 360 * (1 - depth);
              const right = 1440 - left;
              const top = 260 * (1 - depth);
              const bottom = 1000 - top;
              return <path className={styles.depth} key={depth} d={`M${left} ${top}H${right}V${bottom}H${left}Z`} />;
            })}
          </g>
          <g className={styles.mark}>
            <path d="M846 374 934 324 1022 374V476L934 526 846 476Z M846 374 934 425 1022 374 M934 425V526 M890 349 978 400V501 M890 400 978 349 M890 400V501" />
            <circle cx="934" cy="425" r="5" />
          </g>
          <text className={styles.wordmark} x="414" y="612">sachin.</text>
          <path className={styles.baseline} d="M360 660H1080" />
        </svg>
      </div>
      <span className={styles.caption} aria-hidden="true">Sachin Abeywickrama / Portfolio</span>
      <button className={styles.skip} type="button" onClick={dismiss}>Skip intro <span aria-hidden="true">↗</span></button>
    </div>
  );
}
