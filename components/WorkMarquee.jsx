"use client";
import { useState } from "react";
export default function WorkMarquee() {
  const [paused, setPaused] = useState(false);
  return <div className={`work-marquee${paused ? " is-paused" : ""}`}><a href="/work" aria-label="View all projects"><span className="marquee-track" aria-hidden="true">{[0,1].map(copy => <span className="marquee-group" key={copy}>{[0,1,2,3,4,5,6,7].map(item => <span key={item}>view all works <i>/</i></span>)}</span>)}</span></a><button className="marquee-toggle" type="button" onClick={() => setPaused(value => !value)} aria-label={paused ? "Resume moving text" : "Pause moving text"}>{paused ? "Play motion" : "Pause motion"}<span aria-hidden="true">{paused ? "▷" : "Ⅱ"}</span></button></div>;
}
