import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/Toast";

export function AuthShell({ title, sub, children, alt }: { title: string; sub: string; children: ReactNode; alt: ReactNode }) {
  return (
    <div className="container">
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>{title}</h1>
          <p className="auth-sub">{sub}</p>
          {children}
          <p className="auth-alt">{alt}</p>
          <p className="auth-demo-note">
            This is a frontend preview — authentication is not yet connected to a backend.
          </p>
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast(`Signed in as ${email || "demo@docly.app"} (demo)`);
    navigate("/settings");
  };

  return (
    <AuthShell
      title="Welcome back"
      sub="Log in to sync your preferences across devices."
      alt={
        <>
          New to DOCly? <Link to="/register">Create an account</Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            className="text-input"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input id="password" className="text-input" type="password" required placeholder="Your password" />
        </div>
        <button className="btn btn-primary btn-block" type="submit">
          Log in
        </button>
      </form>
    </AuthShell>
  );
}

export function RegisterPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const submit = (e: FormEvent) => {
    e.preventDefault();
    toast(`Account created for ${email || "you"} (demo)`);
    navigate("/settings");
  };

  return (
    <AuthShell
      title="Create your account"
      sub="Free forever for everyday PDF tasks."
      alt={
        <>
          Already have an account? <Link to="/login">Log in</Link>
        </>
      }
    >
      <form onSubmit={submit}>
        <div className="form-field">
          <label htmlFor="reg-name">Full name</label>
          <input id="reg-name" className="text-input" type="text" required placeholder="Alex Martin" />
        </div>
        <div className="form-field">
          <label htmlFor="reg-email">Email</label>
          <input
            id="reg-email"
            className="text-input"
            type="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-field">
          <label htmlFor="reg-password">Password</label>
          <input id="reg-password" className="text-input" type="password" required minLength={8} placeholder="At least 8 characters" />
          <p className="field-hint">Use 8+ characters with a mix of letters and numbers.</p>
        </div>
        <button className="btn btn-primary btn-block" type="submit">
          Create account
        </button>
      </form>
    </AuthShell>
  );
}
