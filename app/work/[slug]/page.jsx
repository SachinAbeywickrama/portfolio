import Image from "next/image";
import { notFound } from "next/navigation";
import Header from "../../../components/Header";
import ContactTeaser from "../../../components/ContactTeaser";
import SiteFooter from "../../../components/SiteFooter";
import Reveal from "../../../components/Reveal";
import AquaAdaptEvidence from "../../../components/AquaAdaptEvidence";
import { getProject, projects } from "../../../data/projects";
import styles from "./CaseStudy.module.css";

export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: `${project.title} — Sachin Abeywickrama`, description: project.intro, openGraph: { title: `${project.title} — Engineering Case Study`, description: project.intro, type: "article" } };
}

export default async function ProjectPage({ params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  const index = projects.findIndex(item => item.slug === slug);
  const next = projects[(index + 1) % projects.length];
  return <><a className="skip-link" href="#main">Skip to content</a><Header />
    <main id="main" className={styles.page} data-project={project.slug}>
      <section className={styles.hero} aria-labelledby="case-title">
        <div className={styles.heroTop}><a href="/work">← Works index</a><span>{project.number} / 03</span></div>
        <Reveal className={styles.heroTitle}><p>{project.type}</p><h1 id="case-title">{project.title}</h1><div><span>{project.year}</span><span>{project.role}</span></div></Reveal>
        <Reveal className={styles.heroLead}><p>{project.intro}</p><ul aria-label="Technologies">{project.stack.map(item => <li key={item}>{item}</li>)}</ul></Reveal>
      </section>

      <Reveal className={styles.cover}>
        <figure><Image src={project.cover} alt={`Concept artwork for ${project.title}`} fill sizes="(max-width: 760px) 100vw, 84vw" priority /><figcaption>Project visual / {project.year}</figcaption></figure>
      </Reveal>

      <section className={styles.brief} aria-label="Project at a glance">
        {[['Role',project.role],['Scope',project.scope],['Outcome',project.outcome]].map(([label,value],index) => <Reveal key={label} delay={index * 70}><span>{label}</span><p>{value}</p></Reveal>)}
      </section>

      <section className={styles.story}>
        <Reveal className={styles.sectionTitle}><span>01</span><div><p>Context</p><h2 id="problem-title">The problem.</h2></div></Reveal>
        <Reveal className={styles.prose}><p>{project.challenge}</p></Reveal>
      </section>

      <section className={styles.system} aria-labelledby="system-title">
        <Reveal className={styles.sectionTitle}><span>02</span><div><p>System view</p><h2 id="system-title">How it works.</h2></div></Reveal>
        <div className={styles.flow}>{project.architecture.map((item,index) => <Reveal className={styles.flowStep} delay={index * 55} key={item}><span>{String(index + 1).padStart(2,'0')}</span><strong>{item}</strong>{index < project.architecture.length - 1 && <i aria-hidden="true">→</i>}</Reveal>)}</div>
      </section>

      <section className={styles.story}>
        <Reveal className={styles.sectionTitle}><span>03</span><div><p>Ownership</p><h2 id="contribution-title">My contribution.</h2></div></Reveal>
        <Reveal className={styles.prose}><p>{project.contribution}</p><h3>Approach</h3><p>{project.approach}</p></Reveal>
      </section>

      {project.slug === "aquaadapt" && <AquaAdaptEvidence />}

      <section className={styles.results} aria-labelledby="results-title">
        <Reveal className={styles.sectionTitle}><span>{project.slug === "aquaadapt" ? "05" : "04"}</span><div><p>Proof</p><h2 id="results-title">Results & evidence.</h2></div></Reveal>
        <div className={styles.resultBody}>
          {project.metrics && <Reveal><div className={styles.metrics}>{project.metrics.map(metric => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}</div><p className={styles.metricNote}>{project.slug === "aquaadapt" ? "Final dissertation evaluation on the held-out test split." : "Evaluation results reported by the public reference pipeline."}</p></Reveal>}
          {project.slug === "enterprise-banking" && <p className={styles.confidential}>Internal professional work is described without proprietary code, interfaces, or client materials.</p>}
          <ul className={styles.evidence}>{project.evidence.map((item,index) => <li key={item}><span>{String(index + 1).padStart(2,'0')}</span>{item}</li>)}</ul>
          {project.repository && <a className={styles.source} href={project.repository} target="_blank" rel="noopener"><span>View {project.slug === "engineering-experiments" ? "repositories" : "source"}</span><span aria-hidden="true">↗</span></a>}
        </div>
      </section>

      <nav className={styles.next} aria-label="More projects"><span>Next case study / {next.number}</span><a href={`/work/${next.slug}`}><span>{next.title}</span><span aria-hidden="true">↗</span></a></nav>
    </main><ContactTeaser /><SiteFooter />
  </>;
}
