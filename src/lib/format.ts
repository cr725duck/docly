export function formatSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

/** Deterministic pseudo page-count based on file name + size (placeholder until backend provides real counts). */
export function estimatePages(file: File): number {
  let h = 0;
  for (let i = 0; i < file.name.length; i++) h = (h * 31 + file.name.charCodeAt(i)) >>> 0;
  return 4 + (h % 46);
}

export function isValidPdf(file: File): boolean {
  return file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
}

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
