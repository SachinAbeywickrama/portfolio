"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import styles from "./WorkArchive.module.css";

const projectCategories = {
  aquaadapt: ["Research", "Machine Learning", "IoT"],
  rolenest: ["Web", "Full-stack", "Product"],
  ceyluxe: ["Web", "Design"],
  "enterprise-banking": ["Enterprise", "Web"],
  "engineering-experiments": ["Experiments", "Java", "Python"]
};

function ProjectImage({ project, priority = false, sizes }) {
  return <Image src={project.cover} alt={project.coverAlt ?? `Concept artwork for ${project.title}`} fill sizes={sizes} priority={priority} />;
}

function ProjectCard({ project, index }) {
  const categories = projectCategories[project.slug] || [];
  return <Reveal className={styles.card} delay={index * 75}>
    <article>
      <a className={styles.cardImage} href={`/work/${project.slug}`} aria-label={`Explore ${project.title}`}>
        <ProjectImage project={project} sizes="(max-width: 700px) 100vw, (max-width: 1050px) 50vw, 28vw" />
        <span className={styles.cardNumber}>{project.number}</span>
        <span className={styles.cardArrow} aria-hidden="true">↗</span>
      </a>
      <a className={styles.cardCopy} href={`/work/${project.slug}`}>
        <span><strong>{project.title}</strong><small>{project.year}</small></span>
        <span className={styles.cardTags}>{categories.slice(0, 2).join(" · ")}</span>
      </a>
    </article>
  </Reveal>;
}

export default function WorkArchive({ projects }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("All");
  const featured = projects[0];
  const filters = ["All", "Research", "Web", "Enterprise", "Experiments"];
  const visibleProjects = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return projects.filter(project => {
      const categories = projectCategories[project.slug] || [];
      const matchesFilter = filter === "All" || categories.includes(filter);
      const haystack = [project.title, project.summary, project.type, project.year, ...project.stack, ...categories].join(" ").toLowerCase();
      return matchesFilter && (!needle || haystack.includes(needle));
    });
  }, [filter, projects, query]);

  return <div className={styles.shell}>
    <section className={styles.featured} aria-labelledby="featured-title">
      <Reveal><header className={styles.sectionHeading}><span>01 / Selected case study</span><h2 id="featured-title">featured.</h2></header></Reveal>
      <Reveal className={styles.featuredCard}>
        <a className={styles.featuredImage} href={`/work/${featured.slug}`} aria-label={`Explore ${featured.title}`}>
          <span className={styles.imageLabel}>Project {featured.number}</span>
          <span className={styles.visualIndex} aria-hidden="true">Water / data / decisions</span>
          <span className={styles.visualOutline} aria-hidden="true" />
          <span className={styles.visualPlate}>
            <ProjectImage project={featured} priority sizes="(max-width: 760px) 78vw, 33vw" />
          </span>
          <span className={styles.dashboardPlate} aria-hidden="true"><Image src="/media/aquaadapt/dashboard-overview.jpg" alt="" fill sizes="(max-width: 760px) 44vw, 18vw" /></span>
          <span className={styles.visualCaption} aria-hidden="true">AquaAdapt / 01 — Pond intelligence</span>
          <span className={styles.featuredArrow} aria-hidden="true">↗</span>
        </a>
        <article className={styles.featuredCopy}>
          <div>
            <p className={styles.kicker}>Undergraduate thesis / {featured.year}</p>
            <h3><a href={`/work/${featured.slug}`}>{featured.title}</a></h3>
            <p className={styles.featuredSummary}>{featured.summary}</p>
            <p className={styles.featuredContribution}>{featured.contributionSummary}</p>
          </div>
          <div className={styles.featuredMeta}>
            <span>{featured.type}</span>
            <ul aria-label="Technologies">{featured.stack.slice(0, 3).map(item => <li key={item}>{item}</li>)}</ul>
          </div>
          <a className={styles.projectLink} href={`/work/${featured.slug}`}>
            <span className={styles.roll}><span>Explore case study</span><span aria-hidden="true">Explore case study</span></span><span aria-hidden="true">↗</span>
          </a>
        </article>
      </Reveal>
    </section>

    <section className={styles.archive} aria-labelledby="archive-title">
      <Reveal><header className={styles.sectionHeading}><span>02 / Complete archive</span><h2 id="archive-title">the rest.</h2></header></Reveal>
      <div className={styles.tools}>
        <label className={styles.search}>
          <span aria-hidden="true">⌕</span><span className="sr-only">Search works</span>
          <input value={query} onChange={event => setQuery(event.target.value)} type="search" placeholder="Search works" />
        </label>
        <div className={styles.filters} aria-label="Filter projects">{filters.map(item => <button key={item} type="button" className={filter === item ? styles.active : undefined} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      <p className={styles.resultCount} aria-live="polite">Showing {visibleProjects.length} of {projects.length} projects</p>
      {visibleProjects.length > 0 ? <div className={styles.grid} key={`${filter}-${query}`}>{visibleProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug} />)}</div> : <div className={styles.empty}><p>No projects match that search.</p><button type="button" onClick={() => { setQuery("");setFilter("All"); }}>Clear filters</button></div>}
    </section>
  </div>;
}
