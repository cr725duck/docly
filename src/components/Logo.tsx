import { Link } from "react-router-dom";

export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
      <rect width="32" height="32" rx="7" fill="var(--accent)" />
      <path
        d="M10 7h8l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 9 25V8.5A1.5 1.5 0 0 1 10.5 7z"
        fill="var(--on-accent)"
        opacity="0.95"
      />
      <path d="M18 7l5 5h-4.2A0.8 0.8 0 0 1 18 11.2V7z" fill="var(--accent)" opacity="0.35" />
      <rect x="12.5" y="16" width="8" height="2" rx="1" fill="var(--accent)" />
      <rect x="12.5" y="20" width="5.5" height="2" rx="1" fill="var(--accent)" opacity="0.5" />
    </svg>
  );
}

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="DOCly home">
      <LogoMark />
      <span>
        DOC<span className="dot">ly</span>
      </span>
    </Link>
  );
}
