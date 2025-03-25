// src/App.tsx
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import "./i18n"; // i18n yapılandırmasını import ediyoruz
import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes";

import { BrowserRouter as Router } from 'react-router-dom';

export default function App() {
  const { i18n } = useTranslation();

  // Tarayıcıdan dil tercihini alma
  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferredLanguage");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    } else {
      // Tarayıcı dilini algılama veya varsayılan dil ayarlama
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "tr" || browserLang === "en") {
        i18n.changeLanguage(browserLang);
      } else {
        i18n.changeLanguage("tr"); // Varsayılan dil
      }
    }
  }, [i18n]);

  return (
    <Router>
      <Toaster position="top-right" />
      <AppRoutes />
    </Router>
  );
}
