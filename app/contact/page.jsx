import Header from "../../components/Header";
import ContactForm from "../../components/ContactForm";
import ContactPortrait from "../../components/ContactPortrait";
import SiteFooter from "../../components/SiteFooter";
import Reveal from "../../components/Reveal";
import styles from "./ContactPage.module.css";

export const metadata = {
  title: "Contact — Sachin Abeywickrama",
  description: "Get in touch with Sachin about software engineering roles, projects, and collaborations."
};

const links = [
  ["GitHub", "https://github.com/SachinAbeywickrama"],
  ["Playground", "/lab"],
  ["Résumé", "/Sachin-Abeywickrama-CV.pdf"]
];

export default function ContactPage() {
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <Header />
    <main id="main" className={styles.page}>
      <section className={styles.hero} aria-labelledby="contact-title">
        <Reveal className={styles.title}>
          <p>Don’t be shy</p>
          <h1 id="contact-title">contact<br />me.</h1>
          <div className={styles.heroNote}><span>Software engineer</span><span>Colombo, Sri Lanka</span></div>
        </Reveal>
        <Reveal className={styles.portrait} delay={100}><ContactPortrait /></Reveal>
      </section>

      <section className={styles.contact} aria-labelledby="say-hello-title">
        <div className={styles.details}>
          <Reveal><p className={styles.kicker}>A project, role, or good problem</p><h2 id="say-hello-title">say hello.</h2></Reveal>
          <div className={styles.contactLinks}>
            <a className={styles.email} href="mailto:sachinsuranjana@gmail.com"><span aria-hidden="true">✉</span><span>sachinsuranjana@gmail.com</span></a>
            <span className={styles.availability}><i /> Available for opportunities</span>
            <nav aria-label="Social and portfolio links">{links.map(([label, href]) => <a href={href} key={label} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener" : undefined}><span>{label}</span><span aria-hidden="true">↗</span></a>)}</nav>
          </div>
        </div>
        <ContactForm />
      </section>
    </main>
    <SiteFooter />
  </>;
}
