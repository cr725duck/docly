import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES, toolsByCategory, type CategoryId } from "../data/tools";
import { SearchBar, PopularSearchRow } from "../components/SearchBar";
import { ToolGrid } from "../components/ToolCard";
import { ArrowRight, Check, Globe, Smartphone, Briefcase, Clock, Heart, Code, Lock } from "../components/icons";

const HOME_SECTIONS: CategoryId[] = ["convert", "edit", "organize", "compress", "security", "ai"];

const USE_CASES = ["Business", "Students", "Legal", "Finance", "Education", "Design", "Administration"];

const PRIVACY_POINTS = [
  { title: "Temporary file processing", sub: "Files exist only for the duration of your task.", icon: <Clock size={18} /> },
  { title: "Automatic deletion", sub: "Everything is erased shortly after processing.", icon: <Clock size={18} /> },
  { title: "Secure transfers", sub: "Encrypted in transit, every single time.", icon: <Check size={18} /> },
  { title: "No unnecessary retention", sub: "We keep nothing we don't strictly need.", icon: <Check size={18} /> },
];

function LazyToolGrid({ category }: { category: CategoryId }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 350);
    return () => clearTimeout(t);
  }, []);
  const tools = toolsByCategory(category).slice(0, 5);
  return loaded ? <ToolGrid tools={tools} /> : <SkeletonRow />;
}

function SkeletonRow() {
  return (
    <div className="tool-grid" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="tool-card" style={{ pointerEvents: "none" }}>
          <div className="skeleton" style={{ width: 24, height: 24 }} />
          <div className="skeleton" style={{ width: "65%", height: 14 }} />
          <div className="skeleton" style={{ width: "85%", height: 11 }} />
        </div>
      ))}
    </div>
  );
}

export function HomePage() {
  return (
    <div className="container">
      {/* Hero */}
      <section className="hero">
        <p className="eyebrow">PDF Toolbox</p>
        <h1>
          Every PDF tool.
          <br />
          One simple <span className="accent">workspace.</span>
        </h1>
        <p className="sub">
          Merge, compress, convert, edit and protect your documents without the complexity.
        </p>
        <div className="hero-cta">
          <Link to="/tools" className="btn btn-primary btn-lg">
            Explore tools
          </Link>
          <a href="#work-your-way" className="btn btn-secondary btn-lg">
            See what's possible
          </a>
        </div>
        <SearchBar id="home-search" large />
        <PopularSearchRow />
      </section>

      {/* Popular tools */}
      <section className="tool-section" aria-labelledby="popular-heading">
        <div className="section-head">
          <h2 id="popular-heading">Popular tools</h2>
          <p>Get the most common PDF tasks done in seconds.</p>
        </div>
        <LazyToolGrid category="popular" />
        <p style={{ marginTop: "var(--sp-4)" }}>
          <Link to="/tools?category=popular" className="btn btn-ghost">
            See all popular tools <ArrowRight size={16} />
          </Link>
        </p>
      </section>

      {/* Category sections */}
      {HOME_SECTIONS.map((cat) => {
        const meta = CATEGORIES.find((c) => c.id === cat)!;
        return (
          <section className="tool-section" key={cat} aria-labelledby={`cat-${cat}`}>
            <div className="section-head section-head-row">
              <div>
                <h2 id={`cat-${cat}`}>{meta.name}</h2>
                <p>{meta.description}</p>
              </div>
              <Link to={`/tools?category=${cat}`} className="btn btn-ghost btn-sm">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <LazyToolGrid category={cat} />
          </section>
        );
      })}

      {/* Work your way */}
      <section className="tool-section" id="work-your-way" aria-labelledby="wyw-heading">
        <div className="section-head" style={{ textAlign: "center" }}>
          <h2 id="wyw-heading">Work your way</h2>
          <p style={{ margin: "0 auto" }}>The same toolbox, wherever the work happens.</p>
        </div>
        <div className="wyw-grid">
          {[
            { icon: <Globe size={22} />, title: "Web", desc: "Every tool runs in your browser — nothing to install, always up to date." },
            { icon: <Smartphone size={22} />, title: "Mobile", desc: "Scan, sign and send documents from your pocket with touch-first tools." },
            { icon: <Briefcase size={22} />, title: "Business", desc: "Self-host DOCly on your own servers and keep every document in-house." },
          ].map((c) => (
            <div className="wyw-card" key={c.title}>
              <div className="wyw-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy */}
      <section className="privacy" aria-labelledby="privacy-heading">
        <p className="eyebrow">Privacy</p>
        <h2 id="privacy-heading" style={{ fontSize: 26, marginTop: 8 }}>
          Your documents stay yours.
        </h2>
        <p className="section-head" style={{ margin: "12px auto 0" }}>
          We handle your files only as long as it takes to get the job done.
        </p>
        <div className="privacy-list">
          {PRIVACY_POINTS.map((p) => (
            <div className="privacy-item" key={p.title}>
              {p.icon}
              <div>
                <strong>{p.title}</strong>
                <span>{p.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Use cases */}
      <section className="privacy" aria-labelledby="usecases-heading">
        <p className="eyebrow">Built for real work</p>
        <h2 id="usecases-heading" style={{ fontSize: 26, marginTop: 8 }}>
          One toolbox, many desks.
        </h2>
        <div className="usecases">
          {USE_CASES.map((u) => (
            <span className="usecase" key={u}>
              {u}
            </span>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta">
        <h2>Find your next PDF tool</h2>
        <Link to="/tools" className="btn btn-primary btn-lg">
          Explore all tools
        </Link>
      </section>

      {/* Open source */}
      <section className="tool-section" id="open-source" aria-labelledby="oss-heading" style={{ paddingBottom: "var(--sp-8)" }}>
        <div className="section-head" style={{ textAlign: "center" }}>
          <p className="eyebrow">Open Source</p>
          <h2 id="oss-heading" style={{ marginTop: 8 }}>Free, forever, for everyone.</h2>
          <p style={{ margin: "0 auto" }}>
            Every tool is free and unlimited. The full source is on GitHub under the MIT license — audit it, fork it, self-host it.
          </p>
        </div>
        <div className="wyw-grid">
          {[
            { icon: <Heart size={22} />, title: "No paywalls", desc: "All tools, unlimited use, no accounts required." },
            { icon: <Code size={22} />, title: "MIT licensed", desc: "Use DOCly anywhere — personal, work or commercial." },
            { icon: <Lock size={22} />, title: "Self-host", desc: "One Docker command keeps documents on your own network." },
          ].map((c) => (
            <div className="wyw-card" key={c.title}>
              <div className="wyw-icon">{c.icon}</div>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "var(--sp-8)" }}>
          <Link to="/open-source" className="btn btn-primary btn-lg">
            About the project
          </Link>
        </div>
      </section>
    </div>
  );
}
