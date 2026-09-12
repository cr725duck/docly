export type CategoryId =
  | "popular"
  | "convert"
  | "edit"
  | "organize"
  | "compress"
  | "security"
  | "ocr"
  | "create"
  | "images"
  | "office"
  | "compare"
  | "ai";

export interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: CategoryId;
  icon: string;
  keywords: string[];
  popular?: boolean;
  isNew?: boolean;
  supportsMultipleFiles?: boolean;
  supportsPreview?: boolean;
  /** Minimum number of files the tool needs before the primary action enables */
  minFiles?: number;
  /** Primary action label override, defaults to name */
  actionLabel?: string;
}

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  accentVar: string;
}

export const CATEGORIES: Category[] = [
  { id: "popular", name: "Popular", description: "The tools people reach for most.", accentVar: "--cat-popular" },
  { id: "convert", name: "Convert", description: "Turn PDFs into other formats — and back.", accentVar: "--cat-convert" },
  { id: "edit", name: "Edit", description: "Change content, add notes and make it yours.", accentVar: "--cat-edit" },
  { id: "organize", name: "Organize", description: "Rearrange, merge and shape your documents.", accentVar: "--cat-organize" },
  { id: "compress", name: "Compress & Optimize", description: "Smaller files without losing quality.", accentVar: "--cat-compress" },
  { id: "security", name: "Security & Privacy", description: "Protect, sign and control access.", accentVar: "--cat-security" },
  { id: "ocr", name: "OCR & Scan", description: "Make scanned documents searchable.", accentVar: "--cat-ocr" },
  { id: "create", name: "Create", description: "Build PDFs from scratch or other files.", accentVar: "--cat-create" },
  { id: "images", name: "Images", description: "Work between images and documents.", accentVar: "--cat-images" },
  { id: "office", name: "Office", description: "Bridge PDF with your office suite.", accentVar: "--cat-office" },
  { id: "compare", name: "Compare", description: "Spot every difference between versions.", accentVar: "--cat-compare" },
  { id: "ai", name: "AI PDF", description: "Understand and question your documents.", accentVar: "--cat-ai" },
];

