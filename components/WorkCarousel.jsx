"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./WorkCarousel.module.css";

const number = value => String(value).padStart(2, "0");

export default function WorkCarousel({ items = [] }) {
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState(null);
  const [direction, setDirection] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reduced, setReduced] = useState(true);
  const root = useRef(null);
  const thumbnails = useRef([]);
  const gesture = useRef(null);
  const suppressClick = useRef(false);
  const panelId = useId();
  const titleId = useId();
  const current = Math.min(active, Math.max(0, items.length - 1));
  const project = items[current];

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { setReduced(preference.matches); setPlaying(!preference.matches); };
    update(); preference.addEventListener("change", update);
    const observer = new IntersectionObserver(entries => setVisible(entries[0].isIntersecting), { threshold: .25 });
    if (root.current) observer.observe(root.current);
    const visibility = () => setPageVisible(!document.hidden);
    visibility(); document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", update); document.removeEventListener("visibilitychange", visibility); };
  }, []);

  useEffect(() => {
    if (!playing || !visible || hovered || focused || !pageVisible || reduced || items.length < 2) return;
    const timer = setTimeout(() => {
      setPrevious(current); setDirection(1); setActive((current + 1) % items.length);
    }, 6500);
    return () => clearTimeout(timer);
  }, [playing, visible, hovered, focused, pageVisible, reduced, current, items.length]);

  useEffect(() => {
    if (previous === null) return;
    const timer = setTimeout(() => setPrevious(null), reduced ? 0 : 700);
    return () => clearTimeout(timer);
  }, [previous, current, reduced]);

  function select(index, focusThumbnail = false) {
    const next = Math.max(0, Math.min(index, items.length - 1));
    setPlaying(false);
    if (next !== current) { setPrevious(current); setDirection(next > current ? 1 : -1); setActive(next); }
    if (focusThumbnail) thumbnails.current[next]?.focus({ preventScroll: true });
  }

  function handleKeys(event) {
    const isThumbnail = event.target.hasAttribute("data-project-thumb");
    if (event.target !== event.currentTarget && !isThumbnail) return;
    const destinations = { ArrowLeft: current - 1, ArrowUp: current - 1, ArrowRight: current + 1, ArrowDown: current + 1, Home: 0, End: items.length - 1 };
    if (!(event.key in destinations)) return;
    event.preventDefault(); select(destinations[event.key], isThumbnail);
  }

  function finishSwipe(event) {
    const start = gesture.current;
    gesture.current = null;
    if (!start) return;
    const x = event.clientX - start.x, y = event.clientY - start.y;
    if (Math.abs(x) > 55 && Math.abs(x) > Math.abs(y) * 1.5) {
      suppressClick.current = true;
      select(current + (x < 0 ? 1 : -1));
    }
  }

  if (!project) return null;

  function panel(item, outgoing = false) {
    return <article key={`${outgoing ? "previous" : "current"}-${item.slug}`} className={`${styles.project} ${outgoing ? styles.outgoing : previous !== null ? styles.incoming : ""}`} id={outgoing ? undefined : panelId} aria-labelledby={outgoing ? undefined : titleId} aria-hidden={outgoing || undefined} inert={outgoing || undefined}>
      <div className={styles.information}>
        <div className={styles.topline}><span>{item.type.split(" · ")[0]}</span></div>
        <h3 id={outgoing ? undefined : titleId}>{item.title}</h3>
        <div className={styles.tags}>{item.stack.slice(0,3).map(type => <span key={type}>{type}</span>)}</div>
        <a className={styles.projectLink} href={item.href ?? `/work/${item.slug}`}><span className={styles.linkWindow}><span className={styles.linkLabels}><span>Learn more</span><span aria-hidden="true">Learn more</span></span></span><span className={styles.linkArrow} aria-hidden="true">↗</span></a>
      </div>
      <a className={styles.artwork} href={item.href ?? `/work/${item.slug}`} aria-label={`Explore ${item.title}`}>
        <Image src={item.cover} fill sizes="(max-width: 760px) 140vw, 80vw" alt="" className={styles.artworkImage} />
        <span className={styles.artworkCaption}>{item.coverLabel ?? "Concept artwork"}</span>
      </a>
    </article>;
  }

  return <div ref={root} className={styles.carousel} role="region" aria-label="Selected projects. Use arrow keys or swipe to browse." aria-roledescription="carousel" tabIndex={0} onKeyDown={handleKeys} onPointerEnter={e => { if (e.pointerType === "mouse") setHovered(true); }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) setFocused(false); }}>
    <div className={styles.selector}>
      <div className={styles.thumbnails} role="group" aria-label="Choose a project">
        {items.map((item, index) => <button type="button" key={item.slug ?? item.href} ref={node => { thumbnails.current[index] = node; }} className={styles.thumbnail} data-project-thumb="" aria-label={`Show ${item.title}`} aria-pressed={current === index} aria-controls={panelId} onClick={() => select(index)}>
          <Image src={item.cover} fill sizes="(max-width: 640px) 35vw, 400px" alt="" />
          <span className={styles.thumbnailIndex} aria-hidden="true">{number(index + 1)}</span>
          <span className={styles.thumbnailSelected} aria-hidden="true">↗</span>
        </button>)}
      </div>
      <div className={styles.projectViewport} style={{ "--slide-direction": direction }} onPointerDown={e => { suppressClick.current = false; gesture.current = e.pointerType === "touch" ? { x:e.clientX, y:e.clientY } : null; }} onPointerUp={finishSwipe} onPointerCancel={() => { gesture.current = null; }} onClickCapture={e => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}>
        {previous !== null && items[previous] && panel(items[previous], true)}
        {panel(project)}
      </div>
      <div className={styles.controls}>
        <button type="button" onClick={() => select(current - 1)} disabled={current === 0} aria-label="Previous project" aria-controls={panelId}><span aria-hidden="true">←</span></button>
        {!reduced && items.length > 1 && <button className={styles.playback} type="button" onClick={() => setPlaying(value => !value)} aria-label={playing ? "Pause project slideshow" : "Play project slideshow"}><span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span></button>}
        <button type="button" onClick={() => select(current + 1)} disabled={current === items.length - 1} aria-label="Next project" aria-controls={panelId}><span aria-hidden="true">→</span></button>
      </div>
    </div>
    <aside className={styles.sideVisual} aria-label="Portrait of Sachin">
      <div className={styles.portraitStage}><div className={styles.portraitMotion}>
        <Image src="/media/sachin-standing-cutout.webp" fill sizes="(max-width: 760px) 1px, 70vw" alt="Sachin standing in a black shirt and white sarong" className={styles.sideImage} unoptimized />
      </div></div>
    </aside>
    <p className={styles.srOnly} aria-live={playing ? "off" : "polite"} aria-atomic="true">Project {current + 1} of {items.length}: {project.title}.</p>
  </div>;
}
