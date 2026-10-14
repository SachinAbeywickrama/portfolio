import Image from "next/image";
import Header from "../../components/Header";
import ContactTeaser from "../../components/ContactTeaser";
import SiteFooter from "../../components/SiteFooter";
import Reveal from "../../components/Reveal";
import ExperiencePortrait from "../../components/ExperiencePortrait";
import styles from "./AboutPage.module.css";

export const metadata = {
  title: "About — Sachin Abeywickrama",
  description: "Meet Sachin, a Colombo-based software engineer working across web, enterprise software, IoT, and machine learning."
};

const toolkit = [
  { number: "01", label: "build", icon: "</>", items: ["Java", "Spring Boot", "Angular", "React", "Next.js", "TypeScript", "JavaScript", "Python", "REST APIs", "MySQL", "Git"] },
  { number: "02", label: "research", icon: "⌁", items: ["Machine Learning", "IoT", "Time-series", "Explainability", "Jupyter", "Data pipelines"] },
  { number: "03", label: "practice", icon: "◎", items: ["System design", "Testing", "Debugging", "Accessibility", "Responsive UI", "Agile collaboration"] }
];

const experience = [
  { date: "2024 — 2025", role: "Software Engineering Intern", place: "SDB Bank", meta: "Colombo · Enterprise engineering" },
  { date: "2025 — 2026", role: "AquaAdapt Researcher", place: "Undergraduate thesis", meta: "IoT · Machine learning · Aquaculture" },
  { date: "2022 — 2026", role: "BEng (Hons) Software Engineering", place: "University of Westminster", meta: "Colombo · Undergraduate degree" }
];

export default function AboutPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main">
      <section className={styles.hero} aria-labelledby="about-title">
        <div className={styles.heroTitle}><span>the</span><h1 id="about-title">developer.</h1></div>
        <Reveal className={styles.heroImage}>
          <Image src="/media/sachin-about-portrait.jpg" alt="Sachin Abeywickrama outdoors, looking to the right" fill sizes="(max-width: 760px) 100vw, 34vw" priority />
          <span>Colombo / Sri Lanka</span>
        </Reveal>
      </section>

      <div className={styles.shell}>
        <section className={styles.story} aria-labelledby="story-title">
          <aside className={styles.storyAside}>
            <div className={styles.storySticky}>
              <Reveal><p className={styles.eyebrow}>Hi, I’m Sachin!</p><h2 id="story-title">This is me.</h2></Reveal>
              <Reveal className={styles.storyFigure}>
                <figure><div className={styles.storyPhoto}><Image src="/media/sachin-about-story.jpg" alt="Sachin relaxing in a hammock beside the Sri Lankan coast" fill sizes="(max-width: 760px) calc(100vw - 24px), 40vw" /></div><figcaption>Sri Lankan coast</figcaption></figure>
              </Reveal>
            </div>
          </aside>

          <div className={styles.narrative}>
            <Reveal><p className={styles.statement}>A software engineer with a <span>product eye.</span></p></Reveal>
            <Reveal className={styles.biography}>
              <p>I’m a software engineer based in Colombo, Sri Lanka. I enjoy turning complicated requirements into products that feel clear, reliable, and useful.</p>
              <p>My path has moved through enterprise engineering, full-stack applications, and research. At SDB Bank, I contributed to internal systems using Spring Boot, Angular, REST APIs, and MySQL. For AquaAdapt, I built a machine-learning pipeline that turns water-quality data into forecasts and decision support.</p>
              <p>I work best where engineering and thoughtful interface design meet. Outside development, photography and short films keep me attentive to framing, pacing, and small details.</p>
              <a className={styles.cta} href="/contact"><span>Get in touch</span><span aria-hidden="true">↗</span></a>
            </Reveal>

            <section className={styles.toolkit} aria-labelledby="toolkit-title">
              <Reveal><header><p className={styles.eyebrow}>What I work in</p><h2 id="toolkit-title">Toolkit</h2></header></Reveal>
              {toolkit.map((group, index) => <Reveal key={group.label} delay={index * 80} className={styles.toolGroup}>
                <h3><span aria-hidden="true">{group.icon}</span>{group.number}<i />{group.label}</h3>
                <ul>{group.items.map(item => <li key={item}>{item}</li>)}</ul>
              </Reveal>)}
            </section>
          </div>
        </section>

        <section className={styles.experience} aria-labelledby="experience-title">
          <div className={styles.experienceIntro}>
            <Reveal><p className={styles.eyebrow}>Experience</p><h2 id="experience-title">Built by doing.</h2></Reveal>
            <Reveal className={styles.experienceImage}><ExperiencePortrait /></Reveal>
          </div>
          <div className={styles.experienceList}>{experience.map((item, index) => <Reveal key={item.role} delay={index * 70} className={styles.experienceRow}>
            <span>{item.date}</span><article><h3>{item.role}</h3><p><strong>{item.place}</strong><i>·</i>{item.meta}</p></article>
          </Reveal>)}</div>
        </section>
      </div>
      <ContactTeaser />
    </main>
    <SiteFooter />
  </>;
}
