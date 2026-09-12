import { useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getTool, CATEGORIES, TOOLS, type Tool } from "../data/tools";
import { workspaceConfig } from "../data/workspace-config";
import { UploadZone, FileList, ToolOptions, ProcessingState, type WorkFile } from "../components/workspace";
import { Modal } from "../components/Modal";
import { ToolGrid } from "../components/ToolCard";
import { AlertTriangle, Check, ArrowRight, ChevronDown } from "../components/icons";
import { useToast } from "../components/Toast";
import { formatSize } from "../lib/format";
import { createSimulatedJob, PROCESS_STAGES, api } from "../lib/api";

type Phase = "upload" | "ready" | "processing" | "done" | "error";

const FAQS: Record<string, { q: string; a: string }[]> = {
  default: [
    { q: "Is DOCly really free?", a: "Yes — DOCly is free and open source under the MIT license. Every tool is unlimited, with no accounts, ads or usage caps." },
    { q: "How long are my files kept?", a: "Files are processed temporarily and automatically deleted shortly after your task finishes. Nothing is retained unnecessarily." },
    { q: "Do I need to install anything?", a: "No. DOCly runs entirely in your browser and works on desktop, tablet and mobile. You can also self-host it with a single Docker command." },
    { q: "Can I run DOCly on my own server?", a: "Absolutely. The whole stack ships as a Docker image, so your documents never have to leave your network." },
  ],
  "merge-pdf": [
    { q: "In what order are files merged?", a: "Files are merged top to bottom exactly as shown in the file list. Drag the handles to reorder them before merging." },
    { q: "Are bookmarks and links preserved?", a: "Yes, internal links and page-level structure survive the merge wherever the source PDFs contain them." },
    { q: "Is there a limit to how many files I can merge?", a: "No — merge as many files as you like. The practical limit is your device's memory when self-hosting large batches." },
  ],
  "compress-pdf": [
    { q: "Will compression reduce image quality?", a: "Recommended mode balances size and quality. High quality mode keeps images visually near-identical, while maximum compression prioritizes the smallest file." },
    { q: "How much smaller will my PDF be?", a: "It depends on the content — image-heavy PDFs often shrink by 60–80%, while text-only PDFs may shrink less." },
  ],
  "protect-pdf": [
    { q: "What encryption is used?", a: "PDFs are encrypted with strong AES-256 encryption, the modern standard for document protection." },
    { q: "Can I remove the password later?", a: "Yes — use the Unlock PDF tool with the password you set here." },
  ],
};

const HOW_IT_WORKS: Record<string, string[]> = {
  default: ["Upload your PDF", "Choose your options", "Process the document", "Download the result"],
  "merge-pdf": ["Upload your PDFs", "Arrange the order", "Merge into one file", "Download the result"],
  "split-pdf": ["Upload your PDF", "Pick pages or ranges", "Split the document", "Download the parts"],
  "compress-pdf": ["Upload your PDF", "Pick a compression level", "Optimize the document", "Download the smaller file"],
};

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="faq-list">
      {items.map((f, i) => (
        <div className="faq-item" key={f.q}>
          <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
            {f.q}
            <ChevronDown size={16} className="chev" />
          </button>
          {open === i && <div className="faq-a">{f.a}</div>}
        </div>
      ))}
    </div>
  );
}

