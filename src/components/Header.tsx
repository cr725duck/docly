import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { CATEGORIES, toolsByCategory } from "../data/tools";
import { Logo } from "./Logo";
import { ChevronDown, Menu, SearchIcon, Sun, Moon, Monitor, X } from "./icons";
import { useTheme, type ThemePreference } from "../lib/theme";

const PRIMARY_NAV = ["compress", "convert", "edit", "organize", "security", "ai"] as const;
const NAV_LABELS: Record<(typeof PRIMARY_NAV)[number], string> = {
  compress: "Compress",
  convert: "Convert",
  edit: "Edit",
  organize: "Organize",
  security: "Sign",
  ai: "AI PDF",
};

function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { pref, setTheme } = useTheme();
  const next: Record<ThemePreference, ThemePreference> = { light: "dark", dark: "system", system: "light" };
  const label = { light: "Light theme", dark: "Dark theme", system: "System theme" }[pref];
  return (
    <button
      className="icon-btn"
      style={compact ? undefined : { width: 38, height: 38 }}
      onClick={() => setTheme(next[pref])}
      aria-label={`${label} — switch to ${next[pref]}`}
      title={`Theme: ${pref}`}
    >
      {pref === "light" ? <Sun size={18} /> : pref === "dark" ? <Moon size={18} /> : <Monitor size={18} />}
    </button>
  );
}

export { ThemeToggle };

function MegaMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  return (
    <div
      className={`megamenu ${open ? "open" : ""}`}
      onMouseLeave={onClose}
      role="region"
      aria-label="All tools menu"
    >
      <div className="megamenu-grid">
        {PRIMARY_NAV.map((cat) => {
          const catMeta = CATEGORIES.find((c) => c.id === cat)!;
          return (
            <div className="mm-col" key={cat}>
              <h4>{NAV_LABELS[cat]}</h4>
              <ul>
                {toolsByCategory(cat)
                  .slice(0, cat === "organize" ? 6 : 5)
                  .map((t) => (
                    <li key={t.id}>
                      <Link to={`/tools/${t.slug}`} onClick={onClose}>
                        {t.name}
                      </Link>
                    </li>
                  ))}
                {cat === "security" && (
                  <li>
                    <Link to="/tools/unlock-pdf" onClick={onClose}>
                      Unlock PDF
                    </Link>
                  </li>
                )}
                {cat === "ai" && (
                  <li>
                    <Link to="/tools/translate-pdf" onClick={onClose}>
                      Translate PDF
                    </Link>
                  </li>
                )}
              </ul>
              <span className="visually-hidden">{catMeta.name}</span>
            </div>
          );
        })}
      </div>
      <div className="mm-footer">
        <Link to="/tools" onClick={() => { onClose(); navigate("/tools"); }}>
          View all tools <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}

function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <nav className="mobile-menu" aria-label="Mobile navigation">
      <Link to="/tools" onClick={onClose}>
        All tools
      </Link>
      {PRIMARY_NAV.map((cat) => (
        <Link key={cat} to={`/tools?category=${cat}`} onClick={onClose}>
          {NAV_LABELS[cat]}
        </Link>
      ))}
      <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "12px 8px" }}>
        <ThemeToggle />
        <Link to="/open-source" onClick={onClose} className="btn btn-primary" style={{ flex: 1 }}>
          Open Source
        </Link>
      </div>
    </nav>
  );
}

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
        setSearchOpen(false);
      }
      if (e.key === "/" && !searchOpen && (e.target as HTMLElement)?.tagName !== "INPUT") {
        e.preventDefault();
        navigate("/tools");
      }
    };
    const onClick = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setMegaOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [navigate, searchOpen]);

  return (
    <header className="header">
      <div className="container header-inner">
        <Logo />
        <nav className="nav" aria-label="Primary">
          <div ref={toolsRef} className="megamenu-wrap">
            <button
              className="nav-link"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onClick={() => setMegaOpen((v) => !v)}
              onMouseEnter={() => setMegaOpen(true)}
            >
              Tools <ChevronDown size={14} className="chev" />
            </button>
            <MegaMenu open={megaOpen} onClose={() => setMegaOpen(false)} />
          </div>
          {PRIMARY_NAV.filter((c) => c !== "security").map((cat) => (
            <NavLink key={cat} className="nav-link" to={`/tools?category=${cat}`}>
              {NAV_LABELS[cat]}
            </NavLink>
          ))}
        </nav>
        <div className="nav-spacer" />
        <div className="header-actions">
          <button className="icon-btn hide-mobile" aria-label="Search tools" onClick={() => navigate("/tools?focus=search")} style={{ width: 38, height: 38 }}>
            <SearchIcon size={18} />
          </button>
          <div className="hide-mobile">
            <ThemeToggle />
          </div>
          <a className="nav-link hide-mobile" href="https://github.com/cr725duck/docly" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <Link to="/open-source" className="btn btn-primary btn-sm hide-mobile">
            Open Source
          </Link>
          <button className="icon-btn menu-btn" aria-label={mobileOpen ? "Close menu" : "Open menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((v) => !v)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
