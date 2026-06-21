import { useState } from "react";
import { PageId, ToolItem } from "../types";
import { Search, Layers, Minimize, FileCode, QrCode, ClipboardList, Sparkles, Star, ShieldCheck } from "lucide-react";

interface AllToolsProps {
  onNavigate: (pageId: PageId) => void;
}

export default function AllTools({ onNavigate }: AllToolsProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "PDF" | "Image" | "Format" | "Marketing" | "AI">("All");

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
    },
    {
      id: "seo-optimizer",
      name: "SEO & Google Search Console Optimizer",
      category: "AI",
      description: "Inject ownership meta tags, construct valid dynamic sitemap.xml files, configure robots.txt formats, and follow organic search checklists.",
      keywords: ["google site verification tag", "sitemap generator online", "robots txt builder", "google search console optimization", "rank at top search"],
      icon: "ShieldCheck",
      popular: true
    }
  ];

  const categories: ("All" | "PDF" | "Image" | "Format" | "Marketing" | "AI")[] = ["All", "PDF", "Image", "Format", "Marketing", "AI"];

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
      case "ShieldCheck":
        return ShieldCheck;
      default:
        return Sparkles;
    }
  };

  const filteredTools = tools.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = activeCategory === "All" || t.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Title head */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">
          Our Suite of 6 Essential Utilities
        </h1>
        <p className="text-xs text-slate-505 dark:text-slate-400 leading-normal">
          We designed exactly 6 master-level local tools so you can process images, merge documents, generate sitemaps/robots configurations, create customized QR vectors, or write AI copy instantly with perfect private protection.
        </p>
      </div>

      {/* Search and category filtering wrapper row */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6 pt-2">
        
        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 order-2 md:order-1 self-start md:self-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
                activeCategory === cat
                  ? "bg-indigo-600 border-indigo-550 text-white shadow-2xs"
                  : "bg-white border-slate-150 text-slate-650 hover:bg-slate-50 dark:bg-slate-905 dark:border-slate-800 dark:text-slate-350 dark:hover:bg-slate-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 order-1 md:order-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type tool keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-505 dark:text-white"
          />
          <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Grid of filtering actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const IconComponent = getIconComponent(tool.icon);
          return (
            <div
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-950 p-6 rounded-2xl shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-505 group-hover:scale-110 transition duration-300">
                    <IconComponent className="h-5.5 w-5.5" />
                  </div>
                  {tool.popular && (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-100/40 dark:border-amber-900 px-2 py-0.5 font-mono text-[9px] font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
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
                Launch Utility
                <span className="group-hover:translate-x-1 transition duration-300">→</span>
              </div>
            </div>
          );
        })}

        {filteredTools.length === 0 && (
          <div className="col-span-1 md:col-span-3 py-16 text-center border border-dashed border-slate-200 rounded-3xl bg-slate-50 p-6">
            <p className="text-sm font-bold text-slate-505">No matches found for active parameters.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
              className="mt-3 text-xs font-semibold text-indigo-505 hover:underline"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