export function ToolPage() {
  const { slug } = useParams();
  const tool = getTool(slug);
  const toast = useToast();
  const cfg = useMemo(() => workspaceConfig(slug ?? ""), [slug]);

  const [phase, setPhase] = useState<Phase>("upload");
  const [files, setFiles] = useState<WorkFile[]>([]);
  const [options, setOptions] = useState<Record<string, string | number>>(() =>
    Object.fromEntries(workspaceConfig(slug ?? "").options.map((o) => [o.key, o.default])),
  );
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>();
  const [error, setError] = useState<string>();
  const [resultName, setResultName] = useState("");
  const [beforeSize, setBeforeSize] = useState(0);
  const [afterSize, setAfterSize] = useState(0);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const cancelRef = useRef<(() => void) | null>(null);

  if (!tool) {
    return (
      <div className="container page" style={{ textAlign: "center" }}>
        <h1 className="page-title">Tool not found</h1>
        <p className="page-sub" style={{ marginBottom: 24 }}>
          The tool you're looking for doesn't exist (yet).
        </p>
        <Link to="/tools" className="btn btn-primary">
          Browse all tools
        </Link>
      </div>
    );
  }

  const minFiles = tool.minFiles ?? 1;
  const cat = CATEGORIES.find((c) => c.id === tool.category)!;
  const canRun = files.length >= minFiles && (!cfg.pagesInput || !!options.pages) &&
    (tool.slug !== "protect-pdf" || (!!options.password && options.password === options.confirm));

  const addFiles = (list: File[]) => {
    const wf = list.map((f) => {
      const w = f as WorkFile;
      w.pages = w.pages ?? 4 + ((f.name.length * 7 + f.size) % 42);
      return w;
    });
    setFiles((prev) => (tool.supportsMultipleFiles ? [...prev, ...wf] : wf.slice(0, 1)));
    setPhase("ready");
    setPhaseSafe();
  };

  const setPhaseSafe = () => setError(undefined);

  const start = () => {
    setPhase("processing");
    setProgress(0);
    setStage(PROCESS_STAGES[0]);
    cancelRef.current = createSimulatedJob(
      (status) => {
        setProgress(status.progress);
        setStage(status.stage);
        if (status.state === "done") {
          const before = files.reduce((s, f) => s + f.size, 0);
          const after = Math.round(before * (0.18 + ((before % 3000) / 3000) * 0.4));
          setBeforeSize(before);
          setAfterSize(after);
          setResultName(files.length === 1 ? outputName(files[0].name, tool) : `${tool.slug}-output.pdf`);
          setPhase("done");
          toast("Your document is ready");
        } else if (status.state === "error") {
          setError(status.error?.message);
          setPhase("error");
          setShowErrorModal(true);
        }
      },
      { failAfterStage: slug === "repair-pdf" ? 2 : undefined },
    );
  };

  const reset = () => {
    cancelRef.current?.();
    setFiles([]);
    setProgress(0);
    setError(undefined);
    setPhase("upload");
  };

  const related = TOOLS.filter((t) => t.id !== tool.id && (t.category === tool.category || t.popular)).slice(0, 4);
  const faq = FAQS[tool.slug] ?? FAQS.default;
  const steps = HOW_IT_WORKS[tool.slug] ?? HOW_IT_WORKS.default;

  return (
    <div className="container page" style={{ paddingTop: "var(--sp-6)" }}>
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/">PDF Tools</Link>
        <span className="sep" aria-hidden="true">/</span>
        <Link to={`/tools?category=${tool.category}`}>{cat.name}</Link>
        <span className="sep" aria-hidden="true">/</span>
        <span className="current">{tool.name}</span>
      </nav>

      <div className="tool-hero" style={{ textAlign: "center" }}>
        <h1>{tool.name}</h1>
        <p className="desc">{tool.description}</p>
      </div>

      {/* Workspace */}
      <section className="workspace" aria-label={`${tool.name} workspace`}>
        {(phase === "upload" || phase === "ready") && (
          <>
            {phase === "upload" || files.length === 0 ? (
              <UploadZone
                onFiles={addFiles}
                accept={cfg.accept}
                acceptLabel={cfg.acceptLabel}
                multiple={tool.supportsMultipleFiles || cfg.multiple}
              />
            ) : (
              <>
                <FileList files={files} onChange={setFiles} reorderable={tool.supportsMultipleFiles} />
                <p style={{ marginTop: 12, textAlign: "center" }}>
                  <button className="btn btn-ghost btn-sm" onClick={() => setPhase("upload")}>
                    + Add more files
                  </button>
                </p>
              </>
            )}
            {phase === "ready" && files.length > 0 && (
              <>
                <ToolOptions slug={tool.slug} values={options} onChange={(k, v) => setOptions((o) => ({ ...o, [k]: v }))} />
                <div className="workspace-actions">
                  <button className="btn btn-primary btn-lg" onClick={start} disabled={!canRun} style={{ minWidth: 260 }}>
                    {cfg.actionLabel}
                  </button>
                  {tool.supportsMultipleFiles && files.length < minFiles && (
                    <p className="workspace-hint">Add at least {minFiles} files to continue.</p>
                  )}
                  {tool.slug === "protect-pdf" && options.password && options.password !== options.confirm && (
                    <p className="workspace-hint" style={{ color: "var(--error)" }}>
                      Passwords don't match.
                    </p>
                  )}
                </div>
              </>
            )}
          </>
        )}

        {phase === "processing" && <ProcessingState progress={progress} stage={stage} />}

        {phase === "done" && (
          <div className="result">
            <div className="result-icon">
              <Check size={30} />
            </div>
            <h3>Your PDF is ready</h3>
            <p className="result-file">{resultName}</p>
            <p className="result-meta">
              {files.reduce((s, f) => s + f.pages, 0)} pages ·{" "}
              {slug === "compress-pdf" ? (
                <>
                  {formatSize(beforeSize)} → <span className="delta">{formatSize(afterSize)}</span>
                </>
              ) : (
                formatSize(afterSize)
              )}
            </p>
            <div className="result-actions">
              <button className="btn btn-primary btn-lg" onClick={() => api.downloadFile("result", resultName)}>
                Download PDF
              </button>
              <button className="btn btn-secondary" onClick={reset}>
                Process another
              </button>
            </div>
            <div className="result-extra">
              <button onClick={() => toast("File deleted from our servers")}>Delete file</button>
            </div>
            <div className="next-tools">
              <h4>Continue with</h4>
              <div className="next-tools-links">
                {["compress-pdf", "pdf-to-word", "protect-pdf"]
                  .filter((s) => s !== tool.slug)
                  .map((s) => {
                    const t = getTool(s)!;
                    return (
                      <Link key={s} to={`/tools/${s}`}>
                        {t.name} <ArrowRight size={13} />
                      </Link>
                    );
                  })}
              </div>
            </div>
          </div>
        )}

        {phase === "error" && !showErrorModal && (
          <div className="error-state">
            <div className="error-icon">
              <AlertTriangle size={26} />
            </div>
            <h3>Processing failed</h3>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={start}>
              Try again
            </button>
          </div>
        )}
      </section>

      {showErrorModal && error && (
        <Modal title="Processing failed" onClose={() => setShowErrorModal(false)}>
          <p>{error}</p>
          <div className="modal-actions">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowErrorModal(false);
                setPhase("ready");
              }}
            >
              Back to files
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                setShowErrorModal(false);
                start();
              }}
            >
              Try again
            </button>
          </div>
        </Modal>
      )}

      {/* How it works */}
      <section className="howitworks detail-sections" aria-labelledby="hiw-heading">
        <div className="section-head" style={{ textAlign: "center" }}>
          <h2 id="hiw-heading" style={{ fontSize: 22 }}>
            How it works
          </h2>
        </div>
        <div className="hiw-grid">
          {steps.map((s, i) => (
            <div className="hiw-step" key={s}>
              <span className="step-num">{i + 1}</span>
              <h4>{s}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="faq" aria-labelledby="faq-heading">
        <div className="section-head" style={{ textAlign: "center" }}>
          <h2 id="faq-heading" style={{ fontSize: 22 }}>
            Frequently asked questions
          </h2>
        </div>
        <Faq items={faq} />
      </section>

      {/* Related tools */}
      <section className="related-tools" aria-labelledby="related-heading">
        <div className="section-head">
          <h2 id="related-heading" style={{ fontSize: 22 }}>
            Related tools
          </h2>
        </div>
        <ToolGrid tools={related} />
      </section>
    </div>
  );
}

function outputName(original: string, tool: Tool) {
  const base = original.replace(/\.pdf$/i, "");
  const suffix: Record<string, string> = {
    "compress-pdf": "compressed",
    "merge-pdf": "merged",
    "split-pdf": "split",
    "rotate-pdf": "rotated",
    "protect-pdf": "protected",
    "unlock-pdf": "unlocked",
  };
  return `${base}-${suffix[tool.slug] ?? tool.slug}.pdf`;
}
