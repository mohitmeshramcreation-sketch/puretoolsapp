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
import PDFToWord from "./components/PDFToWord";
import RelatedTools from "./components/RelatedTools";
import QRGenerator from "./components/QRGenerator";
import AITextTools from "./components/AITextTools";
import About from "./components/About";
import Contact from "./components/Contact";
import Privacy from "./components/Privacy";
import Terms from "./components/Terms";
import Disclaimer from "./components/Disclaimer";
import SEOOptimizer from "./components/SEOOptimizer";

const pathToPageId = (path: string): PageId => {
  const clean = path.replace(/\/$/, "").toLowerCase();
  if (clean === "" || clean === "/") return "home";
  if (clean === "/all-tools") return "all-tools";
  if (clean === "/pdf-toolkit") return "pdf-toolkit";
  if (clean === "/image-compressor") return "image-compressor";
  if (clean === "/image-resizer") return "image-resizer";
  if (clean === "/jpg-to-png") return "jpg-to-png";
  if (clean === "/png-to-jpg") return "png-to-jpg";
  if (clean === "/pdf-to-word") return "pdf-to-word";
  if (clean === "/pdf-compressor") return "pdf-compressor";
  if (clean === "/file-converter") return "file-converter";
  if (clean === "/qr-generator") return "qr-generator";
  if (clean === "/ai-text-tools") return "ai-text-tools";
  if (clean === "/seo-optimizer") return "seo-optimizer";
  if (clean === "/about") return "about";
  if (clean === "/contact") return "contact";
  if (clean === "/privacy") return "privacy";
  if (clean === "/terms") return "terms";
  if (clean === "/disclaimer") return "disclaimer";
  return "home";
};

const pageIdToPath = (pageId: PageId): string => {
  if (pageId === "home") return "/";
  return `/${pageId}`;
};

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageId>(() => {
    return pathToPageId(window.location.pathname);
  });
  const [darkMode, setDarkMode] = useState(false);

  // Monitor/load theme settings, sync browser history state, and load dynamic verification
  useEffect(() => {
    // 1. Theme Configuration
    const savedTheme = localStorage.getItem("puretool-theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // 2. Google Search Console ownership Tag live injection (on first load)
    const savedGsc = localStorage.getItem("gsc-verification-code") || "9AOl1ajBFUCb1TO1prZCTWyxSlwd_tKjmLrB0M3Dseg";
    if (!localStorage.getItem("gsc-verification-code")) {
      localStorage.setItem("gsc-verification-code", "9AOl1ajBFUCb1TO1prZCTWyxSlwd_tKjmLrB0M3Dseg");
    }
    if (savedGsc) {
      let metaTag = document.querySelector('meta[name="google-site-verification"]');
      if (!metaTag) {
        metaTag = document.createElement("meta");
        metaTag.setAttribute("name", "google-site-verification");
        document.head.appendChild(metaTag);
      }
      metaTag.setAttribute("content", savedGsc);
    }

    // 3. Keep Router states responsive to standard popstate (back/forward history gestures)
    const handlePopState = () => {
      const pageId = pathToPageId(window.location.pathname);
      setCurrentPage(pageId);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleToggleDarkMode = () => {
    const nextDark = !darkMode;
    setDarkMode(nextDark);
    if (nextDark) {
      localStorage.setItem("puretool-theme", "dark");
      document.documentElement.classList.add("dark");
    } else {
      localStorage.setItem("puretool-theme", "light");
      document.documentElement.classList.remove("dark");
    }
  };

  const handleNavigate = (pageId: PageId) => {
    setCurrentPage(pageId);
    const path = pageIdToPath(pageId);
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
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
      case "pdf-compressor":
        return <PDFToolkit initialTab="compress" />;
      case "image-compressor":
        return <ImageCompressor />;
      case "image-resizer":
        return <ImageCompressor isResizer={true} />;
      case "file-converter":
        return <FileConverter />;
      case "jpg-to-png":
        return <FileConverter initialType="jpg-to-png" />;
      case "png-to-jpg":
        return <FileConverter initialType="png-to-jpg" />;
      case "pdf-to-word":
        return <PDFToWord />;
      case "qr-generator":
        return <QRGenerator />;
      case "ai-text-tools":
        return <AITextTools />;
      case "seo-optimizer":
        return <SEOOptimizer />;
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
        <RelatedTools currentPageId={currentPage} onNavigate={handleNavigate} />
      </main>

      {/* 4. Cohesive support footer bar links */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