export const TOOLS: Tool[] = [
  // ---------- Popular ----------
  {
    id: "merge-pdf", slug: "merge-pdf", name: "Merge PDF", category: "organize", icon: "merge",
    description: "Combine multiple PDFs into one document.",
    keywords: ["combine", "join", "merge", "concatenate", "pdf"],
    popular: true, supportsMultipleFiles: true, supportsPreview: true, minFiles: 2,
  },
  {
    id: "compress-pdf", slug: "compress-pdf", name: "Compress PDF", category: "compress", icon: "compress",
    description: "Reduce PDF file size while keeping quality.",
    keywords: ["reduce size", "shrink", "compress", "smaller", "optimize"],
    popular: true, supportsPreview: true,
  },
  {
    id: "pdf-to-word", slug: "pdf-to-word", name: "PDF to Word", category: "convert", icon: "word",
    description: "Convert PDFs into editable Word documents.",
    keywords: ["docx", "word", "convert", "editable", "office"],
    popular: true,
  },
  {
    id: "pdf-to-jpg", slug: "pdf-to-jpg", name: "PDF to JPG", category: "images", icon: "image",
    description: "Turn each PDF page into a JPG image.",
    keywords: ["jpg", "jpeg", "image", "photo", "convert", "export"],
    popular: true,
  },
  {
    id: "split-pdf", slug: "split-pdf", name: "Split PDF", category: "organize", icon: "split",
    description: "Extract pages or divide a PDF into parts.",
    keywords: ["divide", "extract", "separate", "split", "cut"],
    popular: true, supportsPreview: true,
  },
  {
    id: "sign-pdf", slug: "sign-pdf", name: "Sign PDF", category: "security", icon: "sign",
    description: "Add signatures and initials to documents.",
    keywords: ["signature", "sign", "initial", "e-sign", "contract"],
    popular: true,
  },
  {
    id: "ocr-pdf", slug: "ocr-pdf", name: "OCR PDF", category: "ocr", icon: "ocr",
    description: "Make scanned PDFs searchable and selectable.",
    keywords: ["ocr", "scan", "searchable", "recognize", "text"],
    popular: true,
  },
  {
    id: "protect-pdf", slug: "protect-pdf", name: "Protect PDF", category: "security", icon: "lock",
    description: "Encrypt PDFs with a password.",
    keywords: ["password", "protect", "encrypt", "secure", "lock"],
    popular: true,
  },

  // ---------- Convert ----------
  { id: "pdf-to-excel", slug: "pdf-to-excel", name: "PDF to Excel", category: "convert", icon: "excel", description: "Convert PDF tables into Excel spreadsheets.", keywords: ["excel", "xlsx", "spreadsheet", "tables", "convert"] },
  { id: "pdf-to-powerpoint", slug: "pdf-to-powerpoint", name: "PDF to PowerPoint", category: "convert", icon: "powerpoint", description: "Convert PDFs into editable slides.", keywords: ["powerpoint", "pptx", "slides", "presentation", "convert"] },
  { id: "word-to-pdf", slug: "word-to-pdf", name: "Word to PDF", category: "office", icon: "word", description: "Convert Word documents into PDFs.", keywords: ["docx", "word", "office", "convert", "create"] },
  { id: "excel-to-pdf", slug: "excel-to-pdf", name: "Excel to PDF", category: "office", icon: "excel", description: "Convert spreadsheets into clean PDFs.", keywords: ["excel", "xlsx", "office", "convert", "create"] },
  { id: "powerpoint-to-pdf", slug: "powerpoint-to-pdf", name: "PowerPoint to PDF", category: "office", icon: "powerpoint", description: "Turn presentations into shareable PDFs.", keywords: ["powerpoint", "pptx", "slides", "office", "convert"] },
  { id: "pdf-to-png", slug: "pdf-to-png", name: "PDF to PNG", category: "images", icon: "image", description: "Export PDF pages as lossless PNG images.", keywords: ["png", "image", "export", "convert", "lossless"] },
  { id: "pdf-to-text", slug: "pdf-to-text", name: "PDF to Text", category: "convert", icon: "text", description: "Extract plain text content from a PDF.", keywords: ["text", "txt", "extract", "plain", "convert"] },
  { id: "html-to-pdf", slug: "html-to-pdf", name: "HTML to PDF", category: "create", icon: "code", description: "Convert a web page into a polished PDF.", keywords: ["html", "web", "webpage", "url", "create"] },

  // ---------- Edit ----------
  { id: "edit-pdf", slug: "edit-pdf", name: "Edit PDF", category: "edit", icon: "edit", description: "Change text, shapes and images in place.", keywords: ["edit", "modify", "change", "text", "rewrite"], supportsPreview: true },
  { id: "annotate-pdf", slug: "annotate-pdf", name: "Annotate PDF", category: "edit", icon: "annotate", description: "Add comments, highlights and drawings.", keywords: ["comment", "highlight", "note", "markup", "review"], supportsPreview: true },
  { id: "watermark-pdf", slug: "watermark-pdf", name: "Watermark", category: "edit", icon: "watermark", description: "Stamp text or images across your PDF.", keywords: ["watermark", "stamp", "brand", "copyright", "overlay"], supportsPreview: true },
  { id: "crop-pdf", slug: "crop-pdf", name: "Crop PDF", category: "edit", icon: "crop", description: "Trim margins and adjust the page view.", keywords: ["crop", "trim", "margins", "resize", "cut"], supportsPreview: true },
  { id: "redact-pdf", slug: "redact-pdf", name: "Redact PDF", category: "security", icon: "redact", description: "Permanently remove sensitive content.", keywords: ["redact", "hide", "remove", "sensitive", "black out"], supportsPreview: true },
  { id: "page-numbers", slug: "page-numbers", name: "Page Numbers", category: "edit", icon: "hash", description: "Insert page numbers into your document.", keywords: ["numbers", "pagination", "footer", "header", "numbering"], supportsPreview: true },
  { id: "header-footer", slug: "header-footer", name: "Header & Footer", category: "edit", icon: "layout", description: "Add consistent headers and footers.", keywords: ["header", "footer", "title", "date", "layout"] },

  // ---------- Organize ----------
  { id: "rotate-pdf", slug: "rotate-pdf", name: "Rotate PDF", category: "organize", icon: "rotate", description: "Rotate pages to the right orientation.", keywords: ["rotate", "turn", "orientation", "landscape", "portrait"], supportsPreview: true },
  { id: "delete-pages", slug: "delete-pages", name: "Delete Pages", category: "organize", icon: "trash", description: "Remove pages you no longer need.", keywords: ["delete", "remove", "pages", "drop", "cut"], supportsPreview: true },
  { id: "extract-pages", slug: "extract-pages", name: "Extract Pages", category: "organize", icon: "extract", description: "Pull selected pages into a new PDF.", keywords: ["extract", "select", "pick", "pages", "subset"], supportsPreview: true },
  { id: "reorder-pages", slug: "reorder-pages", name: "Reorder Pages", category: "organize", icon: "sort", description: "Rearrange pages with drag and drop.", keywords: ["reorder", "rearrange", "sort", "move", "drag"], supportsPreview: true },
  { id: "organize-pdf", slug: "organize-pdf", name: "Organize PDF", category: "organize", icon: "organize", description: "Merge, split, reorder and delete in one place.", keywords: ["organize", "manage", "arrange", "all in one", "workbench"] },

  // ---------- Compress & Optimize ----------
  { id: "optimize-pdf", slug: "optimize-pdf", name: "Optimize PDF", category: "compress", icon: "optimize", description: "Strip bloat and streamline PDF internals.", keywords: ["optimize", "clean", "streamline", "web", "fast"] },
  { id: "repair-pdf", slug: "repair-pdf", name: "Repair PDF", category: "compress", icon: "wrench", description: "Recover data from damaged PDF files.", keywords: ["repair", "fix", "recover", "damaged", "corrupt"] },
  { id: "flatten-pdf", slug: "flatten-pdf", name: "Flatten PDF", category: "security", icon: "layers", description: "Merge layers and forms into static pages.", keywords: ["flatten", "layers", "forms", "static", "merge"], isNew: true },

  // ---------- Security & Privacy ----------
  { id: "unlock-pdf", slug: "unlock-pdf", name: "Unlock PDF", category: "security", icon: "unlock", description: "Remove password protection from PDFs.", keywords: ["unlock", "remove password", "decrypt", "open", "access"] },
  { id: "certify-pdf", slug: "certify-pdf", name: "Certify PDF", category: "security", icon: "certificate", description: "Add a certified digital signature.", keywords: ["certify", "certificate", "digital signature", "validate", "trust"] },
  { id: "sanitize-pdf", slug: "sanitize-pdf", name: "Sanitize PDF", category: "security", icon: "shield", description: "Strip scripts, metadata and hidden data.", keywords: ["sanitize", "metadata", "hidden", "clean", "secure"], isNew: true },

  // ---------- OCR & Scan ----------
  { id: "scan-to-pdf", slug: "scan-to-pdf", name: "Scan to PDF", category: "ocr", icon: "scan", description: "Turn photos of documents into clean PDFs.", keywords: ["scan", "photo", "camera", "document", "capture"] },
  { id: "deskew-pdf", slug: "deskew-pdf", name: "Deskew & Clean", category: "ocr", icon: "align", description: "Straighten and clean up scanned pages.", keywords: ["deskew", "straighten", "clean", "scan", "align"] },

  // ---------- Create ----------
  { id: "jpg-to-pdf", slug: "jpg-to-pdf", name: "JPG to PDF", category: "images", icon: "image", description: "Convert JPG images into a single PDF.", keywords: ["jpg", "jpeg", "image", "photo", "convert"] },
  { id: "png-to-pdf", slug: "png-to-pdf", name: "PNG to PDF", category: "images", icon: "image", description: "Bundle PNG images into one PDF.", keywords: ["png", "image", "convert", "bundle"] },
  { id: "images-to-pdf", slug: "images-to-pdf", name: "Images to PDF", category: "images", icon: "images", description: "Combine any images into one document.", keywords: ["images", "photos", "gallery", "combine", "convert"], supportsMultipleFiles: true },
  { id: "blank-pdf", slug: "blank-pdf", name: "Blank PDF", category: "create", icon: "file", description: "Create an empty PDF in any page size.", keywords: ["blank", "empty", "new", "create", "a4"] },
  { id: "dictate-to-pdf", slug: "dictate-to-pdf", name: "Notes to PDF", category: "create", icon: "pen", description: "Type or paste notes and export a PDF.", keywords: ["notes", "text", "write", "create", "export"] },

  // ---------- Compare ----------
  { id: "compare-pdf", slug: "compare-pdf", name: "Compare PDF", category: "compare", icon: "compare", description: "See differences between two PDF versions.", keywords: ["compare", "diff", "difference", "versions", "changes"], supportsMultipleFiles: true, minFiles: 2, isNew: true },

  // ---------- AI PDF ----------
  { id: "summarize-pdf", slug: "summarize-pdf", name: "Summarize", category: "ai", icon: "sparkles", description: "Get a concise summary of any PDF.", keywords: ["summarize", "summary", "tldr", "ai", "brief"] },
  { id: "chat-pdf", slug: "chat-pdf", name: "Chat with PDF", category: "ai", icon: "chat", description: "Ask questions and get answers from your PDF.", keywords: ["chat", "ask", "questions", "ai", "assistant"] },
  { id: "translate-pdf", slug: "translate-pdf", name: "Translate PDF", category: "ai", icon: "translate", description: "Translate documents while keeping layout.", keywords: ["translate", "language", "ai", "localize", "convert"] },
];

export function getTool(slug: string | undefined): Tool | undefined {
  return TOOLS.find((t) => t.slug === slug);
}

export function toolsByCategory(id: CategoryId): Tool[] {
  if (id === "popular") return TOOLS.filter((t) => t.popular);
  return TOOLS.filter((t) => t.category === id);
}

export function searchTools(query: string): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return TOOLS.map((tool) => {
    const haystack = [tool.name, tool.description, tool.category, ...tool.keywords].join(" ").toLowerCase();
    let score = 0;
    for (const term of terms) {
      if (tool.name.toLowerCase().startsWith(term)) score += 6;
      else if (tool.name.toLowerCase().includes(term)) score += 4;
      if (tool.keywords.some((k) => k.includes(term))) score += 2;
      if (haystack.includes(term)) score += 1;
    }
    return { tool, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.tool);
}

/** Suggested tools shown when a search finds nothing. */
export const SEARCH_SUGGESTIONS = ["merge-pdf", "compress-pdf", "pdf-to-word", "sign-pdf", "ocr-pdf"];
