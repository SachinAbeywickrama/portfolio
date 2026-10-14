import WorkFilmStrip from "./WorkFilmStrip";

export default function SiteFooter() {
  return <footer className="site-footer">
    <WorkFilmStrip />
    <nav className="footer-nav" aria-label="Footer navigation">{[["/about","About"],["/work","Works"],["/contact","Contact"]].map(([href,label]) => <a key={href} href={href}><span className="roll-label"><span>{label}</span><span aria-hidden="true">{label}</span></span></a>)}</nav>
    <div className="footer-inner page-shell"><div className="footer-info"><div className="footer-elsewhere"><p className="eyebrow">Elsewhere</p><a href="https://github.com/SachinAbeywickrama" target="_blank" rel="noopener"><span className="roll-label"><span>GitHub</span><span aria-hidden="true">GitHub</span></span><span className="footer-arrow" aria-hidden="true">→</span></a><a href="/lab"><span className="roll-label"><span>Playground</span><span aria-hidden="true">Playground</span></span><span className="footer-arrow" aria-hidden="true">→</span></a><a href="/Sachin-Abeywickrama-CV.pdf" target="_blank" rel="noopener"><span className="roll-label"><span>Résumé</span><span aria-hidden="true">Résumé</span></span><span className="footer-arrow" aria-hidden="true">→</span></a></div><div className="footer-colophon"><p className="eyebrow">Colophon</p><p>© {new Date().getFullYear()} Sachin Abeywickrama.</p></div></div><a className="footer-wordmark" href="/#home" aria-label="Sachin Abeywickrama, back to top"><span aria-hidden="true">sachin.</span></a></div>
  </footer>;
}
