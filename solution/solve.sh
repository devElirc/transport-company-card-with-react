#!/usr/bin/env bash
set -euo pipefail

cd /app

cat > package.json <<'EOF'
{
  "name": "transport-company-card",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "4.3.4",
    "vite": "5.4.19"
  }
}
EOF

mkdir -p public src

cat > vite.config.js <<'EOF'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
EOF

cat > index.html <<'EOF'
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Transport Company Card</title>
    <script type="module" src="/src/main.jsx"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
EOF

cat > public/atlas-logo.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96">
  <rect width="96" height="96" rx="20" fill="#eff6ff"/>
  <path d="M18 67 48 20l30 47h-13l-6-10H37l-6 10Zm24-20h12L48 36Z" fill="#1d4ed8"/>
</svg>
EOF

cat > public/verified-badge.svg <<'EOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <circle cx="16" cy="16" r="14" fill="#1d4ed8"/>
  <path d="m10.5 16.4 3.2 3.3 7.8-8.1" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/>
</svg>
EOF

cat > src/companyData.js <<'EOF'
export const companies = [
  {
    id: "atlas",
    name: "Atlas Freight Lines International",
    logoUrl: "/atlas-logo.svg",
    verifiedIconUrl: "/verified-badge.svg",
    averageRating: 4.6,
    reviewCount: 214,
    metrics: {
      pricingAccuracy: 94,
      communication: 89,
      vehicleCondition: 91,
    },
  },
  {
    id: "nova",
    name: "Nova Transport Partners",
    logoUrl: "",
    verifiedIconUrl: "/verified-badge.svg",
    averageRating: 4.1,
    reviewCount: 88,
    metrics: {
      pricingAccuracy: 85,
      communication: 81,
      vehicleCondition: 84,
    },
  },
];
EOF

cat > src/App.jsx <<'EOF'
import { companies } from "./companyData";

const metricConfig = [
  ["pricingAccuracy", "Pricing Accuracy"],
  ["communication", "Communication"],
  ["vehicleCondition", "Vehicle Condition"],
];

function StarRating({ averageRating, reviewCount }) {
  if (!averageRating || !reviewCount) {
    return null;
  }

  return (
    <div className="rating-row" aria-label={`Rating ${averageRating} from ${reviewCount} reviews`}>
      <div className="stars" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span className={index < Math.round(averageRating) ? "star filled" : "star"} key={index}>
            {"\u2605"}
          </span>
        ))}
      </div>
      <span className="rating-text">{averageRating.toFixed(1)} ({reviewCount} reviews)</span>
    </div>
  );
}

function TrustRing({ score }) {
  const safeScore = Math.max(0, Math.min(100, score));
  const radius = 48;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="trust-panel">
      <div
        className="trust-ring"
        data-testid="trust-ring"
        style={{
          "--ring-offset": `${circumference - (circumference * safeScore) / 100}px`,
        }}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="ring-track" cx="60" cy="60" r={radius} />
          <circle className="ring-progress" cx="60" cy="60" r={radius} />
        </svg>
        <div className="trust-score-text">
          <strong>{safeScore}%</strong>
          <span>Trust Score</span>
        </div>
      </div>
    </div>
  );
}

function MetricRows({ metrics }) {
  return (
    <div className="metric-list">
      {metricConfig.map(([key, label]) => {
        const value = metrics[key];

        return (
          <div className="metric-row" key={key}>
            <span className="metric-label">{label}</span>
            <div
              className="metric-bar"
              role="progressbar"
              aria-label={label}
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={value}
            >
              <div className="metric-bar-fill" style={{ "--target-width": `${value}%` }} />
            </div>
            <span className="metric-value">{value}%</span>
          </div>
        );
      })}
    </div>
  );
}

