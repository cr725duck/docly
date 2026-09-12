import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { Check, AlertTriangle } from "./icons";

interface ToastMsg {
  id: number;
  text: string;
  kind: "info" | "error";
}

const ToastCtx = createContext<(text: string, kind?: "info" | "error") => void>(() => {});

export function useToast() {
  return useContext(ToastCtx);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const idRef = useRef(0);

  const push = useCallback((text: string, kind: "info" | "error" = "info") => {
    const id = ++idRef.current;
    setToasts((t) => [...t, { id, text, kind }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toast-region" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.kind === "error" ? "error" : ""}`}>
            {t.kind === "error" ? <AlertTriangle size={17} /> : <Check size={17} />}
            {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
