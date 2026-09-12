import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "light" | "dark" | "system";
const STORAGE_KEY = "docly-theme";

function resolve(pref: ThemePreference): "light" | "dark" {
  if (pref === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return pref;
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePreference>(() => {
    return (localStorage.getItem(STORAGE_KEY) as ThemePreference) || "system";
  });
  const [resolved, setResolved] = useState<"light" | "dark">(() => resolve(pref));

  useEffect(() => {
    const apply = () => {
      const r = resolve(pref);
      document.documentElement.dataset.theme = r;
      setResolved(r);
    };
    apply();
    localStorage.setItem(STORAGE_KEY, pref);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => pref === "system" && apply();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [pref]);

  const setTheme = useCallback((p: ThemePreference) => setPref(p), []);
  return { pref, resolved, setTheme };
}
