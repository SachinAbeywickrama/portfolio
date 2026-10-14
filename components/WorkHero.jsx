"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Reveal from "./Reveal";
import styles from "./WorkHero.module.css";

export default function WorkHero() {
  const frame = useRef(null);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting));
    observer.observe(frame.current);
    const update = () => setPageVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);update();
    return () => { observer.disconnect();document.removeEventListener("visibilitychange", update); };
  }, []);
  return <section className={styles.hero} aria-labelledby="work-page-title">
    <div className={styles.title}><span className="eyebrow">Selected projects / Sachin Abeywickrama</span><h1 id="work-page-title">works.</h1></div>
    <div ref={frame} className={styles.visual} data-paused={paused || !visible || !pageVisible ? "true" : undefined}>
      <svg className={styles.badge} viewBox="0 0 300 300" aria-hidden="true">
        <defs><path id="work-badge-circle" d="M150 150m-112 0a112 112 0 1 1 224 0a112 112 0 1 1-224 0" /></defs>
        <circle className={styles.disc} cx="150" cy="150" r="147" />
        {[137,130,91,78,65].map(radius => <circle key={radius} cx="150" cy="150" r={radius} className={styles.groove} />)}
        <text><textPath href="#work-badge-circle" textLength="700" lengthAdjust="spacing">BUILT BY SACHIN · IDEAS INTO PRACTICE · </textPath></text>
        <path d="m122 139-16 12 16 12m56-24 16 12-16 12m-21-30-14 60" className={styles.code} />
      </svg>
      <Reveal className={styles.portraitEntrance}><div className={styles.portraitMotion}><Image src="/media/sachin-work-selfie-cutout.webp" alt="Sachin in a monochrome portrait, looking toward the camera" fill sizes="(max-width: 760px) 115vw, 45vw" preload /></div></Reveal>
      <button className={styles.motionToggle} type="button" aria-label={paused ? "Resume badge animation" : "Pause badge animation"} onClick={() => setPaused(value => !value)}><span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button>
    </div>
  </section>;
}
