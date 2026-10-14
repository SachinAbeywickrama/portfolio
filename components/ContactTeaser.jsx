import Image from "next/image";
import Reveal from "./Reveal";
export default function ContactTeaser() {
  return <section className="contact-teaser page-shell" id="contact" aria-labelledby="chat-title"><Reveal><div className="section-title"><span>want to</span><h2 id="chat-title">chat?</h2></div></Reveal><div className="contact-teaser-grid"><div><p>A project, a role, or an interesting problem.<br />I’d like to hear about it.</p><a className="roll-link" href="/contact"><span className="roll-label"><span>Contact me</span><span aria-hidden="true">Contact me</span></span></a></div><Reveal className="contact-photo"><Image src="/media/sachin-car.webp" alt="Sachin and his classic Mini beside the waterfront" fill sizes="(max-width: 760px) 110vw, 60vw" loading="eager" /></Reveal></div></section>;
}
