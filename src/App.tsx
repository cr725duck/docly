import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { ToastProvider } from "./components/Toast";
import { HomePage } from "./pages/Home";
import { AllToolsPage } from "./pages/AllTools";
import { ToolPage } from "./pages/ToolPage";
import { OpenSourcePage } from "./pages/OpenSource";
import { LoginPage, RegisterPage } from "./pages/Auth";
import { SettingsPage } from "./pages/Settings";
import { NotFoundPage } from "./pages/NotFound";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export default function App() {
  return (
    <ToastProvider>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tools" element={<AllToolsPage />} />
          <Route path="/tools/:slug" element={<ToolPage />} />
          <Route path="/open-source" element={<OpenSourcePage />} />
          <Route path="/pricing" element={<OpenSourcePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
    </ToastProvider>
  );
}
