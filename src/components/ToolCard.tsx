import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { Tool } from "../data/tools";
import { CATEGORIES } from "../data/tools";
import { ToolIcon, ArrowRight } from "./icons";

export function ToolCard({ tool }: { tool: Tool }) {
  const cat = CATEGORIES.find((c) => c.id === tool.category);
  return (
    <Link
      to={`/tools/${tool.slug}`}
      className="tool-card"
      style={{ "--tc-accent": `var(${cat?.accentVar ?? "--accent"})` } as CSSProperties}
      aria-label={`${tool.name} — ${tool.description}`}
    >
      <div className="tc-top">
        <ToolIcon name={tool.icon} size={24} className="tc-icon" />
        {tool.isNew && (
          <span className="tc-badges">
            <span className="badge badge-new">New</span>
          </span>
        )}
      </div>
      <h3>{tool.name}</h3>
      <p className="tc-desc">{tool.description}</p>
      <ArrowRight size={16} className="tc-arrow" />
    </Link>
  );
}

export function ToolGrid({ tools, cols }: { tools: Tool[]; cols?: 4 | 5 }) {
  return (
    <div className={`tool-grid ${cols === 4 ? "cols-4" : ""}`}>
      {tools.map((t) => (
        <ToolCard key={t.id} tool={t} />
      ))}
    </div>
  );
}

export function ToolGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="tool-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="tool-card" style={{ pointerEvents: "none" }}>
          <div className="skeleton" style={{ width: 24, height: 24 }} />
          <div className="skeleton" style={{ width: "70%", height: 14 }} />
          <div className="skeleton" style={{ width: "90%", height: 11 }} />
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ title, sub, icon }: { title: string; sub?: string; icon?: ReactNode }) {
  return (
    <div className="empty-state">
      {icon}
      <p style={{ fontWeight: 600, color: "var(--text)" }}>{title}</p>
      {sub && <p className="es-sub">{sub}</p>}
    </div>
  );
}
