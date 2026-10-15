import WorkFilmStrip from "./WorkFilmStrip";

const elsewhere = [
  ["GitHub", "https://github.com/SachinAbeywickrama"],
  ["Instagram", "https://www.instagram.com/sachin_abeywickrama/"],
  ["Playground", "/lab"],
  ["Résumé", "/Sachin-Abeywickrama-CV.pdf"]
];

export default function SiteFooter() {
  return <footer className="site-footer">
    <WorkFilmStrip />
    <nav className="footer-nav" aria-label="Footer navigation">{[["/about","About"],["/work","Works"],["/contact","Contact"]].map(([href,label]) => <a key={href} href={href}><span className="roll-label"><span>{label}</span><span aria-hidden="true">{label}</span></span></a>)}</nav>
    <div className="footer-inner page-shell"><div className="footer-info"><div className="footer-elsewhere"><p className="eyebrow">Elsewhere</p>{elsewhere.map(([label, href]) => <a key={href} href={href} target={href.startsWith("http") || href.endsWith(".pdf") ? "_blank" : undefined} rel={href.startsWith("http") || href.endsWith(".pdf") ? "noopener noreferrer" : undefined}><span className="roll-label"><span>{label}</span><span aria-hidden="true">{label}</span></span><span className="footer-arrow" aria-hidden="true">→</span></a>)}</div><div className="footer-colophon"><p className="eyebrow">Colophon</p><p>© {new Date().getFullYear()} Sachin Abeywickrama.</p></div></div><a className="footer-wordmark" href="/#home" aria-label="Sachin Abeywickrama, back to top"><span aria-hidden="true">sachin.</span></a></div>
  </footer>;
}
