import Header from "../../components/Header";
import ExperimentLab from "../../components/ExperimentLab";
import ContactTeaser from "../../components/ContactTeaser";
import SiteFooter from "../../components/SiteFooter";
export const metadata = { title: "Play — Sachin Abeywickrama", description: "A hands-on concurrency experiment: run, break, and improve a shared counter." };
export default function LabPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main" className="page-shell lab-page"><a className="text-link" href="/">← Back to the portfolio</a><ExperimentLab /><div className="page-end"><a href="/work/engineering-experiments">Explore the related work ↗</a><a href="/#contact">Let’s talk ↗</a></div></main><ContactTeaser /><SiteFooter /></>;
}
