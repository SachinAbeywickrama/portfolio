"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import styles from "./RouteTransition.module.css";

export default function RouteTransition() {
  const pathname = usePathname();
  const router = useRouter();
  const [phase, setPhase] = useState("idle");
  const phaseRef = useRef("idle");
  const firstRender = useRef(true);
  const timer = useRef(null);

  function updatePhase(nextPhase) {
    phaseRef.current = nextPhase;
    setPhase(nextPhase);
  }

  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    updatePhase("reveal");
    clearTimeout(timer.current);
    timer.current = setTimeout(() => updatePhase("idle"), 620);
    return () => clearTimeout(timer.current);
  }, [pathname]);

  useEffect(() => {
    function followLink(event) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || phaseRef.current !== "idle") return;
      const anchor = event.target.closest("a[href]");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin || url.protocol !== window.location.protocol || url.pathname === window.location.pathname && url.search === window.location.search) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      updatePhase("cover");
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        updatePhase("wait");
        router.push(`${url.pathname}${url.search}${url.hash}`);
      }, 430);
    }
    document.addEventListener("click", followLink);
    return () => { document.removeEventListener("click", followLink);clearTimeout(timer.current); };
  }, [router]);

  return <div className={styles.transition} data-phase={phase} aria-hidden="true">
    <div className={styles.field}><span /><span /><span /><span /><span /><span /></div>
    <div className={styles.signal}><i /><b>SA / signal</b></div>
  </div>;
}
