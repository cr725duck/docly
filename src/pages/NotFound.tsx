import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container page" style={{ textAlign: "center" }}>
      <h1 className="page-title">Page not found</h1>
      <p className="page-sub" style={{ marginBottom: 24 }}>
        The page you're looking for has moved, or never existed.
      </p>
      <Link to="/" className="btn btn-primary">
        Back to home
      </Link>
    </div>
  );
}
