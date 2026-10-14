"use client";
import { useEffect, useRef, useState } from "react";

export default function MotionVideo() {
  const videoRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [source, setSource] = useState("/media/sachin-film-clean.mp4");
  const optedIn = useRef(false);

  useEffect(() => {
    const connection = navigator.connection;
    const slowConnection = connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);
    setSource(slowConnection ? "/media/sachin-film-clean-lite.mp4" : matchMedia("(max-width: 760px)").matches ? "/media/sachin-film-clean-mobile.mp4" : "/media/sachin-film-clean.mp4");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setEnabled(optedIn.current || (!preference.matches && !navigator.connection?.saveData));
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let inView = true;
    function update() {
      if (enabled && !paused && inView && !document.hidden) video.play().catch(() => setPlaying(false));
      else video.pause();
    }
    const observer = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; update(); }, { threshold: .05 });
    observer.observe(video);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); video.pause(); };
  }, [enabled, paused]);

  function toggle() {
    if (playing) setPaused(true);
    else { optedIn.current = true; setEnabled(true); setPaused(false); videoRef.current?.play().catch(() => setPlaying(false)); }
  }

  return <div className="motion-video">
    <video ref={videoRef} src={enabled ? source : undefined} poster="/media/sachin-film-clean-poster.jpg" muted loop playsInline preload="none" aria-label="Sachin’s portfolio film" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    {!failed && <button className="video-control" type="button" onClick={toggle} aria-label={playing ? "Pause hero video" : "Play hero video"}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? "Pause" : "Play film"}</span></button>}
  </div>;
}
