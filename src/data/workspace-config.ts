/** Per-tool workspace option configuration (rendered by ToolOptions). */
export interface OptionField {
  key: string;
  label: string;
  type: "radio-cards" | "text" | "number" | "select" | "range" | "segmented";
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  step?: number;
  suffix?: string;
  default: string | number;
  placeholder?: string;
  hint?: string;
}

export interface ToolWorkspaceConfig {
  options: OptionField[];
  actionLabel: string;
  accept: string;
  acceptLabel: string;
  multiple?: boolean;
  /** page ranges input (split / extract / delete) */
  pagesInput?: { label: string; placeholder: string; hint: string };
  simulateFailure?: boolean;
}

const COMPRESS_LEVELS: OptionField = {
  key: "level",
  label: "Compression level",
  type: "radio-cards",
  default: "recommended",
  options: [
    { value: "max", label: "Maximum compression" },
    { value: "recommended", label: "Recommended" },
    { value: "high", label: "High quality" },
  ],
};

const ROTATE: OptionField = {
  key: "rotation",
  label: "Rotate",
  type: "segmented",
  default: "90",
  options: [
    { value: "90", label: "90°" },
    { value: "180", label: "180°" },
    { value: "270", label: "270°" },
  ],
};

const WATERMARK: OptionField[] = [
  { key: "text", label: "Watermark text", type: "text", default: "CONFIDENTIAL", placeholder: "Enter text" },
  {
    key: "position",
    label: "Position",
    type: "select",
    default: "center",
    options: [
      { value: "center", label: "Center" },
      { value: "diagonal", label: "Diagonal" },
      { value: "top", label: "Top" },
      { value: "bottom", label: "Bottom" },
      { value: "tiled", label: "Tiled" },
    ],
  },
  { key: "opacity", label: "Opacity", type: "range", default: 40, min: 10, max: 100, step: 5, suffix: "%" },
  { key: "fontSize", label: "Font size", type: "range", default: 48, min: 12, max: 120, step: 2, suffix: "pt" },
];

const PDF_ACCEPT = ".pdf,application/pdf";

const base: ToolWorkspaceConfig = { options: [], actionLabel: "Process PDF", accept: PDF_ACCEPT, acceptLabel: "PDF files up to 100 MB" };

export const WORKSPACE_CONFIGS: Record<string, ToolWorkspaceConfig> = {
  "merge-pdf": { ...base, options: [], actionLabel: "Merge PDF", multiple: true },
  "compress-pdf": { ...base, options: [COMPRESS_LEVELS], actionLabel: "Compress PDF" },
  "split-pdf": {
    ...base,
    options: [
      {
        key: "mode",
        label: "Split mode",
        type: "radio-cards",
        default: "ranges",
        options: [
          { value: "ranges", label: "Custom ranges" },
          { value: "every", label: "Every N pages" },
          { value: "single", label: "One file per page" },
        ],
      },
    ],
    pagesInput: { label: "Page ranges", placeholder: "e.g. 1-3, 5, 8-10", hint: "Separate ranges with commas." },
    actionLabel: "Split PDF",
  },
  "pdf-to-word": { ...base, options: [], actionLabel: "Convert to Word" },
  "pdf-to-jpg": {
    ...base,
    options: [
      { key: "quality", label: "Image quality", type: "segmented", default: "high", options: [{ value: "standard", label: "Standard" }, { value: "high", label: "High" }, { value: "max", label: "Maximum" }] },
    ],
    actionLabel: "Convert to JPG",
  },
  "rotate-pdf": { ...base, options: [ROTATE], actionLabel: "Rotate PDF", },
  "protect-pdf": {
    ...base,
    options: [
      { key: "password", label: "Password", type: "text", default: "", placeholder: "Choose a strong password" },
      { key: "confirm", label: "Confirm password", type: "text", default: "", placeholder: "Repeat password" },
    ],
    actionLabel: "Protect PDF",
  },
  "unlock-pdf": {
    ...base,
    options: [{ key: "password", label: "Current password", type: "text", default: "", placeholder: "Enter the PDF password" }],
    actionLabel: "Unlock PDF",
  },
  "watermark-pdf": { ...base, options: WATERMARK, actionLabel: "Add Watermark", },
  "sign-pdf": { ...base, options: [{ key: "name", label: "Signature name", type: "text", default: "", placeholder: "Your full name" }], actionLabel: "Sign PDF" },
  "ocr-pdf": {
    ...base,
    options: [
      {
        key: "language",
        label: "Recognition language",
        type: "select",
        default: "en",
        options: [
          { value: "en", label: "English" },
          { value: "de", label: "German" },
          { value: "fr", label: "French" },
          { value: "es", label: "Spanish" },
          { value: "zh", label: "Chinese" },
        ],
      },
    ],
    actionLabel: "Run OCR",
  },
  "extract-pages": { ...base, options: [], pagesInput: { label: "Pages to extract", placeholder: "e.g. 2, 5-8", hint: "Only these pages will be kept." }, actionLabel: "Extract Pages", },
  "delete-pages": { ...base, options: [], pagesInput: { label: "Pages to delete", placeholder: "e.g. 4, 9-11", hint: "These pages will be removed." }, actionLabel: "Delete Pages", },
  "compare-pdf": { ...base, options: [], actionLabel: "Compare PDFs", multiple: true },
  "summarize-pdf": { ...base, options: [{ key: "length", label: "Summary length", type: "segmented", default: "short", options: [{ value: "short", label: "Short" }, { value: "medium", label: "Medium" }, { value: "detailed", label: "Detailed" }] }], actionLabel: "Summarize" },
  "chat-pdf": { ...base, options: [{ key: "question", label: "Your question", type: "text", default: "", placeholder: "What is this document about?" }], actionLabel: "Ask PDF" },
};

const FALLBACK: ToolWorkspaceConfig = {
  ...base,
  options: [],
  actionLabel: "Process PDF",
};

export function workspaceConfig(slug: string): ToolWorkspaceConfig {
  return WORKSPACE_CONFIGS[slug] ?? FALLBACK;
}