function CompanyCard({ company }) {
  const trustScore = Math.round((company.averageRating / 5) * 100);

  return (
    <article className="company-card" aria-label={company.name}>
      <div className="card-header">
        <div className="logo-box" aria-label={`${company.name} logo`}>
          {company.logoUrl ? (
            <img className="company-logo" src={company.logoUrl} alt={`${company.name} logo`} />
          ) : (
            <div className="logo-fallback" aria-label={`${company.name} initial`}>
              {company.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="header-copy">
          <div className="title-row">
            <h2 title={company.name}>{company.name}</h2>
            <img className="verified-icon" src={company.verifiedIconUrl} alt="Verified company" />
          </div>
          <StarRating averageRating={company.averageRating} reviewCount={company.reviewCount} />
        </div>
      </div>

      <div className="badge-row" aria-label="Trust badges">
        <span className="badge">Verified</span>
        <span className="badge">Top Reviewed</span>
        <span className="badge">Customer Favorite</span>
      </div>

      <div className="summary-section">
        <TrustRing score={trustScore} />
      </div>

      <MetricRows metrics={company.metrics} />
    </article>
  );
}

export default function App() {
  return (
    <main className="page-shell">
      <section className="card-grid">
        {companies.map((company) => (
          <CompanyCard company={company} key={company.id} />
        ))}
      </section>
    </main>
  );
}
EOF

cat > src/main.jsx <<'EOF'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
EOF

cat > src/styles.css <<'EOF'
:root {
  color-scheme: light;
  font-family: "Trebuchet MS", "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top left, rgba(59, 130, 246, 0.12), transparent 30%),
    linear-gradient(160deg, #eff6ff, #f8fafc 48%, #e0f2fe);
  color: #0f172a;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
}

.page-shell {
  display: grid;
  place-items: center;
  min-height: 100vh;
  padding: 32px 16px;
}

.card-grid {
  display: grid;
  gap: 20px;
  width: min(100%, 960px);
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.company-card {
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 28px;
  box-shadow: 0 26px 50px rgba(15, 23, 42, 0.12);
  padding: 24px;
  backdrop-filter: blur(14px);
}

.card-header {
  display: grid;
  gap: 16px;
  grid-template-columns: 88px minmax(0, 1fr);
  align-items: center;
}

.logo-box {
  width: 88px;
  height: 88px;
  border-radius: 22px;
  background: #ffffff;
  border: 1px solid #dbe3ef;
  display: grid;
  place-items: center;
  overflow: hidden;
}

.company-logo {
  max-width: 72px;
  max-height: 72px;
  object-fit: contain;
}

.logo-fallback {
  width: 58px;
  height: 58px;
  border-radius: 18px;
  display: grid;
  place-items: center;
  background: linear-gradient(145deg, #dbeafe, #bfdbfe);
  color: #1d4ed8;
  font-size: 1.8rem;
  font-weight: 800;
}

.header-copy {
  min-width: 0;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.title-row h2 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 800;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.verified-icon {
  width: 20px;
  height: 20px;
  flex: 0 0 auto;
}

.rating-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  color: #475569;
  font-size: 0.95rem;
}

.stars {
  display: flex;
  gap: 4px;
}

.star {
  color: #cbd5e1;
}

.star.filled {
  color: #f59e0b;
}

.badge-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1d4ed8;
  font-size: 0.87rem;
  font-weight: 700;
}

.summary-section {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #dbe3ef;
  display: flex;
  justify-content: flex-start;
}

.trust-panel {
  display: flex;
  align-items: center;
  gap: 16px;
}

.trust-ring {
  position: relative;
  width: 132px;
  height: 132px;
}

.trust-ring svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track,
.ring-progress {
  fill: none;
  stroke-width: 10;
}

.ring-track {
  stroke: #dbeafe;
}

.ring-progress {
  stroke: #2563eb;
  stroke-linecap: round;
  stroke-dasharray: 301.59289474462014;
  stroke-dashoffset: 301.59289474462014;
  animation: ring-fill 1.4s ease forwards;
}

.trust-score-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  text-align: center;
}

.trust-score-text strong {
  display: block;
  font-size: 1.5rem;
}

.trust-score-text span {
  font-size: 0.78rem;
  color: #64748b;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.metric-list {
  margin-top: 20px;
  display: grid;
  gap: 16px;
}

.metric-row {
  display: grid;
  grid-template-columns: minmax(0, 140px) minmax(0, 1fr) 54px;
  align-items: center;
  gap: 12px;
}

.metric-label,
.metric-value {
  font-size: 0.92rem;
  font-weight: 700;
}

.metric-value {
  text-align: right;
  color: #0f172a;
}

.metric-bar {
  height: 14px;
  border-radius: 999px;
  overflow: hidden;
  background: #dbeafe;
  border: 1px solid rgba(59, 130, 246, 0.14);
}

.metric-bar-fill {
  width: 0;
  height: 100%;
  background:
    linear-gradient(
      135deg,
      rgba(255, 255, 255, 0.28) 0,
      rgba(255, 255, 255, 0.28) 20%,
      rgba(37, 99, 235, 0.14) 20%,
      rgba(37, 99, 235, 0.14) 40%
    ),
    linear-gradient(90deg, #38bdf8, #2563eb);
  background-size: 26px 26px, 100% 100%;
  animation:
    metric-grow 1.3s ease forwards,
    stripes 1.4s linear infinite;
}

@keyframes metric-grow {
  from {
    width: 0;
  }

  to {
    width: var(--target-width);
  }
}

@keyframes stripes {
  from {
    background-position: 0 0, 0 0;
  }

  to {
    background-position: 26px 0, 0 0;
  }
}

@keyframes ring-fill {
  to {
    stroke-dashoffset: var(--ring-offset);
  }
}

@media (max-width: 640px) {
  .company-card {
    padding: 20px;
  }

  .metric-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .metric-value {
    text-align: left;
  }
}
EOF

# Install deps before build — the task image does not ship /app/node_modules, and
# Harbor runs this script before the verifier’s separate `npm install` in test.sh.
npm install --no-fund --no-audit
npm run build >/dev/null
