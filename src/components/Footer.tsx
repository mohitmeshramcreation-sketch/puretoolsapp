import { PageId } from "../types";
import { Wrench, Mail, Clock, ShieldCheck, Heart } from "lucide-react";

interface FooterProps {
  onNavigate: (pageId: PageId) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 transition-all pt-16 pb-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10">
        
        {/* Core Description Column */}
        <div className="md:col-span-5 space-y-4">
          <div onClick={() => onNavigate("home")} className="flex items-center gap-2 cursor-pointer group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-sky-450 text-white">
              <Wrench className="h-4.5 w-4.5 rotate-45" />
            </div>
            <span className="font-display text-sm font-extrabold tracking-tight text-slate-955 dark:text-white group-hover:text-indigo-600 transition">
              PureTools
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
            PureTools is a private-by-design, browser-compiled utility environment. We provide 5 master tools: PDF converters, image compressors, file compilers, instant QR generators, and AI assistants. Completely registration-free, with zero telemetry tracking.
          </p>

          <div className="flex gap-4 text-slate-400 text-3xs pt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-4 w-4 text-indigo-505" /> Browser Sandbox Active
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-indigo-505" /> 100% Free Forever
            </span>
          </div>
        </div>

        {/* Tools Shortcut Quick Links */}
        <div className="md:col-span-2.5 space-y-4">
          <h4 className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Core Utilities
          </h4>
          <ul className="space-y-2.5">
            {[
              { id: "pdf-toolkit", label: "PDF Toolkit" },
              { id: "image-compressor", label: "Image Compressor" },
              { id: "file-converter", label: "File Converter" },
              { id: "qr-generator", label: "QR Code Generator" },
              { id: "ai-text-tools", label: "AI Writing Assistant" }
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id as PageId)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Legal Disclaimers Links */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Security Agreements
          </h4>
          <ul className="space-y-2.5">
            {[
              { id: "about", label: "About Us" },
              { id: "contact", label: "Contact Us" },
              { id: "privacy", label: "Privacy Policy" },
              { id: "terms", label: "Terms of Work" },
              { id: "disclaimer", label: "Disclaimer Sheets" }
            ].map((link) => (
              <li key={link.id}>
                <button
                  onClick={() => onNavigate(link.id as PageId)}
                  className="text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 cursor-pointer text-left"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter mock form */}
        <div className="md:col-span-2.5 space-y-4">
          <h4 className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-widest">
            Engineers Newsletter
          </h4>
          <p className="text-3xs text-slate-450 dark:text-slate-500 leading-relaxed">
            Receive monthly updates regarding new browser compiling libraries, PDF specs, and privacy news.
          </p>

          <form 
            onSubmit={(e) => {
              e.preventDefault();
              alert("Thank you for subscribing to PureTools updates!");
            }}
            className="flex gap-2"
          >
            <input
              type="email"
              required
              placeholder="name@company.com"
              className="px-3 py-2 text-3xs border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-white flex-1"
            />
            <button
              type="submit"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white hover:bg-indigo-750 transition shadow-2xs cursor-pointer shrink-0"
              title="Subscribe"
            >
              <Mail className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      <hr className="my-10 border-slate-200/40 dark:border-slate-900 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" />

      {/* Copy agreements footer */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-3xs font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
        <span>© {currentYear} PureTools Platform. All Rights Reserved.</span>
        <span className="flex items-center gap-1.5 leading-none">
          Designed with <Heart className="h-3 w-3 text-rose-500 fill-rose-500 animate-pulse" /> for secure web workers
        </span>
      </div>
    </footer>
  );
}
