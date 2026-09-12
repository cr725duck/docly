import { useEffect, useRef, useState } from "react";
import { ToolIcon, DragHandle, DotsVertical, Eye, X, UploadCloud } from "./icons";
import { formatSize, isValidPdf, MAX_FILE_SIZE } from "../lib/format";
import { useToast } from "./Toast";
import { Modal } from "./Modal";

export interface WorkFile extends File {
  pages: number;
}


/* ---------------- UploadZone ---------------- */

export function UploadZone({
  onFiles,
  accept,
  acceptLabel,
  multiple,
  compact,
}: {
  onFiles: (files: File[]) => void;
  accept: string;
  acceptLabel: string;
  multiple?: boolean;
  compact?: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const depth = useRef(0);

  const handleFiles = (list: FileList | null) => {
    if (!list?.length) return;
    const files = Array.from(list);
    const invalid = files.filter((f) => !isValidPdf(f));
    const tooBig = files.filter((f) => f.size > MAX_FILE_SIZE);
    const ok = files.filter((f) => isValidPdf(f) && f.size <= MAX_FILE_SIZE);
    if (invalid.length) toast(`“${invalid[0].name}” doesn't appear to be a valid PDF.`, "error");
    if (tooBig.length) toast(`“${tooBig[0].name}” exceeds the 100 MB limit.`, "error");
    if (ok.length) onFiles(multiple ? ok : ok.slice(0, 1));
  };

  return (
    <div
      className={`upload-zone ${dragging ? "dragover" : ""}`}
      role="button"
      tabIndex={0}
      aria-label="Upload files"
      style={compact ? { padding: "var(--sp-6)" } : undefined}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
      onDragEnter={(e) => {
        e.preventDefault();
        depth.current++;
        setDragging(true);
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={() => {
        depth.current--;
        if (depth.current <= 0) setDragging(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        depth.current = 0;
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <div className="uz-icon">
        <UploadCloud size={26} />
      </div>
      <p className="uz-title">Drop your files here</p>
      <p className="uz-or">or</p>
      <button
        type="button"
        className="btn btn-secondary"
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.click();
        }}
      >
        Choose files
      </button>
      <p className="uz-limit">{acceptLabel}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="visually-hidden"
        aria-hidden="true"
        tabIndex={-1}
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

/* ---------------- FileList / FileRow ---------------- */

export function FileList({
  files,
  onChange,
  reorderable = true,
}: {
  files: WorkFile[];
  onChange: (files: WorkFile[]) => void;
  reorderable?: boolean;
}) {
  const dragIndex = useRef<number | null>(null);
  const [dragging, setDragging] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [preview, setPreview] = useState<WorkFile | null>(null);
  const [menuFor, setMenuFor] = useState<WorkFile | null>(null);
  const toast = useToast();

  const remove = (i: number) => onChange(files.filter((_, idx) => idx !== i));

  const move = (from: number, to: number) => {
    if (to < 0 || to >= files.length || from === to) return;
    const next = [...files];
    const [f] = next.splice(from, 1);
    next.splice(to, 0, f);
    onChange(next);
  };

  return (
    <ul className="file-list" aria-label="Uploaded files">
      {files.map((f, i) => (
        <li
          key={`${f.name}-${f.lastModified}-${i}`}
          className={`file-row ${dragging === i ? "dragging" : ""} ${overIndex === i ? "drop-target" : ""}`}
          draggable={reorderable}
          onDragStart={(e) => {
            dragIndex.current = i;
            setDragging(i);
            e.dataTransfer.effectAllowed = "move";
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (overIndex !== i) setOverIndex(i);
          }}
          onDrop={(e) => {
            e.preventDefault();
            if (dragIndex.current !== null) move(dragIndex.current, i);
            dragIndex.current = null;
            setDragging(null);
            setOverIndex(null);
          }}
          onDragEnd={() => {
            setDragging(null);
            setOverIndex(null);
            dragIndex.current = null;
          }}
        >
          {reorderable && (
            <span className="drag-handle" title="Drag to reorder" aria-hidden="true">
              <DragHandle size={18} />
            </span>
          )}
          <span className="file-thumb" aria-hidden="true">
            PDF
          </span>
          <div className="file-meta">
            <p className="file-name">{f.name}</p>
            <p className="file-sub">
              {f.pages} pages · {formatSize(f.size)}
            </p>
          </div>
          <button className="icon-btn" aria-label={`Preview ${f.name}`} onClick={() => setPreview(f)}>
            <Eye size={17} />
          </button>
          <button className="icon-btn" aria-label={`More actions for ${f.name}`} onClick={() => setMenuFor(f)}>
            <DotsVertical size={17} />
          </button>
          <button className="icon-btn danger" aria-label={`Remove ${f.name}`} onClick={() => remove(i)}>
            <X size={17} />
          </button>
        </li>
      ))}

      {preview && (
        <Modal title={preview.name} onClose={() => setPreview(null)}>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            {preview.pages} pages · {formatSize(preview.size)}. A full page-by-page preview opens here once the
            rendering service is connected.
          </p>
          <div className="pdf-preview" style={{ marginTop: 16 }}>
            <div className="preview-main">
              <div className="preview-page" aria-hidden="true">
                <div className="pp-title" />
                <div className="pp-line w80" />
                <div className="pp-line" />
                <div className="pp-line w60" />
                <div className="pp-line" />
                <div className="pp-line w80" />
                <div className="pp-line w60" />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {menuFor && (
        <Modal title="File actions" onClose={() => setMenuFor(null)}>
          <p style={{ fontSize: 14, color: "var(--text-secondary)" }}>
            More actions for <strong>{menuFor.name}</strong> — rotate, duplicate or split this file — arrive with the
            processing backend.
          </p>
          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={() => { setMenuFor(null); toast("Added to quick actions"); }}>
              Rotate file
            </button>
            <button className="btn btn-primary" onClick={() => setMenuFor(null)}>
              Done
            </button>
          </div>
        </Modal>
      )}
    </ul>
  );
}

/* ---------------- ToolOptions ---------------- */

import { workspaceConfig, type ToolWorkspaceConfig } from "../data/workspace-config";

export function ToolOptions({
  slug,
  values,
  onChange,
}: {
  slug: string;
  values: Record<string, string | number>;
  onChange: (key: string, value: string | number) => void;
}) {
  const cfg: ToolWorkspaceConfig = workspaceConfig(slug);
  if (!cfg.options.length && !cfg.pagesInput) return null;

  const setValue = (key: string, v: string | number) => onChange(key, v);

  return (
    <div className="tool-options">
      <h3>Options</h3>
      {cfg.options.map((f) => (
        <div className="opt-group" key={f.key}>
          {f.type !== "segmented" && (
            <label className="opt-label" htmlFor={`opt-${f.key}`}>
              {f.label}
            </label>
          )}
          {f.type === "radio-cards" && (
            <div className="radio-cards" role="radiogroup" aria-label={f.label}>
              {f.options!.map((o) => (
                <button
                  type="button"
                  key={o.value}
                  role="radio"
                  aria-checked={values[f.key] === o.value}
                  className={`radio-card ${values[f.key] === o.value ? "selected" : ""}`}
                  onClick={() => setValue(f.key, o.value)}
                >
                  <span className="radio-dot" aria-hidden="true" />
                  {o.label}
                </button>
              ))}
            </div>
          )}
          {f.type === "segmented" && (
            <div>
              <span className="opt-label" style={{ display: "block", fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>
                {f.label}
              </span>
              <div className="segmented" role="radiogroup" aria-label={f.label}>
                {f.options!.map((o) => (
                  <button
                    type="button"
                    key={o.value}
                    role="radio"
                    aria-checked={values[f.key] === o.value}
                    className={values[f.key] === o.value ? "active" : ""}
                    onClick={() => setValue(f.key, o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {(f.type === "text" || f.type === "number") && (
            <input
              id={`opt-${f.key}`}
              className="text-input"
              type={f.type}
              placeholder={f.placeholder}
              value={values[f.key] ?? ""}
              onChange={(e) => setValue(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)}
            />
          )}
          {f.type === "select" && (
            <select id={`opt-${f.key}`} className="select-input" value={values[f.key] ?? f.default} onChange={(e) => setValue(f.key, e.target.value)}>
              {f.options!.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          )}
          {f.type === "range" && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <input
                id={`opt-${f.key}`}
                className="range-input"
                type="range"
                min={f.min}
                max={f.max}
                step={f.step}
                value={values[f.key] ?? f.default}
                onChange={(e) => setValue(f.key, Number(e.target.value))}
              />
              <span style={{ fontSize: 13, color: "var(--text-secondary)", minWidth: 48, textAlign: "right" }}>
                {values[f.key] ?? f.default}
                {f.suffix}
              </span>
            </div>
          )}
          {f.hint && <p className="field-hint">{f.hint}</p>}
        </div>
      ))}
      {cfg.pagesInput && (
        <div className="opt-group">
          <label className="opt-label" htmlFor="pages-input">
            {cfg.pagesInput.label}
          </label>
          <input id="pages-input" className="text-input" placeholder={cfg.pagesInput.placeholder} onChange={(e) => setValue("pages", e.target.value)} />
          <p className="field-hint">{cfg.pagesInput.hint}</p>
        </div>
      )}
    </div>
  );
}

/* ---------------- ProcessingState ---------------- */

import { PROCESS_STAGES } from "../lib/api";

export function ProcessingState({ progress, stage }: { progress: number; stage?: string }) {
  const currentIdx = PROCESS_STAGES.indexOf(stage ?? "");
  return (
    <div className="processing" role="status">
      <h3>Processing your PDF</h3>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Processing progress"
      >
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="process-steps">
        {PROCESS_STAGES.map((s, i) => (
          <div key={s} className={`process-step ${i < currentIdx || progress >= 100 ? "done" : i === currentIdx ? "active" : ""}`}>
            <span className="step-dot" aria-hidden="true" />
            {s}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- PDFPreview ---------------- */

export function PDFPreview({ pageCount = 12 }: { pageCount?: number }) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const visible = Math.min(pageCount, 8);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPage((p) => Math.min(p + 1, pageCount));
      if (e.key === "ArrowLeft") setPage((p) => Math.max(p - 1, 1));
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [pageCount]);

  return (
    <div className="pdf-preview">
      <div className="preview-main">
        <div
          className="preview-page"
          style={{ rotate: `${rotation}deg`, scale: String(zoom / 100) }}
          aria-label={`Page ${page} preview`}
        >
          <div className="pp-title" />
          {Array.from({ length: 7 }, (_, i) => (
            <div key={i} className={`pp-line ${i % 3 === 2 ? "w60" : i % 2 ? "w80" : ""}`} />
          ))}
        </div>
      </div>
      <div className="preview-thumbs" aria-label="Page thumbnails">
        {Array.from({ length: visible }, (_, i) => (
          <button
            key={i}
            className={`preview-thumb ${page === i + 1 ? "active" : ""}`}
            aria-label={`Go to page ${i + 1}`}
            aria-current={page === i + 1}
            onClick={() => setPage(i + 1)}
          >
            {Array.from({ length: 4 }, (_, j) => (
              <span key={j} className="pt-line" />
            ))}
          </button>
        ))}
      </div>
      <div className="preview-controls">
        <button className="icon-btn" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(60, z - 10))}>
          <span aria-hidden="true" style={{ fontSize: 17, fontWeight: 700 }}>−</span>
        </button>
        <span className="page-ind">{zoom}%</span>
        <button className="icon-btn" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(160, z + 10))}>
          <span aria-hidden="true" style={{ fontSize: 17, fontWeight: 700 }}>+</span>
        </button>
        <span aria-hidden="true" style={{ width: 1, height: 22, background: "var(--border)" }} />
        <button className="icon-btn" aria-label="Rotate page" onClick={() => setRotation((r) => (r + 90) % 360)}>
          <ToolIcon name="rotate" size={17} />
        </button>
        <span className="page-ind">
          Page {page} of {pageCount}
        </span>
        <button className="icon-btn" aria-label="Previous page" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <span aria-hidden="true" style={{ fontSize: 16 }}>‹</span>
        </button>
        <button className="icon-btn" aria-label="Next page" onClick={() => setPage((p) => Math.min(pageCount, p + 1))} disabled={page === pageCount}>
          <span aria-hidden="true" style={{ fontSize: 16 }}>›</span>
        </button>
      </div>
    </div>
  );
}
