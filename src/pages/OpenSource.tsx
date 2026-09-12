import { Link } from "react-router-dom";
import { Check, Code, Globe, Lock, Heart } from "../components/icons";

const PILLARS = [
  {
    icon: <Heart size={22} />,
    title: "Free forever",
    desc: "Every tool, every feature, no accounts and no usage caps. DOCly is community-funded and will never put basic document tools behind a paywall.",
  },
  {
    icon: <Code size={22} />,
    title: "Open source (MIT)",
    desc: "The full source code is public on GitHub. Audit it, learn from it, fork it, or send a pull request — contributions are welcome.",
  },
  {
    icon: <Lock size={22} />,
    title: "Self-hosted & private",
    desc: "Run DOCly on your own machine or server in minutes with Docker. Your documents never have to leave your network.",
  },
];

const FACTS = [
  "MIT licensed — use it commercially, no strings attached",
  "No accounts, no tracking, no ads",
  "Docker one-liner for self-hosting",
  "Built with an open, documented API layer",
];

export function OpenSourcePage() {
  return (
    <div className="container page">
      <header className="section-head" style={{ textAlign: "center" }}>
        <p className="eyebrow">Open Source</p>
        <h1 className="page-title">Free, forever, for everyone.</h1>
        <p style={{ margin: "0 auto" }}>
          DOCly is an open-source PDF toolbox. No premium tiers, no locks — just useful software you can trust and own.
        </p>
      </header>

      <div className="wyw-grid" style={{ marginTop: "var(--sp-8)" }}>
        {PILLARS.map((p) => (
          <div className="wyw-card" key={p.title}>
            <div className="wyw-icon">{p.icon}</div>
            <h3>{p.title}</h3>
            <p>{p.desc}</p>
          </div>
        ))}
      </div>

      <section style={{ marginTop: "var(--sp-16)", maxWidth: 720, marginInline: "auto" }} aria-labelledby="facts-heading">
        <h2 id="facts-heading" style={{ fontSize: 22, marginBottom: "var(--sp-5)", textAlign: "center" }}>
          What that means in practice
        </h2>
        <ul style={{ display: "flex", flexDirection: "column", gap: "var(--sp-3)" }}>
          {FACTS.map((f) => (
            <li key={f} style={{ display: "flex", gap: "var(--sp-3)", alignItems: "flex-start", fontSize: 15, color: "var(--text-secondary)" }}>
              <span style={{ color: "var(--success)", marginTop: 2 }}>
                <Check size={17} />
              </span>
              {f}
            </li>
          ))}
        </ul>
      </section>

      <section className="settings-card" style={{ maxWidth: 720, margin: "var(--sp-12) auto 0" }} aria-labelledby="selfhost-heading">
        <h2 id="selfhost-heading" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Globe size={19} /> Self-host in one line
        </h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: "var(--sp-4)" }}>
          Docker is all you need. The web app and the Python processing service ship together.
        </p>
        <pre
          style={{
            background: "var(--footer-bg)", color: "#d4d4d8", borderRadius: "var(--radius-md)",
            padding: "var(--sp-4)", fontSize: 13.5, overflowX: "auto", margin: 0,
          }}
          tabIndex={0}
          aria-label="Docker command to self-host DOCly"
        >
          <code>docker run -p 8080:8080 ghcr.io/cr725duck/docly:latest</code>
        </pre>
      </section>

      <section className="final-cta" style={{ padding: "var(--sp-12) 0 0" }}>
        <h2>Star the project, or just use the tools</h2>
        <div style={{ display: "flex", gap: "var(--sp-3)", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="https://github.com/cr725duck/docly" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">
            View on GitHub
          </a>
          <Link to="/tools" className="btn btn-secondary btn-lg">
            Explore all tools
          </Link>
        </div>
      </section>
    </div>
  );
}
