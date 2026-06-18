import { useState } from "react";
import { PageId, ToolItem } from "../types";
import { Search, Sparkles, Layers, Minimize, FileCode, QrCode, ClipboardList, ShieldCheck, Heart, User, CheckCircle2, ChevronDown, Activity, Star } from "lucide-react";

interface HomeProps {
  onNavigate: (pageId: PageId) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const tools: ToolItem[] = [
    {
      id: "pdf-toolkit",
      name: "PDF Toolkit",
      category: "PDF",
      description: "Securely merge documents, split multi-page layers, compress payloads, or compile images directly to PDF booklets entirely locally.",
      keywords: ["pdf tools online", "pdf merge", "pdf split", "compress PDF online"],
      icon: "Layers",
      popular: true
    },
    {
      id: "image-compressor",
      name: "Image Compressor & Converter",
      category: "Image",
      description: "Compress JPEG, PNG, or WEBP in bulk, adjust quality ratios, scale heights/widths, and convert formats matching original visual balances.",
      keywords: ["image compressor", "compress png", "compress jpeg", "convert webp to jpeg"],
      icon: "Minimize"
    },
    {
      id: "file-converter",
      name: "Universal File Converter",
      category: "Format",
      description: "Generate instant conversions between standard web asset formats: PNG to JPEG, WebP, or compile raw .txt logs into clean PDF sheets.",
      keywords: ["convert files online", "png to jpg free", "convert webp to png"],
      icon: "FileCode"
    },
    {
      id: "qr-generator",
      name: "QR Code Generator",
      category: "Marketing",
      description: "Instantly build beautiful custom QR Codes supporting custom texts, URL links, pre-populated emails, call lines, or wireless network access configurations.",
      keywords: ["QR code generator", "generate qr", "custom wireless qr"],
      icon: "QrCode",
      popular: true
    },
    {
      id: "ai-text-tools",
      name: "AI Text Tools & Writing Assistant",
      category: "AI",
      description: "Harness server-side Gemini 3.5 models to produce professional outlines, proofread spellchecks, summarize dense files, or rewrite copywriting content.",
      keywords: ["free AI tools", "AI writing assistant", "summarize dense files"],
      icon: "ClipboardList"
    }
  ];

  const benefits = [
    {
      title: "100% Client-Side Compiling",
      description: "By doing the PDF rendering and image conversions inside your browser sandbox, your uploads are processed instantly without reaching database hosts.",
      icon: ShieldCheck,
      color: "indigo"
    },
    {
      title: "No Logins or Captchas",
      description: "Generate results in seconds. PureTools carries absolutely zero sign-up constraints, verification walls, or limit caps.",
      icon: User,
      color: "sky"
    },
    {
      title: "CDN Fast Load Times",
      description: "Designed with minimal web payloads, optimizing PageSpeed and core web health metrics for lightning fast operations under heavy congestion.",
      icon: Activity,
      color: "emerald"
    }
  ];

  const faqs = [
    {
      question: "Are my files secure on PureTools?",
      answer: "Absolutely. PureTools operates on an offline-first browser sandbox model. For our PDF, Image Compressor, and File Converter utilities, processing occurs entirely within your system's memory using JS web assembly layers. No file bytes are sent to our hosts. The AI content tools process text variables using secure server-side API endpoints, which are purged immediately following response generation."
    },
    {
      question: "Why does PureTools carry only 5 tools?",
      answer: "Most utility programs overwhelm users with fifty redundant, slow-loading templates they never use. We chose to craft exactly 5 high-fidelity, high-speed, frequently requested document and content tools to give an premium, ad-optimized toolset that processes folders in milliseconds."
    },
    {
      question: "Is there a limit on file upload sizes?",
      answer: "Because we process files directly using your own hardware memory (rather than paying for server processors), we do not throttle document uploads or file volumes! Large files assemble rapidly without timeout constraints."
    },
    {
      question: "How does the AI assistant tool communicate?",
      answer: "The AI text suite relies on server-side proxies communicating with Gemini 3.5 models. Your sensitive API credentials remain locked, and individual chats are strictly private and unlogged."
    }
  ];

  const filteredTools = tools.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Layers":
        return Layers;
      case "Minimize":
        return Minimize;
      case "FileCode":
        return FileCode;
      case "QrCode":
        return QrCode;
      case "ClipboardList":
        return ClipboardList;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-20 py-10">
      
      {/* 1. Hero visual block */}
      <section className="relative text-center max-w-4xl mx-auto space-y-6 px-4">
        
