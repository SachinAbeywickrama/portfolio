"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

export default function DeveloperFeature({ children }) {
  const root = useRef(null);
  const slot = useRef(null);
  const destination = useRef(null);
  const picture = useRef(null);

  useEffect(() => {
    const element = root.current;
    const preference = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    let geometry;
    function draw() {
      frame = 0;
      if (!preference.matches || !geometry) return;
      const top = element.getBoundingClientRect().top;
      const distance = Math.max(1, geometry.start.height);
      const progress = Math.max(0, Math.min(1, (innerHeight * .55 - top) / distance));
      const eased = progress * progress * (3 - 2 * progress);
      const interpolate = key => geometry.start[key] + (geometry.end[key] - geometry.start[key]) * eased;
      Object.assign(picture.current.style, { left:`${interpolate("left")}px`, top:`${interpolate("top")}px`, width:`${interpolate("width")}px`, height:`${interpolate("height")}px` });
    }
    function schedule() { if (!frame) frame = requestAnimationFrame(draw); }
    function measure() {
      if (!preference.matches) {
        delete element.dataset.expanding;
        picture.current.removeAttribute("style");
        geometry = null;
        return;
      }
      element.dataset.expanding = "true";
      const bounds = element.getBoundingClientRect();
      const relative = node => { const r = node.getBoundingClientRect(); return { left:r.left-bounds.left, top:r.top-bounds.top, width:r.width, height:r.height }; };
      geometry = { start:relative(slot.current), end:relative(destination.current) };
      schedule();
    }
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    observer.observe(slot.current);
    preference.addEventListener("change", measure);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", schedule, { passive:true });
    measure();
    return () => { cancelAnimationFrame(frame);observer.disconnect();preference.removeEventListener("change", measure);window.removeEventListener("resize", measure);window.removeEventListener("scroll", schedule); };
  }, []);

  return <div ref={root} className="developer-feature">
    <div className="intro-grid">{children}<div ref={slot} className="intro-art">
      <figure ref={picture} className="developer-image"><Image src="/media/sachin-cinematic.webp" alt="A cinematic portrait of Sachin in warm afternoon light" fill sizes="(max-width: 760px) 100vw, 84vw" preload unoptimized /></figure>
    </div></div>
    <div ref={destination} className="developer-expansion-space" aria-hidden="true" />
  </div>;
}
