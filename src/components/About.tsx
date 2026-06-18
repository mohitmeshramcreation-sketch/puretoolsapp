import { PageId } from "../types";
import { ShieldAlert, Fingerprint, Lock, Zap, Award } from "lucide-react";

interface AboutProps {
  onNavigate: (pageId: PageId) => void;
}

export default function About({ onNavigate }: AboutProps) {
  return (
    <div id="about_us_page" className="max-w-4xl mx-auto py-12 px-4 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Our Privacy Philosophy
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PureTool was founded in 2026 to deliver lightning fast, beautifully minimalist, and privacy-focused document utilities that prioritize user security over metadata mining.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-xs space-y-6">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-full blur-2xl -z-10" />

        <h2 className="font-display text-xl font-bold text-slate-800 dark:text-white">
          The Problem with Traditional PDF & Image Sites
        </h2>
        
        <p className="text-xs text-slate-505 dark:text-slate-400 leading-bold">
          Most simple online file editors mandate registration, enforce rate limiters, show invasive popups, or silently upload your confidential financial or personal folders onto secure cloud files systems where they are analyzed or indexed.
        </p>

        <p className="text-xs text-slate-505 dark:text-slate-400 leading-bold">
          We designed PureTool as a counter-weight: an elegant environment running local WebAssembly code loops, converting and resizing everything inside your machine sandboxes. It represents a simpler, faster, and 100% private future for internet workers.
        </p>
      </div>

      {/* Core values block */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {[
          {
            title: "Encryption by Default",
            desc: "For local PDF tools and image compression, files are read into local temporary array-buffers and destroyed upon browser closing.",
            icon: Lock
          },
          {
            title: "Zero Limiters",
            desc: "We carry no hourly size constraints, premium tiers, or download queue delays. Process hundreds of JPEG folders safely.",
            icon: Zap
          },
          {
            title: "No Signups",
            desc: "Retrieve metrics and complete conversions with no emails, trackers, passwords, or persistent storage profiles.",
            icon: Fingerprint
          },
          {
            title: "Ethical Monetization",
            desc: "We preserve standard, quiet AdSense spaces that do not interrupt your actions. No popunders, popups, or forced ad clicks.",
            icon: Award
          }
        ].map((val, idx) => {
          const IconComponent = val.icon;
          return (
            <div key={idx} className="bg-slate-50 dark:bg-slate-950 border border-slate-205/10 dark:border-slate-850 p-6 rounded-2xl flex items-start gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-indigo-500 shadow-3xs shrink-0">
                <IconComponent className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{val.title}</h4>
                <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal">{val.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="text-center pt-8">
        <button
          onClick={() => onNavigate("all-tools")}
          className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition cursor-pointer"
        >
          Explore All Tools
        </button>
      </div>
    </div>
  );
}
