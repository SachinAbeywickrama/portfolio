const common = { vectorEffect: "non-scaling-stroke" };

function WebVisual() {
  return <svg viewBox="0 0 480 250" role="presentation">
    <g className="sv-window">
      <rect x="28" y="25" width="424" height="200" />
      <path d="M28 57h424" />
      <circle cx="48" cy="41" r="3" /><circle cx="60" cy="41" r="3" /><circle cx="72" cy="41" r="3" />
      <rect className="sv-address" x="104" y="35" width="170" height="12" />
    </g>
    <g className="sv-wire" {...common}>
      <rect x="48" y="76" width="82" height="129" />
      <path d="M65 95h48M65 109h35M65 137h48M65 151h30" />
      <rect x="148" y="76" width="284" height="54" />
      <rect x="148" y="146" width="84" height="59" />
      <rect x="248" y="146" width="84" height="59" />
      <rect x="348" y="146" width="84" height="59" />
    </g>
    <rect className="sv-web-focus" x="148" y="76" width="284" height="54" />
    <path className="sv-scan" d="M148 82h284" {...common} />
    <g className="sv-cursor">
      <path d="m354 166 18 42 7-17 17-7z" />
      <path d="m377 190 12 13" {...common} />
    </g>
    <text x="290" y="98">RESPONSIVE SYSTEM</text>
    <text className="sv-code" x="290" y="116">12 COL / ACCESSIBLE / FAST</text>
  </svg>;
}

function BackendVisual() {
  return <svg viewBox="0 0 480 250" role="presentation">
    <g className="sv-backend-lines" {...common}>
      <path d="M102 78h75M303 78h75M240 111v43M102 177h75M303 177h75" />
      <path d="m167 72 10 6-10 6M303 72l-10 6 10 6M234 144l6 10 6-10M167 171l10 6-10 6M303 171l-10 6 10 6" />
    </g>
    <g className="sv-node sv-node-client">
      <rect x="38" y="49" width="64" height="58" /><text x="70" y="74">UI</text><text className="sv-code" x="70" y="90">CLIENT</text>
    </g>
    <g className="sv-node sv-node-api">
      <rect x="177" y="40" width="126" height="76" /><text x="240" y="73">API</text><text className="sv-code" x="240" y="92">SPRING BOOT</text>
    </g>
    <g className="sv-node sv-node-auth">
      <rect x="378" y="49" width="64" height="58" /><text x="410" y="74">AUTH</text><text className="sv-code" x="410" y="90">JWT</text>
    </g>
    <g className="sv-node sv-node-worker">
      <rect x="38" y="148" width="64" height="58" /><text x="70" y="173">JOB</text><text className="sv-code" x="70" y="189">QUEUE</text>
    </g>
    <g className="sv-node sv-node-db">
      <ellipse cx="240" cy="165" rx="63" ry="15" /><path d="M177 165v30c0 8 28 15 63 15s63-7 63-15v-30" /><path d="M177 180c0 8 28 15 63 15s63-7 63-15" />
      <text className="sv-code" x="240" y="194">MYSQL</text>
    </g>
    <g className="sv-node sv-node-test">
      <rect x="378" y="148" width="64" height="58" /><text x="410" y="173">✓</text><text className="sv-code" x="410" y="189">TEST</text>
    </g>
    <circle className="sv-packet sv-packet-one" cx="102" cy="78" r="5" />
    <circle className="sv-packet sv-packet-two" cx="303" cy="78" r="5" />
    <circle className="sv-packet sv-packet-three" cx="240" cy="116" r="5" />
  </svg>;
}

function IntelligenceVisual() {
  return <svg viewBox="0 0 480 250" role="presentation">
    <g className="sv-chart" {...common}>
      <path d="M56 98v122h382" />
      <path className="sv-grid-line" d="M56 128h382M56 158h382M56 188h382M132 98v122M208 98v122M284 98v122M360 98v122" />
      <path className="sv-history" d="M57 187c22-3 29-35 53-32s31 24 53 18 26-50 52-46 31 35 53 29 27-42 53-39 32 36 54 33" />
      <path className="sv-forecast" d="M325 150c24-3 34-35 57-29s28 31 56 16" />
      <path className="sv-range" d="M325 137c24-2 34-26 57-22s31 22 56 12M325 163c24-4 34-44 57-36s25 41 56 20" />
    </g>
    <g className="sv-sensor">
      <rect x="76" y="33" width="98" height="43" />
      <circle cx="92" cy="54" r="5" />
      <text x="125" y="52">PH 6.15</text><text className="sv-code" x="125" y="66">POND–01</text>
    </g>
    <g className="sv-sensor sv-sensor-two">
      <rect x="190" y="33" width="119" height="43" />
      <circle cx="206" cy="54" r="5" />
      <text x="250" y="52">25.5°C</text><text className="sv-code" x="250" y="66">LIVE SENSOR</text>
    </g>
    <circle className="sv-live-dot" cx="325" cy="150" r="6" />
    <text className="sv-code sv-prediction-label" x="380" y="207">FORECAST +6H</text>
  </svg>;
}

export default function ServiceVisual({ type }) {
  return <div className={`service-visual service-visual--${type}`}>
    {type === "web" && <WebVisual />}
    {type === "backend" && <BackendVisual />}
    {type === "intelligence" && <IntelligenceVisual />}
  </div>;
}
