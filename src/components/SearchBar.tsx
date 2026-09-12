import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchTools, SEARCH_SUGGESTIONS, getTool, type Tool } from "../data/tools";
import { ToolIcon, SearchIcon, X, ArrowRight } from "./icons";
import { CATEGORIES } from "../data/tools";

interface Props {
  placeholder?: string;
  large?: boolean;
  autoFocus?: boolean;
  /** Show dropdown results; false for inline filtering mode (all-tools page) */
  dropdown?: boolean;
  onQueryChange?: (q: string) => void;
  value?: string;
  id?: string;
}

export function SearchBar({ placeholder = "Search for a PDF tool...", large, autoFocus, dropdown = true, onQueryChange, value, id }: Props) {
  const [query, setQuery] = useState(value ?? "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const controlled = value !== undefined;

  const q = controlled ? value! : query;
  const results = useMemo<Tool[]>(() => (q.trim() ? searchTools(q).slice(0, 7) : []), [q]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const go = (slug: string) => {
    setOpen(false);
    navigate(`/tools/${slug}`);
  };

  const setQ = (v: string) => {
    if (!controlled) setQuery(v);
    onQueryChange?.(v);
  };

  return (
    <div className={`searchbar ${large ? "searchbar-lg" : ""}`} ref={wrapRef} role="search">
      <SearchIcon size={19} className="search-icon" />
      <input
        ref={inputRef}
        id={id}
        type="search"
        role="combobox"
        aria-expanded={dropdown && open && results.length > 0}
        aria-controls="search-results-list"
        aria-label="Search tools"
        placeholder={placeholder}
        value={q}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQ(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onKeyDown={(e) => {
          if (!dropdown) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, results.length - 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, -1));
          } else if (e.key === "Enter") {
            if (active >= 0 && results[active]) go(results[active].slug);
            else if (results[0]) go(results[0].slug);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {q && (
        <button className="clear-btn" aria-label="Clear search" onClick={() => { setQ(""); inputRef.current?.focus(); }}>
          <X size={14} />
        </button>
      )}
      {dropdown && open && q.trim() && (
        <div className="search-results" id="search-results-list" role="listbox">
          {results.length > 0 ? (
            results.map((t, i) => (
              <div
                key={t.id}
                role="option"
                aria-selected={i === active}
                className={`sr-item ${i === active ? "active" : ""}`}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(t.slug)}
              >
                <ToolIcon name={t.icon} size={19} />
                <span className="sr-name">{t.name}</span>
                <span className="sr-cat">{CATEGORIES.find((c) => c.id === t.category)?.name}</span>
              </div>
            ))
          ) : (
            <div className="sr-empty">
              <p style={{ fontWeight: 600, fontSize: 14 }}>No tools found for “{q}”</p>
              <p style={{ fontSize: 13, color: "var(--text-tertiary)", marginTop: 4 }}>Try one of these instead:</p>
              <div className="suggestions">
                {SEARCH_SUGGESTIONS.map((slug) => {
                  const t = getTool(slug)!;
                  return (
                    <a key={slug} href={`/tools/${slug}`} onClick={(e) => { e.preventDefault(); go(slug); }}>
                      {t.name}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SearchTerms() {
  const input = document.getElementById("home-search") as HTMLInputElement | null;
  const terms = ["compress", "merge", "PDF to Word", "sign", "OCR"];
  return (
    <p className="search-terms">
      Common searches:{" "}
      {terms.map((t, i) => (
        <span key={t}>
          <button
            onClick={() => {
              if (input) {
                input.value = t;
                input.dispatchEvent(new Event("input", { bubbles: true }));
                input.focus();
              }
            }}
          >
            {t}
          </button>
          {i < terms.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export function PopularSearchRow() {
  const terms = ["compress", "merge", "PDF to Word", "sign", "OCR"];
  const navigate = useNavigate();
  return (
    <p className="search-terms" style={{ textAlign: "center" }}>
      Popular:{" "}
      {terms.map((t, i) => (
        <span key={t}>
          <button onClick={() => navigate(`/tools?q=${encodeURIComponent(t)}`)}>{t}</button>
          {i < terms.length - 1 ? ", " : ""}
        </span>
      ))}
    </p>
  );
}

export { ArrowRight };
