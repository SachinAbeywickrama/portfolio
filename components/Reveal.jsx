"use client";

import { useEffect, useRef, useState } from "react";

/** Visible by default: CSS may animate [data-entered], but must not hide pending content. */
export default function Reveal({ children, as: Element = "div", className = "", delay = 0, style, ...props }) {
  const elementRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const enter = () => {
      setEntered(true);
      observer?.disconnect();
    };
    const updatePreference = () => { if (preference.matches) enter(); };
    if (preference.matches || typeof IntersectionObserver === "undefined") {
      enter();
      return;
    }
    observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) enter();
    }, { threshold: 0.08, rootMargin: "0px 0px -16px 0px" });
    if (elementRef.current) observer.observe(elementRef.current);
    preference.addEventListener("change", updatePreference);
    return () => {
      observer.disconnect();
      preference.removeEventListener("change", updatePreference);
    };
  }, []);

  return <Element {...props} ref={elementRef} className={`reveal ${className}`.trim()} data-reveal="" data-entered={entered ? "true" : undefined} style={{ "--reveal-delay": `${Math.max(0, Math.min(Number(delay) || 0, 500))}ms`, ...style }}>{children}</Element>;
}
