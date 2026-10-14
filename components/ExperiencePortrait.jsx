"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./ExperiencePortrait.module.css";

export default function ExperiencePortrait() {
  const frame = useRef(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

  useEffect(() => {
    const node = frame.current;
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: .15 });
    observer.observe(node);
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect();document.removeEventListener("visibilitychange", update); };
  }, []);

  function trackPointer(event) {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - .5;
    const y = (event.clientY - bounds.top) / bounds.height - .5;
    event.currentTarget.style.setProperty("--move-x", `${x * -14}px`);
    event.currentTarget.style.setProperty("--move-y", `${y * -10}px`);
  }

  function resetPointer(event) {
    event.currentTarget.style.setProperty("--move-x", "0px");
    event.currentTarget.style.setProperty("--move-y", "0px");
  }

  const animationPaused = paused || !visible || !pageVisible;
  return <div ref={frame} className={styles.frame} data-paused={animationPaused ? "true" : undefined} onPointerMove={trackPointer} onPointerLeave={resetPointer}>
    <div className={styles.portrait}>
      <Image src="/media/sachin-about-portrait.jpg" alt="Sachin in a sunlit outdoor portrait" fill sizes="(max-width: 760px) calc(100vw - 24px), 40vw" />
      <div className={styles.accent} aria-hidden="true"><Image src="/media/sachin-about-portrait.jpg" alt="" fill sizes="(max-width: 760px) calc(100vw - 24px), 40vw" /></div>
    </div>
    <div className={styles.grid} aria-hidden="true" />
    <div className={styles.focus} aria-hidden="true"><i /><i /><i /><i /></div>
    <div className={styles.scanLine} aria-hidden="true"><span>Analysing craft / 01</span></div>
    <p className={styles.readout}><span>Build</span><span>Test</span><span>Learn</span></p>
    <button type="button" className={styles.control} onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume portrait scan animation" : "Pause portrait scan animation"}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span><span>{paused ? "Scan" : "Hold"}</span></button>
  </div>;
}
