import { useState } from "react";
import { PageId } from "../types";
import { Wrench, Menu, X, Sun, Moon, ArrowRight, Sparkles } from "lucide-react";

interface HeaderProps {
  currentPageId: PageId;
  onNavigate: (pageId: PageId) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Header({ currentPageId, onNavigate, darkMode, onToggleDarkMode }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { id: "all-tools", label: "All Tools" },
    { id: "about", label: "About Us" },
    { id: "contact", label: "Contact Us" }
  ];

  const toolsSubitems = [
    { id: "pdf-toolkit", label: "PDF Toolkit" },
    { id: "image-compressor", label: "Image Compressor" },
    { id: "file-converter", label: "File Converter" },
    { id: "qr-generator", label: "QR Generator" },
    { id: "ai-text-tools", label: "AI Writing Text Tools" }
  ];

  const handleNavItemClick = (pageId: PageId) => {
    onNavigate(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md transition-all dark:border-slate-800/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Name Group logo */}
        <div 
          onClick={() => handleNavItemClick("home")} 
          className="flex cursor-pointer items-center gap-2.5 group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 text-white shadow-xs group-hover:scale-105 transition-all">
            <Wrench className="h-5 w-5 rotate-45 group-hover:rotate-90 transition-all duration-300" />
          </div>
          <div>
            <span className="font-display text-base font-extrabold tracking-tight text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400 transition">
              PureTool
            </span>
            <span className="ml-1.5 rounded-sm bg-indigo-50 dark:bg-indigo-950/50 px-1 py-0.5 font-mono text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              No-auth
            </span>
          </div>
        </div>

        {/* Desktop Navbar menu Items */}
        <nav className="hidden md:flex items-center gap-8">
          <div className="relative group/menu">
            <button className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 cursor-pointer py-2">
              Explore Tools
              <span className="h-1 w-1 rounded-full bg-indigo-500 ml-1"></span>
            </button>
            <div className="invisible group-hover/menu:visible opacity-0 group-hover/menu:opacity-100 absolute top-full left-0 mt-1.5 w-56 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 p-2 shadow-xl transition-all duration-200">
              {toolsSubitems.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleNavItemClick(sub.id as PageId)}
                  className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-left text-xs font-medium text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-850/60 hover:text-indigo-600 dark:hover:text-indigo-455 transition cursor-pointer ${
                    currentPageId === sub.id && "bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {sub.label}
                  <ArrowRight className="h-3 w-3 opacity-0 hover:opacity-100 transition" />
                </button>
              ))}
            </div>
          </div>

          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavItemClick(item.id as PageId)}
              className={`text-xs font-semibold transition cursor-pointer ${
                currentPageId === item.id
                  ? "text-indigo-600 dark:text-indigo-400 font-bold"
                  : "text-slate-600 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Action blocks (DarkMode switch, QuickStart button) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-500 dark:bg-slate-850 dark:hover:bg-slate-800 dark:text-slate-400 transition border border-transparent dark:border-slate-800 cursor-pointer"
          >
            {darkMode ? <Sun className="h-4.5 w-4.5" /> : <Moon className="h-4.5 w-4.5" />}
          </button>

          <button
            onClick={() => handleNavItemClick("all-tools")}
            className="flex items-center gap-1 px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-xl transition cursor-pointer"
          >
            Launch Tools Free
            <Sparkles className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile menu and core indicators block */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onToggleDarkMode}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400 transition"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-50 dark:text-slate-350 dark:hover:bg-slate-800 transition"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Sliding Mobile Menu wrapper navigation drawers */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-4 shadow-xl transition-all">
          <div className="space-y-1">
            <span className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest pl-2 block mb-1">
              Popular Utilities
            </span>
            {toolsSubitems.map((sub) => (
              <button
                key={sub.id}
                onClick={() => handleNavItemClick(sub.id as PageId)}
                className={`w-full text-left px-3 py-2.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition ${
                  currentPageId === sub.id && "bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold"
                }`}
              >
                {sub.label}
              </button>
            ))}
          </div>

          <hr className="border-slate-100 dark:border-slate-800" />

          <div className="space-y-1">
            <span className="text-3xs font-mono font-bold text-slate-400 uppercase tracking-widest pl-2 block mb-1">
              Corporate Info
            </span>
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavItemClick(item.id as PageId)}
                className={`w-full text-left px-3 py-2.5 text-xs font-medium rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850/60 transition ${
                  currentPageId === item.id && "bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => handleNavItemClick("all-tools")}
            className="w-full py-3 bg-indigo-600 text-white font-bold rounded-xl text-xs text-center block"
          >
            Get Started Free
          </button>
        </div>
      )}
    </header>
  );
}
