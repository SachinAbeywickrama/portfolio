"use client";

import { useEffect, useRef, useState } from "react";
import ThemeToggle from "./ThemeToggle";
import styles from "./Header.module.css";

const links = [["/about", "about"], ["/work", "works"], ["/contact", "contact"]];
const places = [
  { city:"Colombo", timeZone:"Asia/Colombo", zone:"GMT+5:30", local:true },
  { city:"London", timeZone:"Europe/London", zone:"GMT / BST" },
  { city:"New York", timeZone:"America/New_York", zone:"EST / EDT" },
  { city:"Tokyo", timeZone:"Asia/Tokyo", zone:"JST" },
  { city:"Sydney", timeZone:"Australia/Sydney", zone:"AEST / AEDT" }
];
const clocks = places.map(place => ({ ...place, format: new Intl.DateTimeFormat("en-GB", { timeZone:place.timeZone, hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }) }));

export default function Header() {
  const [open, setOpen] = useState(false);
  const [present, setPresent] = useState(false);

  useEffect(() => {
    if (open) { setPresent(true); return; }
    const timer = setTimeout(() => setPresent(false), 350);
    return () => clearTimeout(timer);
  }, [open]);
  const [now, setNow] = useState(null);
  const [paused, setPaused] = useState(false);
  const [activeCity, setActiveCity] = useState("Colombo");
  const toggleRef = useRef(null);
  const drawerRef = useRef(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => { if (!document.hidden) setNow(new Date()); }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    const mains = [...document.querySelectorAll("main")];
    const oldInert = mains.map(main => main.inert);
    mains.forEach(main => { main.inert = true; });
    document.body.style.overflow = "hidden";
    function onKey(event) {
      if (event.key === "Escape") { setOpen(false); toggleRef.current?.focus(); }
      if (event.key !== "Tab") return;
      const controls = [toggleRef.current, ...drawerRef.current.querySelectorAll("a,button")].filter(Boolean);
      const index = controls.indexOf(document.activeElement);
      if (event.shiftKey && index <= 0) { event.preventDefault(); controls.at(-1)?.focus(); }
      else if (!event.shiftKey && (index === controls.length - 1 || index < 0)) { event.preventDefault(); controls[0]?.focus(); }
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = oldOverflow;
      mains.forEach((main,index) => { main.inert = oldInert[index]; });
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !present) return;
    const frame = requestAnimationFrame(() => drawerRef.current?.querySelector("a")?.focus());
    return () => cancelAnimationFrame(frame);
  }, [open, present]);

  function close() { setOpen(false); toggleRef.current?.focus(); }

  function clockTime(clock) {
    return now ? clock.format.format(now) : "--:--:--";
  }

  function renderClockGroup(copy = false) {
    return <span className={styles.clockGroup} aria-hidden={copy || undefined} inert={copy || undefined} key={copy ? "clock-copy" : "clock-primary"}>{clocks.map(clock => <button className={`${styles.clockItem} ${activeCity === clock.city ? styles.activeClock : ""}`} type="button" key={clock.city} tabIndex={copy ? -1 : undefined} title={`${clock.city} — ${clock.zone}`} onClick={() => setActiveCity(clock.city)}><span className={styles.city}>{clock.city}</span>{clock.local && <span className={styles.localStatus}><i />Local / Available</span>}<time dateTime={now?.toISOString()}>{clockTime(clock)}</time><small>{clock.zone}</small><b aria-hidden="true">/</b></button>)}</span>;
  }

  return <header className={styles.header}>
    <a className={styles.logo} href="/" aria-label="Sachin Abeywickrama, home">sachin.</a>
    <div className={`${styles.clocks} ${paused ? styles.paused : ""}`} aria-label="World clocks and availability">
      <div className={styles.clockViewport}><div className={styles.clockTrack}>{renderClockGroup()}{renderClockGroup(true)}</div></div>
      <button className={styles.clockPause} type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume world clock motion" : "Pause world clock motion"} aria-pressed={paused}>{paused ? "▶" : "Ⅱ"}</button>
    </div>
    <div className={styles.theme}><ThemeToggle /></div>
    <button ref={toggleRef} id="menu-toggle" className={`${styles.toggle} ${open ? styles.open : ""}`} type="button" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(value => !value)}><span /><span /><span /></button>
    {open && <div className={styles.backdrop} onClick={close} aria-hidden="true" />}
    <div ref={drawerRef} id="site-menu" className={`${styles.drawer} ${open ? styles.drawerOpen : styles.drawerClosing}`} hidden={!present} inert={!open || undefined} aria-hidden={!open || undefined} role="dialog" aria-modal={open || undefined} aria-label="Site navigation">
      <nav aria-label="Main navigation">{links.map(([href,label],index) => <a href={href} key={href} onClick={close} style={{ "--menu-index": index }}><span className={styles.index}>0{index + 1}</span><span className={styles.label}><span>{label}</span><span aria-hidden="true">{label}</span></span></a>)}</nav>
      <div className={styles.drawerLinks}><a href="https://github.com/SachinAbeywickrama" target="_blank" rel="noopener">GitHub ↗</a><a href="/lab" onClick={close}>Playground ↗</a><a href="/Sachin-Abeywickrama-CV.pdf" target="_blank" rel="noopener">Résumé ↗</a></div>
    </div>
  </header>;
}
