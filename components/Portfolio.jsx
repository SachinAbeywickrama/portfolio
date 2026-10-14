import { projects } from "../data/projects";
import StudioHero from "./StudioHero";
import DeveloperFeature from "./DeveloperFeature";
import WorkCarousel from "./WorkCarousel";
import Reveal from "./Reveal";
import WorkMarquee from "./WorkMarquee";
import RoomIntro from "./RoomIntro";
import ContactTeaser from "./ContactTeaser";
import SiteFooter from "./SiteFooter";
import ServiceVisual from "./ServiceVisual";

const services = [
  { title: "web development", items: ["React & Angular", "responsive interfaces", "accessible experiences", "REST integration"], visual: "web" },
  { title: "backend & enterprise", items: ["Java & Spring Boot", "API design", "MySQL", "testing & reliability"], visual: "backend" },
  { title: "machine learning & IoT", items: ["Python", "time-series forecasting", "data pipelines", "connected sensing"], visual: "intelligence" },
];

export default function Portfolio() {
  return <><RoomIntro /><main id="main">
    <StudioHero />
    <section className="intro-section page-shell" id="about" aria-labelledby="about-title">
      <Reveal><div className="section-title"><span>the</span><h2 id="about-title">developer.</h2></div></Reveal>
      <DeveloperFeature><Reveal className="intro-copy"><p>I’m Sachin, a software engineer based in Colombo, Sri Lanka. My work brings together web applications, enterprise systems, and machine learning. From internal applications at SDB Bank to water-quality research with AquaAdapt, I like understanding how things fit together—and building something useful from that understanding.</p><a className="roll-link" href="/about"><span className="roll-label"><span>Learn more</span><span aria-hidden="true">Learn more</span></span></a></Reveal></DeveloperFeature>
    </section>
    <section className="selected-section" id="work" aria-labelledby="work-title"><div className="page-shell"><Reveal><div className="section-title"><span>selected</span><h2 id="work-title">works.</h2></div></Reveal><WorkCarousel items={projects.map(project => ({ ...project, href: `/work/${project.slug}` }))} /></div></section>
    <WorkMarquee />
    <section className="services-section" id="services" aria-labelledby="services-title"><div className="page-shell"><Reveal><div className="section-title"><span>my</span><h2 id="services-title">services.</h2></div></Reveal></div><div className="service-list">{services.map((service,index) => <Reveal key={service.title}><article className="service-row"><span className="service-index">0{index+1}</span><div className="service-description"><h3>{service.title}</h3></div><ul>{service.items.map(item => <li key={item}>{item}</li>)}</ul><div className="service-art" aria-hidden="true"><ServiceVisual type={service.visual} /></div></article></Reveal>)}</div></section>
    <ContactTeaser />
  </main><SiteFooter /></>;
}
