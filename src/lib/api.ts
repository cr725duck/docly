/**
 * API layer — placeholder client for the future Python backend.
 *
 * Expected endpoints (to be implemented server-side):
 *   POST /api/tools/{toolSlug}   → start a job, returns { jobId }
 *   GET  /api/jobs/{jobId}       → job status + progress, returns JobStatus
 *   GET  /api/files/{fileId}     → download a result file
 */

export interface JobStatus {
  jobId: string;
  state: "queued" | "processing" | "done" | "error";
  progress: number; // 0–100
  stage?: string;
  resultFileId?: string;
  error?: { code: string; message: string };
}

export interface ToolRunOptions {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Base URL of the processing backend.
 * - Local dev / same-origin deployments: unset (uses /api on the same host)
 * - Render: set VITE_API_BASE to the backend service URL, e.g. https://docly-api.onrender.com
 */
export const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined)?.replace(/\/$/, "") ?? "";

export class ApiError extends Error {
  constructor(message: string, public code = "unknown") {
    super(message);
  }
}

export const api = {
  async runTool(toolSlug: string, files: File[], options: ToolRunOptions): Promise<JobStatus> {
    const body = new FormData();
    for (const f of files) body.append("files", f);
    body.append("options", JSON.stringify(options));
    const res = await fetch(`${API_BASE}/api/tools/${toolSlug}`, { method: "POST", body });
    if (!res.ok) throw new ApiError("Something went wrong while processing your document.", "request_failed");
    return res.json();
  },

  async getJob(jobId: string): Promise<JobStatus> {
    const res = await fetch(`${API_BASE}/api/jobs/${jobId}`);
    if (!res.ok) throw new ApiError("Lost track of your job.", "job_not_found");
    return res.json();
  },

  downloadFile(fileId: string, filename: string) {
    const a = document.createElement("a");
    a.href = `${API_BASE}/api/files/${fileId}`;
    a.download = filename;
    a.click();
  },
};

/** Simulated local job driver used until the backend is connected. */
export function createSimulatedJob(
  onTick: (status: JobStatus) => void,
  opts?: { failAfterStage?: number },
): () => void {
  const stages = ["Reading pages", "Optimizing document", "Creating output"];
  let stage = 0;
  let progress = 0;
  let cancelled = false;
  let failed = false;

  const timer = setInterval(() => {
    if (cancelled) return;
    progress = Math.min(100, progress + 6 + Math.random() * 8);
    if (progress > ((stage + 1) / stages.length) * 100) stage = Math.min(stage + 1, stages.length);
    if (opts?.failAfterStage !== undefined && stage >= opts.failAfterStage && progress > 55) {
      failed = true;
    }
    if (failed) {
      cancelled = true;
      clearInterval(timer);
      onTick({
        jobId: "sim",
        state: "error",
        progress,
        error: { code: "processing_failed", message: "Something went wrong while processing your document." },
      });
      return;
    }
    onTick({
      jobId: "sim",
      state: progress >= 100 ? "done" : "processing",
      progress,
      stage: stages[Math.min(stage, stages.length - 1)],
      resultFileId: progress >= 100 ? "sim-result" : undefined,
    });
  }, 280);

  return () => {
    cancelled = true;
    clearInterval(timer);
  };
}

export const PROCESS_STAGES = ["Reading pages", "Optimizing document", "Creating output"];
