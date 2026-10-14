import Image from "next/image";
import Reveal from "./Reveal";
import styles from "../app/work/[slug]/CaseStudy.module.css";

const models = [
  { name: "CNN–LSTM", score: "0.9281", width: "78%" },
  { name: "MRTFN", score: "0.9311", width: "82%" },
  { name: "Transformer", score: "0.9319", width: "84%" },
  { name: "Ensemble", score: "0.9422", width: "100%", best: true },
];

const targets = [
  { name: "pH", r2: "0.9517", rmse: "0.2228" },
  { name: "Water temperature", r2: "0.9415", rmse: "0.2391" },
  { name: "Turbidity", r2: "0.9333", rmse: "0.2517" },
];

export default function AquaAdaptEvidence() {
  return <section className={styles.aquaEvidence} aria-labelledby="prototype-title">
    <Reveal className={styles.sectionTitle}><span>04</span><div><p>Prototype & product</p><h2 id="prototype-title">Built beyond the model.</h2></div></Reveal>

    <div className={styles.aquaBody}>
      <Reveal className={styles.prototypeGrid}>
        <figure className={styles.prototypeFilm}>
          <video controls muted loop playsInline preload="metadata" poster="/media/aquaadapt/prototype-poster.jpg" aria-label="AquaAdapt pond sensor prototype demonstration">
            <source src="/media/aquaadapt/prototype-film.mp4" type="video/mp4" />
          </video>
          <figcaption><span>01 / Field prototype</span><span>20-second edit · no audio</span></figcaption>
        </figure>
        <div className={styles.prototypeCopy}>
          <p className={styles.kicker}>The physical loop</p>
          <h3>Pond water became a live data source.</h3>
          <p>The prototype brings a pH probe, waterproof temperature sensor, turbidity sensor, and controller into one acquisition setup. Readings move through validation and storage before the forecasting layer turns recent history into an actionable view.</p>
          <ul><li>pH, temperature, and turbidity sensing</li><li>IoT-compatible acquisition</li><li>Data-quality checks before inference</li></ul>
        </div>
      </Reveal>

      <Reveal className={styles.dashboardBlock}>
        <div className={styles.dashboardIntro}><p className={styles.kicker}>The operator view</p><h3>One interface for readings, weather, forecasts, and decisions.</h3><p>The Next.js dashboard exposes the full workflow instead of showing a single prediction: input quality, recent history, weather alignment, model choice, backtesting, monitoring, retraining, alerts, and explanations.</p></div>
        <figure><Image src="/media/aquaadapt/dashboard-overview.jpg" alt="AquaAdapt dashboard with water-quality KPIs, validation status, and forecasting controls" width={1305} height={892} sizes="(max-width: 980px) 100vw, 56vw" unoptimized /><figcaption>Dashboard overview / thesis prototype</figcaption></figure>
        <figure><Image src="/media/aquaadapt/forecast-interface.jpg" alt="AquaAdapt weather-aware forecast interface with recent history and six-hour forecast charts" width={1305} height={893} sizes="(max-width: 980px) 100vw, 56vw" unoptimized /><figcaption>Weather-aware forecast / six-hour horizon</figcaption></figure>
      </Reveal>

      <Reveal className={styles.architectureCard}>
        <div className={styles.architectureIntro}><p className={styles.kicker}>Three-tier system</p><h3>Every layer has one job.</h3></div>
        <div className={styles.tiers}>
          <div><span>Presentation</span><strong>Next.js dashboard</strong><small>KPIs · charts · comparison · alerts</small></div>
          <i aria-hidden="true">↓</i>
          <div><span>Logic</span><strong>FastAPI + forecast engine</strong><small>Validation · inference · SHAP · monitoring</small></div>
          <i aria-hidden="true">↓</i>
          <div><span>Data</span><strong>Firestore + model artefacts</strong><small>Readings · devices · weights · runtime status</small></div>
        </div>
      </Reveal>

      <Reveal className={styles.modelStudy}>
        <div className={styles.modelIntro}><p className={styles.kicker}>Model study</p><h3>Four approaches entered. The ensemble led.</h3><p>All models used the same time-aligned water-quality and weather dataset. The final ensemble achieved the strongest average fit and outperformed the classical XGBoost benchmark of 0.9321 R².</p></div>
        <div className={styles.modelBars} aria-label="Average R squared by proposed model">
          {models.map(model => <div className={model.best ? styles.bestModel : undefined} key={model.name}><span>{model.name}</span><div><i style={{ "--score-width": model.width }} /></div><strong>{model.score}</strong></div>)}
        </div>
        <div className={styles.targetCards}>
          {targets.map(target => <div key={target.name}><span>{target.name}</span><strong>{target.r2}</strong><small>R² · RMSE {target.rmse}</small></div>)}
        </div>
      </Reveal>

      <Reveal className={styles.fieldNote}>
        <div><p className={styles.kicker}>What physical testing changed</p><h3>The prototype exposed the work a dataset cannot.</h3></div>
        <div className={styles.fieldFindings}>
          <p><span>01</span><strong>Calibration</strong>The recorded pH trial produced an out-of-range value, so it is treated as a calibration finding and excluded from performance claims.</p>
          <p><span>02</span><strong>Connectivity</strong>A captured sensor cycle showed the local backend unavailable, revealing the need for retry, buffering, and clearer device status.</p>
          <p><span>03</span><strong>Deployment</strong>The breadboard proved the sensing path; a field-ready version needs weatherproof housing, stable power, and longer validation.</p>
        </div>
        <p className={styles.sourceNote}>Research results and system figures are drawn from the final AquaAdapt dissertation, April 2026. The private laboratory document is not reproduced.</p>
      </Reveal>
    </div>
  </section>;
}
