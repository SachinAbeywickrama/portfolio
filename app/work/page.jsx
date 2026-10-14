import WorkHero from "../../components/WorkHero";
import WorkArchive from "../../components/WorkArchive";
import Header from "../../components/Header";
import ContactTeaser from "../../components/ContactTeaser";
import SiteFooter from "../../components/SiteFooter";
import { projects } from "../../data/projects";
export const metadata = { title: "Work — Sachin Abeywickrama", description: "Selected work in full-stack development, enterprise applications, IoT, and machine learning." };
export default function WorkPage() {
  return <><a className="skip-link" href="#main">Skip to content</a><Header /><main id="main"><WorkHero /><WorkArchive projects={projects} /><ContactTeaser /></main><SiteFooter /></>;
}
