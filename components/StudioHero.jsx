import Image from "next/image";
import MotionVideo from "./MotionVideo";

export default function StudioHero() {
  return <section className="studio-hero" id="home" aria-labelledby="intro-title">
    <figure className="hero-portrait">
      <Image src="/media/sachin-motorbike-hero.jpg" alt="Sachin beside his motorbike outdoors" fill sizes="(max-width: 760px) 100vw, 34vw" quality={90} preload />
      <figcaption className="hero-photo-note">Colombo, Sri Lanka <span aria-hidden="true">↗</span></figcaption>
    </figure>
    <div className="hero-identity">
      <h1 className="hero-wordmark" id="intro-title" aria-label="Sachin Abeywickrama">{"sachin.".split("").map((letter,index) => <span aria-hidden="true" key={index} style={{ "--letter-index": index }}>{letter}</span>)}</h1>
      <span className="hero-mobile-eyebrow">Hi, I’m Sachin</span>
      <p className="hero-mobile-copy">Software engineer building useful experiences across web, ML &amp; IoT.</p>
      <div className="hero-roles"><ul aria-label="Areas of work"><li>Software Engineer</li><li>Full-stack Developer</li><li>ML & IoT Explorer</li></ul></div>
      <div className="hero-mobile-actions"><a href="#work">View work <span aria-hidden="true">↗</span></a><a href="#hero-film">View film <span aria-hidden="true">↓</span></a></div>
      <a className="hero-scroll" href="#about" aria-label="Explore the portfolio"><svg viewBox="0 0 100 100" fill="none" aria-hidden="true"><path d="M50 5 90 28v44L50 95 10 72V28Z M10 28l40 23 40-23 M50 51v44 M30 17l40 23v44 M30 40l40-23 M30 40v44" stroke="currentColor" strokeWidth="1" /><path d="M50 33v36m-8-8 8 8 8-8" stroke="currentColor" strokeWidth="2" /></svg></a>
    </div>
    <div className="hero-film" id="hero-film"><span className="hero-film-note">Field note / Sri Lankan coast</span><MotionVideo /></div>
  </section>;
}
