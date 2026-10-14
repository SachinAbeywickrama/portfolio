"use client";
import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const timer = useRef(null);
  useEffect(() => () => { clearTimeout(timer.current); delete document.documentElement.dataset.themeTransition; }, []);
  useEffect(() => { setTheme(document.documentElement.dataset.theme || "dark"); }, []);
  useEffect(() => { document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#141613" : "#f0f0e8"); }, [theme]);

  function applyTheme(next) {
    flushSync(() => {
      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
      setTheme(next);
    });
    try { localStorage.setItem("portfolio-theme-obsidian-v1", next); } catch {}
  }

  function toggle(event) {
    const next = theme === "dark" ? "light" : "dark";
    clearTimeout(timer.current);
    delete document.documentElement.dataset.themeTransition;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const supportsReveal = typeof document.startViewTransition === "function" && !reducedMotion;

    if (supportsReveal) {
      const bounds = event.currentTarget.getBoundingClientRect();
      const x = bounds.left + bounds.width / 2;
      const y = bounds.top + bounds.height / 2;
      const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const root = document.documentElement;
      root.style.setProperty("--theme-x", `${x}px`);
      root.style.setProperty("--theme-y", `${y}px`);
      root.style.setProperty("--theme-radius", `${radius}px`);
      document.startViewTransition(() => applyTheme(next));
      return;
    }

    document.documentElement.dataset.themeTransition = "true";
    applyTheme(next);
    timer.current = setTimeout(() => { delete document.documentElement.dataset.themeTransition; }, 600);
  }

  return <button className="theme-toggle" type="button" onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} aria-pressed={theme === "light"}><span className={`theme-label is-${theme}`} aria-hidden="true"><span>dark</span><span>light</span></span><span className={`theme-square${theme === "dark" ? " is-dark" : ""}`} aria-hidden="true" /><span className="sr-only">Current theme: {theme}</span></button>;
}
