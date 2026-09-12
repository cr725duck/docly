import { useTheme } from "../lib/theme";
import { ThemeToggle } from "../components/Header";

export function SettingsPage() {
  const { pref, setTheme } = useTheme();
  const options: { id: "light" | "dark" | "system"; label: string; swatch: string }[] = [
    { id: "light", label: "Light", swatch: "swatch-light" },
    { id: "dark", label: "Dark", swatch: "swatch-dark" },
    { id: "system", label: "System", swatch: "swatch-system" },
  ];

  return (
    <div className="container page settings-layout">
      <h1 className="page-title">Settings</h1>
      <p className="page-sub">Preferences are stored locally in your browser.</p>

      <section className="settings-card" aria-labelledby="appearance-heading">
        <h2 id="appearance-heading">Appearance</h2>
        <div className="theme-choices" role="radiogroup" aria-label="Theme">
          {options.map((o) => (
            <button
              key={o.id}
              role="radio"
              aria-checked={pref === o.id}
              className={`theme-choice ${pref === o.id ? "selected" : ""}`}
              onClick={() => setTheme(o.id)}
            >
              <span className={`theme-swatch ${o.swatch}`} aria-hidden="true" />
              {o.label}
            </button>
          ))}
        </div>
      </section>

      <section className="settings-card" aria-labelledby="account-heading">
        <h2 id="account-heading">Account</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          DOCly is free and open source — there is no account or plan to manage. Preferences live in your browser.
        </p>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <a href="https://github.com/cr725duck/docly" target="_blank" rel="noreferrer" className="btn btn-primary btn-sm">
            View source on GitHub
          </a>
          <ThemeToggle />
        </div>
      </section>

      <section className="settings-card" aria-labelledby="privacy-heading">
        <h2 id="privacy-heading">Privacy</h2>
        <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
          Processed documents are temporary by default and automatically deleted. We never sell or share your files.
        </p>
      </section>
    </div>
  );
}
