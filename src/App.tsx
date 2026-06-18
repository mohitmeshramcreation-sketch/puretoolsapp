/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { PageId } from "./types";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SEOHead from "./components/SEOHead";
import Home from "./components/Home";
import AllTools from "./components/AllTools";
import PDFToolkit from "./components/PDFToolkit";
import ImageCompressor from "./components/ImageCompressor";
import FileConverter from "./components/FileConverter";
import QRGenerator from "./components/QRGenerator";
import AITextTools from "./components/AITextTools";
import About from "./components/About";
import Contact from "./components/Contact";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Disclaimer from "./components/Disclaimer";

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>("home");
  const [darkMode, setDarkMode] = useState(false);

  // Monitor and load light/dark theme settings from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("puretools-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      localStorage.setItem("puretools-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("puretools-theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNavigate = (pageId: PageId) => {
    setCurrentPage(pageId);
    // Smooth auto scroll to top of viewport upon shifting pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderActivePage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={handleNavigate} />;
      case "all-tools":
        return <AllTools onNavigate={handleNavigate} />;
      case "pdf-toolkit":
        return <PDFToolkit />;
      case "image-compressor":
        return <ImageCompressor />;
      case "file-converter":
        return <FileConverter />;
      case "qr-generator":
        return <QRGenerator />;
      case "ai-text-tools":
        return <AITextTools />;
      case "about":
        return <About onNavigate={handleNavigate} />;
      case "contact":
        return <Contact />;
      case "privacy":
        return <Privacy />;
      case "terms":
        return <Terms />;
      case "disclaimer":
        return <Disclaimer />;
      default:
        return <Home onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-250 bg-slate-50/30 text-slate-800 dark:bg-slate-950 dark:text-slate-100`}>
      {/* 1. SEO Head Dynamic tags and schemas injector */}
      <SEOHead pageId={currentPage} />

      {/* 2. Topbrand navigation bar header */}
      <Header
        currentPageId={currentPage}
        onNavigate={handleNavigate}
        darkMode={darkMode}
        onToggleDarkMode={handleToggleDarkMode}
      />

      {/* 3. Main processing layout block */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {renderActivePage()}
      </main>

      {/* 4. Cohesive support footer bar links */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
