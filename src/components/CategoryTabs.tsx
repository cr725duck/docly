import { CATEGORIES, type CategoryId } from "../data/tools";

export const TAB_ORDER: (CategoryId | "all")[] = [
  "all",
  "popular",
  "convert",
  "edit",
  "organize",
  "compress",
  "security",
  "ocr",
  "create",
  "images",
  "office",
  "compare",
  "ai",
];

export function CategoryTabs({
  active,
  onChange,
  counts,
}: {
  active: CategoryId | "all";
  onChange: (id: CategoryId | "all") => void;
  counts: Record<string, number>;
}) {
  return (
    <div className="cat-tabs" role="tablist" aria-label="Tool categories">
      {TAB_ORDER.map((id) => {
        const label = id === "all" ? "All" : CATEGORIES.find((c) => c.id === id)?.name ?? id;
        return (
          <button
            key={id}
            role="tab"
            aria-selected={active === id}
            className={`cat-tab ${active === id ? "active" : ""}`}
            onClick={() => onChange(id)}
          >
            {label}
            {counts[id] !== undefined && <span style={{ opacity: 0.6, marginLeft: 6, fontWeight: 500 }}>{counts[id]}</span>}
          </button>
        );
      })}
    </div>
  );
}
