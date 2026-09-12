import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 24, ...props }: P, children: ReactNode) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

/* Tool icons — keyed by Tool.icon */
const toolIcons: Record<string, (p: P) => JSX.Element> = {
  merge: (p) => base(p, <><path d="M8 3h8l4 4v14H8z" transform="translate(-2 0)"/><path d="M14 3v4h4"/><path d="M5 9v8m0 0-2-2m2 2 2-2" transform="translate(1 0)"/></>),
  compress: (p) => base(p, <><path d="M12 3v6m0 0-2.5-2.5M12 9l2.5-2.5M12 21v-6m0 0-2.5 2.5M12 15l2.5 2.5M4 12h16"/></>),
  split: (p) => base(p, <><rect x="3" y="4" width="7" height="16" rx="1"/><rect x="14" y="4" width="7" height="16" rx="1"/><path d="M12 2v20" strokeDasharray="2 3"/></>),
  word: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M9.5 12l1.2 5 1.3-3.4L13.3 17l1.2-5"/></>),
  excel: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 12l4 5m0-5-4 5"/></>),
  powerpoint: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 17v-5h2.2a1.6 1.6 0 0 1 0 3.2H10"/></>),
  image: (p) => base(p, <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-4.5-4.5L8 20"/></>),
  images: (p) => base(p, <><rect x="6" y="3" width="14" height="14" rx="2"/><path d="M3 7v11a3 3 0 0 0 3 3h11"/><circle cx="11" cy="8.5" r="1.3"/><path d="M20 13l-3.5-3.5L9 17"/></>),
  sign: (p) => base(p, <><path d="M4 19c3-1 4-6 6-6s1.5 4 3 4 2-2.5 4-2.5c1.2 0 2 .9 3 1.5"/><path d="M14 4l6 6-8 8-6.5 1L7 12z" transform="translate(1 -2) scale(0.72)"/></>),
  ocr: (p) => base(p, <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M8 10h8M8 13.5h5"/></>),
  lock: (p) => base(p, <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></>),
  unlock: (p) => base(p, <><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 7.7-1.5"/></>),
  edit: (p) => base(p, <><path d="M4 20h16"/><path d="M6 16l9.5-9.5a2.1 2.1 0 0 1 3 3L9 19l-4 1z"/></>),
  annotate: (p) => base(p, <><path d="M4 20h16"/><path d="M8 16l8-8 2.5 2.5-8 8H8z"/><path d="M14.5 9.5 17 7" transform="translate(1.5 -1.5)"/></>),
  watermark: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M11 15.5a2 2 0 1 1 4 0c0 1.5-2 1.5-2 3" opacity="0"/><text x="12" y="18.2" textAnchor="middle" fontSize="7.5" fontWeight="700" stroke="none" fill="currentColor" opacity="0.8">W</text></>),
  crop: (p) => base(p, <><path d="M7 3v14h14"/><path d="M3 7h14v14"/></>),
  redact: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><rect x="9.5" y="13" width="5" height="2.6" rx="0.5" fill="currentColor" stroke="none"/></>),
  rotate: (p) => base(p, <><path d="M4 10a8 8 0 1 1 2 6"/><path d="M4 16v-5h5" transform="translate(0 -1)"/></>),
  trash: (p) => base(p, <><path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M6 7l1 13h10l1-13"/><path d="M10 11v5m4-5v5"/></>),
  extract: (p) => base(p, <><path d="M13 4H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6"/><path d="M11 12h9m0 0-3-3m3 3-3 3"/></>),
  sort: (p) => base(p, <><path d="M8 4v16m0 0-3-3m3 3 3-3M16 20V4m0 0-3 3m3-3 3 3"/></>),
  organize: (p) => base(p, <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>),
  optimize: (p) => base(p, <><path d="M12 3l2.4 5.4L20 10l-5.6 1.6L12 17l-2.4-5.4L4 10l5.6-1.6z"/><path d="M18.5 16l.8 1.7 1.7.8-1.7.8-.8 1.7-.8-1.7-1.7-.8 1.7-.8z"/></>),
  wrench: (p) => base(p, <><path d="M14.5 6.5a4.5 4.5 0 0 0-6 5.6L3 17.6V21h3.4l5.5-5.5a4.5 4.5 0 0 0 5.6-6L14 13l-3-3z"/></>),
  layers: (p) => base(p, <><path d="M12 3 3 8l9 5 9-5z"/><path d="M3 13l9 5 9-5" opacity="0.7"/><path d="M3 18l9 5 9-5" opacity="0.4" transform="translate(0 -2.5)"/></>),
  certificate: (p) => base(p, <><circle cx="12" cy="9" r="5"/><path d="M9.5 13.5 8 21l4-2 4 2-1.5-7.5"/><path d="M10.3 9l1.2 1.2 2.2-2.4"/></>),
  shield: (p) => base(p, <><path d="M12 3l8 3v6c0 5-3.5 7.8-8 9-4.5-1.2-8-4-8-9V6z"/><path d="M9 12l2 2 4-4.5"/></>),
  scan: (p) => base(p, <><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3"/><path d="M4 12h16"/></>),
  align: (p) => base(p, <><path d="M4 6h16M4 12h10M4 18h16" transform="rotate(-4 12 12)"/></>),
  text: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/><path d="M10 13h4M10 16.5h6"/></>),
  code: (p) => base(p, <><path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14"/></>),
  file: (p) => base(p, <><path d="M7 3h7l4 4v14H7z"/><path d="M14 3v4h4"/></>),
  pen: (p) => base(p, <><path d="M4 20c4-1 3-4 6-4 2 0 2.5 2 4.5 2M16 4l4 4-9.5 9.5L6 19l-2-4.5z" transform="scale(0.92) translate(1 1)"/></>),
  compare: (p) => base(p, <><rect x="3" y="4" width="8" height="16" rx="1.5"/><rect x="13" y="4" width="8" height="16" rx="1.5"/><path d="M11 8h2m-2 4h2m-2 4h2"/></>),
  sparkles: (p) => base(p, <><path d="M12 4l1.8 4.2L18 10l-4.2 1.8L12 16l-1.8-4.2L6 10l4.2-1.8z"/><path d="M19 15l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/></>),
  chat: (p) => base(p, <><path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7m-7 3.5h4"/></>),
  translate: (p) => base(p, <><path d="M3 6h9M7.5 4v2c0 3.5-2 6.5-4.5 8"/><path d="M5 9.5c1.5 2.5 3.5 4.5 6 5.5"/><path d="M12.5 21l4-10 4 10M14 17.5h5"/></>),
  hash: (p) => base(p, <><path d="M9 4L7 20M17 4l-2 16M4 9h17M3 15h17"/></>),
  layout: (p) => base(p, <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M4 9h16M9 9v11"/></>),
};

export const TOOL_ICONS = toolIcons;

export function ToolIcon({ name, size = 24, ...rest }: P & { name: string }) {
  const Icon = toolIcons[name] ?? toolIcons.file;
  return <Icon size={size} {...rest} />;
}

/* UI icons */
export const SearchIcon = (p: P) => base(p, <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></>);
export const ChevronDown = (p: P) => base(p, <path d="M6 9l6 6 6-6"/>);
export const ArrowRight = (p: P) => base(p, <><path d="M4 12h16m0 0-6-6m6 6-6 6"/></>);
export const Check = (p: P) => base(p, <path d="M5 12.5l4.5 4.5L19 7.5"/>);
export const X = (p: P) => base(p, <path d="M6 6l12 12M18 6L6 18"/>);
export const Plus = (p: P) => base(p, <><path d="M12 5v14M5 12h14"/></>);
export const Minus = (p: P) => base(p, <path d="M5 12h14"/>);
export const UploadCloud = (p: P) => base(p, <><path d="M7 16a4.5 4.5 0 1 1 .9-8.9A6 6 0 0 1 19 9.5 3.5 3.5 0 0 1 18 16"/><path d="M12 12v8m0-8-3 3m3-3 3 3"/></>);
export const DotsVertical = (p: P) => base(p, <><circle cx="12" cy="5.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.1" fill="currentColor" stroke="none"/><circle cx="12" cy="18.5" r="1.1" fill="currentColor" stroke="none"/></>);
export const DragHandle = (p: P) => base(p, <><circle cx="9" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="9" cy="18" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="18" r="1.2" fill="currentColor" stroke="none"/></>);
export const Eye = (p: P) => base(p, <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></>);
export const RotateCw = (p: P) => base(p, <><path d="M20 5v5h-5"/><path d="M19.4 10a8 8 0 1 0 .6 3"/></>);
export const ZoomIn = (p: P) => base(p, <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M11 8.5v5M8.5 11h5"/></>);
export const ZoomOut = (p: P) => base(p, <><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5M8.5 11h5"/></>);
export const Maximize = (p: P) => base(p, <><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></>);
export const Sun = (p: P) => base(p, <><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.5m0 14v2.5M2.5 12H5m14 0h2.5M4.9 4.9l1.8 1.8m10.6 10.6 1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/></>);
export const Moon = (p: P) => base(p, <path d="M20 13.5A8.5 8.5 0 1 1 10.5 4 6.8 6.8 0 0 0 20 13.5z"/>);
export const Monitor = (p: P) => base(p, <><rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6m-3-4v4"/></>);
export const Menu = (p: P) => base(p, <path d="M4 7h16M4 12h16M4 17h16"/>);
export const Globe = (p: P) => base(p, <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.6 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.6-3.8-9S9.5 5.5 12 3z"/></>);
export const Smartphone = (p: P) => base(p, <><rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/></>);
export const Briefcase = (p: P) => base(p, <><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/></>);
export const AlertTriangle = (p: P) => base(p, <><path d="M12 4L2.5 20h19z"/><path d="M12 10v4m0 3v.01"/></>);
export const Info = (p: P) => base(p, <><circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-8.5v.01"/></>);
export const Clock = (p: P) => base(p, <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/></>);
export const Heart = (p: P) => base(p, <path d="M12 20s-7-4.3-9-8.5C1.6 8.4 3.6 5 7 5c2.2 0 3.7 1.2 5 3 1.3-1.8 2.8-3 5-3 3.4 0 5.4 3.4 4 6.5-2 4.2-9 8.5-9 8.5z"/>);
export const Code = toolIcons.code;
export const Lock = toolIcons.lock;
export const Trash2 = toolIcons.trash;
