import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { CATEGORIES, TOOLS, searchTools, type CategoryId } from "../data/tools";
import { SearchBar } from "../components/SearchBar";
import { CategoryTabs, TAB_ORDER } from "../components/CategoryTabs";
import { ToolGrid, ToolGridSkeleton, EmptyState } from "../components/ToolCard";

export function AllToolsPage() {
  const [params, setParams] = useSearchParams();
  const initialCat = (params.get("category") as CategoryId) ?? "all";
  const [category, setCategory] = useState<CategoryId | "all">(TAB_ORDER.includes(initialCat) ? initialCat : "all");
  const [query, setQuery] = useState(params.get("q") ?? "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const id of TAB_ORDER) {
      if (id === "all") c[id] = TOOLS.length;
      else if (id === "popular") c[id] = TOOLS.filter((t) => t.popular).length;
      else c[id] = TOOLS.filter((t) => t.category === id).length;
    }
    return c;
  }, []);

  const tools = useMemo(() => {
    let list = TOOLS;
    if (query.trim()) {
      list = searchTools(query);
      if (category !== "all") list = list.filter((t) => t.category === category || t.popular);
    } else if (category !== "all") {
      list = category === "popular" ? TOOLS.filter((t) => t.popular) : TOOLS.filter((t) => t.category === category);
    }
    return list;
  }, [query, category]);

  const setCat = (id: CategoryId | "all") => {
    setCategory(id);
    const next = new URLSearchParams(params);
    if (id === "all") next.delete("category");
    else next.set("category", id);
    setParams(next, { replace: true });
  };

  const activeCatName = category === "all" ? null : CATEGORIES.find((c) => c.id === category);

  return (
    <div className="container page">
      <header className="section-head" style={{ textAlign: "center", marginBottom: "var(--sp-6)" }}>
        <h1 className="page-title">All PDF tools</h1>
        <p style={{ margin: "0 auto" }}>{TOOLS.length} focused tools. Search, filter, and get it done.</p>
      </header>
      <div style={{ maxWidth: 560, margin: "0 auto var(--sp-8)" }}>
        <SearchBar dropdown={false} value={query} onQueryChange={setQuery} placeholder="Filter tools by name or task..." />
      </div>

      <CategoryTabs active={category} onChange={setCat} counts={counts} />

      {activeCatName && !query && (
        <p style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: "var(--sp-6)" }}>
          {activeCatName.description}
        </p>
      )}

      <div className="tools-toolbar" aria-live="polite">
        <span className="result-count">
          {loading ? "Loading tools…" : `${tools.length} ${tools.length === 1 ? "tool" : "tools"}${query ? ` for “${query}”` : ""}`}
        </span>
      </div>

      {loading ? (
        <ToolGridSkeleton count={10} />
      ) : tools.length > 0 ? (
        <ToolGrid tools={tools} />
      ) : (
        <EmptyState
          title={`No tools found for “${query}”`}
          sub="Try a different term — for example “merge”, “compress” or “sign”."
          icon={
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="es-icon">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
          }
        />
      )}
    </div>
  );
}