        {/* Decorative ambient gradients */}
        <div className="absolute top-0 -left-1/4 -z-10 h-72 w-72 rounded-full bg-indigo-200/40 dark:bg-indigo-950/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 -z-10 h-72 w-72 rounded-full bg-sky-200/40 dark:bg-sky-950/20 blur-3xl" />

        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-100/30 dark:border-indigo-900/45 px-3 py-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400">
          <Sparkles className="h-4 w-4 animate-spin text-indigo-505" />
          No Account, No Captchas, 100% Free
        </div>

        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.05]">
          Free Online Tools To <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-sky-455 bg-clip-text text-transparent">
            Make Your Work Easier
          </span>
        </h1>

        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
          PureTools delivers professional-grade utilities right inside your browser window. Zero tracking, zero wait times, and entirely private local compilation.
        </p>

        {/* Search bar widget */}
        <div className="relative max-w-lg mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md p-2 flex items-center transition-all focus-within:ring-2 focus-within:ring-indigo-505">
          <Search className="h-5 w-5 text-slate-400 ml-3 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDF merge, Image compressor, QR, or text tools..."
            className="w-full bg-transparent px-3 py-2 text-sm focus:outline-none dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="px-3 text-3xs font-bold text-slate-400 hover:text-slate-650 cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {/* 2. Featured Tools grid list */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
              Launch Browser Compiled Tools
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Select any essential tool to complete your daily routine instantly.
            </p>
          </div>
          <button
            onClick={() => onNavigate("all-tools")}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 cursor-pointer self-start"
          >
            Show All Tools <span className="text-indigo-550">→</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => {
            const IconComponent = getIconComponent(tool.icon);
            return (
              <div
                key={tool.id}
                onClick={() => onNavigate(tool.id)}
                className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-100 dark:hover:border-indigo-950 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-500 group-hover:scale-110 transition duration-300">
                      <IconComponent className="h-5.5 w-5.5" />
                    </div>
                    {tool.popular && (
                      <span className="flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100/40 dark:border-amber-900 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                        <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {tool.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-1 text-3xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 opacity-60 group-hover:opacity-100 transition">
                  Compile instantly
                  <span className="group-hover:translate-x-1.5 transition duration-300">→</span>
                </div>
              </div>
            );
          })}

          {filteredTools.length === 0 && (
            <div className="col-span-1 md:col-span-3 py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50 p-6">
              <p className="text-sm font-bold text-slate-500">No matching tools found for "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery("")}
                className="mt-3 text-xs font-semibold text-indigo-500 hover:underline"
              >
                Clear query and try again
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. Benefits / Why PureTools section */}
      <section className="bg-slate-50 dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 transition-all py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Designed For Web Workers Who Value Privacy
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl mx-auto leading-normal">
              Unlike legacy platforms that upload raw folders to cloud databases, PureTools keeps everything sandboxed inside browser memory limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, idx) => {
              const BenefitIcon = b.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl shadow-2xs"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-indigo-500 mb-4">
                    <BenefitIcon className="h-5 w-5" />
                  </div>
                  <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white mb-2">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-505 dark:text-slate-400 leading-relaxed">
                    {b.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Easy 3-Step Operations
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-400">
            How we process large file volumes in milliseconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          
          {/* Subtle connecting divider line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 dark:bg-slate-800 -translate-y-1/2 -z-10" />

          {[
            { step: "01", label: "Select & Upload", desc: "Choose your PDF, image, document, or paste instructions directly into the interface sandbox." },
            { step: "02", label: "Sandbox Compiles", desc: "Our client-side JavaScript compression libraries render and compile content locally using your device CPU." },
            { step: "03", label: "Instant Download", desc: "Retrieve your polished files instantly. Because there are no uploads, downloading happens in milliseconds." }
          ].map((st) => (
            <div
              key={st.step}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl text-center space-y-3 relative shadow-3xs hover:scale-101 transition duration-200"
            >
              <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-indigo-550 text-white font-mono text-sm font-extrabold shadow-sm bg-gradient-to-tr from-indigo-500 to-indigo-650">
                {st.step}
              </div>
              <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white">
                {st.label}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FAQ section */}
      <section className="mx-auto max-w-4xl px-4 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl font-bold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Everything you need to verify regarding file security, limits, and AI models.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-3xs space-y-3">
          {faqs.map((faq, idx) => {
            const isActive = activeFaq === idx;
            return (
              <div
                key={idx}
                className="border-b border-slate-50 dark:border-slate-800/50 last:border-b-0 pb-3"
              >
                <button
                  onClick={() => setActiveFaq(isActive ? null : idx)}
                  className="w-full py-4 flex justify-between items-center text-left font-display text-xs font-bold text-slate-800 hover:text-indigo-600 dark:text-slate-200 dark:hover:text-indigo-400 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 dark:text-slate-500 transition-transform ${isActive ? "rotate-180" : ""}`} />
                </button>
                {isActive && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed py-2 pl-1 select-text">
                    {faq.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
