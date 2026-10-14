"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./WorkFilmStrip.module.css";

export default function WorkFilmStrip() {
  const videoRef = useRef(null);
  const optedIn = useRef(false);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(optedIn.current || (!preference.matches && !navigator.connection?.saveData));
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = false;
    const update = () => {
      if (enabled && !paused && inView && !document.hidden) video.play().catch(() => setPlaying(false));
      else video.pause();
    };
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting;update(); }, { threshold: .12 });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    if (enabled) video.load();
    return () => { observer.disconnect();document.removeEventListener("visibilitychange", update);video.pause(); };
  }, [enabled, paused]);

  function toggle() {
    if (playing) setPaused(true);
    else {
      optedIn.current = true;
      setEnabled(true);
      setPaused(false);
      videoRef.current?.play().catch(() => setPlaying(false));
    }
  }

  return <section className={styles.strip} aria-label="Coastal train film">
    <video ref={videoRef} poster="/media/sachin-coast-train-poster.jpg" muted loop playsInline preload={enabled ? "auto" : "none"} onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)}>
      {enabled && <><source src="/media/sachin-coast-train-mobile.mp4" media="(max-width: 760px)" type="video/mp4" /><source src="/media/sachin-coast-train.mp4" type="video/mp4" /></>}
    </video>
    <div className={styles.tint} aria-hidden="true" />
    <p className={styles.caption}>Field note / Sri Lankan coast</p>
    {!failed && <button type="button" className={styles.control} onClick={toggle} aria-label={playing ? "Pause coastal train film" : "Play coastal train film"}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? "Pause" : "Play"}</span></button>}
  </section>;
}
