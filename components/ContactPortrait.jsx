"use client";

import Image from "next/image";
import { useRef } from "react";
import styles from "./ContactPortrait.module.css";

export default function ContactPortrait() {
  const frameRef = useRef(null);

  function moveLight(event) {
    const frame = frameRef.current;
    if (!frame) return;
    const bounds = frame.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;
    frame.style.setProperty("--light-x", `${x}%`);
    frame.style.setProperty("--light-y", `${y}%`);
    frame.style.setProperty("--shift-x", `${(x - 50) * -.025}px`);
    frame.style.setProperty("--shift-y", `${(y - 50) * -.025}px`);
  }

  function resetLight() {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--light-x", "43%");
    frame.style.setProperty("--light-y", "42%");
    frame.style.setProperty("--shift-x", "0px");
    frame.style.setProperty("--shift-y", "0px");
  }

  return <figure ref={frameRef} className={styles.frame} onPointerMove={moveLight} onPointerLeave={resetLight}>
    <Image className={styles.base} src="/media/sachin-contact-portrait.jpg" alt="Black-and-white portrait of Sachin Abeywickrama wearing round sunglasses" fill sizes="(max-width: 760px) 100vw, 34vw" priority />
    <div className={styles.reveal} aria-hidden="true"><Image src="/media/sachin-contact-portrait.jpg" alt="" fill sizes="(max-width: 760px) 100vw, 34vw" /></div>
    <div className={styles.signal} aria-hidden="true"><span /><span /><span /></div>
    <figcaption><span>Open channel</span><span>LK / 06.9271° N</span></figcaption>
  </figure>;
}
