"use client";
import { useEffect, useRef, useState } from "react";

function filmSource(compact, connection) {
  const slowConnection = connection?.saveData || ["slow-2g", "2g", "3g"].includes(connection?.effectiveType);
  return slowConnection ? "/media/sachin-film-clean-lite.mp4" : compact ? "/media/sachin-film-clean-mobile.mp4" : "/media/sachin-film-clean.mp4";
}

export default function MotionVideo() {
  const videoRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [source, setSource] = useState(null);
  const optedIn = useRef(false);
  const playbackState = `${paused}:${source ?? ""}`;

  useEffect(() => {
    const connection = navigator.connection;
    const compact = matchMedia("(max-width: 1023px)");
    const touch = matchMedia("(hover: none) and (pointer: coarse)");
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setSource(filmSource(compact.matches, connection));
      // A still frame costs far less on phones and touch devices; visitors choose when to download the film.
      setEnabled(optedIn.current || (!compact.matches && !touch.matches && !preference.matches && !connection?.saveData));
    };
    update();
    compact.addEventListener("change", update);
    touch.addEventListener("change", update);
    preference.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    return () => {
      compact.removeEventListener("change", update);
      touch.removeEventListener("change", update);
      preference.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
    };
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
  }, [enabled, playbackState]);

  function toggle() {
    if (playing) setPaused(true);
    else {
      optedIn.current = true;
      setSource(filmSource(matchMedia("(max-width: 1023px)").matches, navigator.connection));
      setEnabled(true);
      setPaused(false);
    }
  }

  return <div className="motion-video">
    <video ref={videoRef} src={enabled && source ? source : undefined} poster="/media/sachin-film-clean-poster.jpg" muted loop playsInline preload="none" aria-label="Sachin’s portfolio film" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onError={() => setFailed(true)} />
    {!failed && <button className="video-control" type="button" onClick={toggle} aria-label={playing ? "Pause hero video" : "Play hero video"}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span><span>{playing ? "Pause" : "Play film"}</span></button>}
  </div>;
}
