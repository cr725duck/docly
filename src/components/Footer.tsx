import { Link } from "react-router-dom";
import { Logo } from "./Logo";

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "All Tools", to: "/tools" },
      { label: "Open Source", to: "/open-source" },
      { label: "What's new", to: "/tools?category=ai" },
      { label: "Self-hosting", to: "/open-source" },
    ],
  },
  {
    title: "Tools",
    links: [
      { label: "Merge PDF", to: "/tools/merge-pdf" },
      { label: "Compress PDF", to: "/tools/compress-pdf" },
      { label: "PDF to Word", to: "/tools/pdf-to-word" },
      { label: "Sign PDF", to: "/tools/sign-pdf" },
      { label: "OCR PDF", to: "/tools/ocr-pdf" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Business", to: "/tools" },
      { label: "Education", to: "/tools" },
      { label: "Legal", to: "/tools" },
      { label: "Finance", to: "/tools" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help center", to: "/tools" },
      { label: "Security", to: "/settings" },
      { label: "Documentation", to: "/open-source" },
      { label: "API", to: "/tools" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", to: "/open-source" },
      { label: "Releases", to: "/open-source" },
      { label: "Report an issue", to: "/open-source" },
      { label: "Contributing", to: "/open-source" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", to: "/" },
      { label: "Terms", to: "/" },
      { label: "License (MIT)", to: "/open-source" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Logo />
            <p>Every document. One simple toolbox.</p>
          </div>
          {COLUMNS.map((col) => (
            <div className="footer-col" key={col.title}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bottom">
          <span>© 2026 DOCly. Free and open source under the MIT license.</span>
          <span>Made for people who work with documents.</span>
        </div>
      </div>
    </footer>
  );
}
