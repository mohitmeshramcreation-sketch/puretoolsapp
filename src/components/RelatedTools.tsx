import { PageId } from "../types";
import { ArrowRight, Layers, Minimize, FileCode, QrCode, ClipboardList, ShieldCheck, FileText } from "lucide-react";

interface RelatedToolsProps {
  currentPageId: PageId;
  onNavigate: (pageId: PageId) => void;
}

interface RelatedItem {
  id: PageId;
  name: string;
  description: string;
  icon: any;
}

export default function RelatedTools({ currentPageId, onNavigate }: RelatedToolsProps) {
  // If we are on Home or informational pages, do not display related tools footer block
  const excludedPages: PageId[] = ["home", "all-tools", "about", "contact", "privacy", "terms", "disclaimer"];
  if (excludedPages.includes(currentPageId)) {
    return null;
  }

  const allRelatedItems: Record<string, RelatedItem> = {
    "pdf-toolkit": {
      id: "pdf-toolkit",
      name: "PDF Toolkit Suite",
      description: "Merge, split, or compile images directly into high-speed PDF booklets safely.",
      icon: Layers
    },
    "pdf-compressor": {
      id: "pdf-compressor",
      name: "PDF Compressor Pro",
      description: "Reduce PDF metadata and payload dimensions entirely inside browser memory.",
      icon: Minimize
    },
    "pdf-to-word": {
      id: "pdf-to-word",
      name: "PDF to Word Converter",
      description: "Extract text outlines and convert PDF layouts to editable Word documents.",
      icon: FileText
    },
    "image-compressor": {
      id: "image-compressor",
      name: "Image Compressor Pro",
      description: "Our high-precision engine compresses JPG/PNG without losing visual clarity.",
      icon: Minimize
    },
    "image-resizer": {
      id: "image-resizer",
      name: "Image Resizer Online",
      description: "Scale widths, adjust height dimensions, and adjust custom aspect ratio constraints.",
      icon: Minimize
    },
    "jpg-to-png": {
      id: "jpg-to-png",
      name: "JPG to PNG Converter",
      description: "Transcode standard JPEG photos into clean high-density PNG assets instantly.",
      icon: FileCode
    },
    "png-to-jpg": {
      id: "png-to-jpg",
      name: "PNG to JPG Converter",
      description: "Convert transparent PNG files to optimized JPEG files with white backgrounds.",
      icon: FileCode
    },
    "file-converter": {
      id: "file-converter",
      name: "Universal File Converter",
      description: "Generate format conversions between PNG, JPEG, WebP, or compile TXT to PDF.",
      icon: FileCode
    },
    "qr-generator": {
      id: "qr-generator",
      name: "QR Code Generator",
      description: "Instantly create fully customized QR code vectors offline for URLs and phone calls.",
      icon: QrCode
    },
    "ai-text-tools": {
      id: "ai-text-tools",
      name: "AI Writing Assistant",
      description: "Summarize reports, correct grammar, and adjust tones powered by Google Gemini.",
      icon: ClipboardList
    },
    "seo-optimizer": {
      id: "seo-optimizer",
      name: "SEO & Search Console Optimizer",
      description: "Prepare sitemaps, construct robots.txt files, and inject verification tags.",
      icon: ShieldCheck
    }
  };

  // Category mappings for relevant linking
  let relatedIds: PageId[] = [];

  const pdfGroup: PageId[] = ["pdf-toolkit", "pdf-compressor", "pdf-to-word", "file-converter"];
  const imageGroup: PageId[] = ["image-compressor", "image-resizer", "jpg-to-png", "png-to-jpg", "file-converter"];
  const marketingGroup: PageId[] = ["qr-generator", "ai-text-tools", "seo-optimizer"];

  if (pdfGroup.includes(currentPageId)) {
    relatedIds = pdfGroup.filter(id => id !== currentPageId);
  } else if (imageGroup.includes(currentPageId)) {
    relatedIds = imageGroup.filter(id => id !== currentPageId);
  } else if (marketingGroup.includes(currentPageId)) {
    relatedIds = marketingGroup.filter(id => id !== currentPageId);
  }

  // Fallback default related items if list is narrow
  if (relatedIds.length === 0) {
    relatedIds = ["image-compressor", "pdf-toolkit", "qr-generator"];
  }

  const itemsToRender = relatedIds.map(id => allRelatedItems[id]).filter(Boolean);

  const pageIdToPath = (id: string): string => {
    return `/${id}`;
  };

  return (
    <section className="mt-20 border-t border-slate-100 dark:border-slate-800/80 pt-12">
      <div className="space-y-6">
        <div>
          <h4 className="font-display text-base font-bold text-slate-900 dark:text-white">
            Related Free Online Tools
          </h4>
          <p className="text-3xs text-slate-500 mt-1">
            Access similar local browser utilities to complete your current flow instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {itemsToRender.slice(0, 3).map((item) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={pageIdToPath(item.id)}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(item.id);
                }}
                className="group p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 hover:border-indigo-100 dark:hover:border-indigo-950 rounded-2xl shadow-3xs hover:shadow-xs transition duration-200 text-left flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 text-indigo-500 group-hover:scale-105 transition">
                    <IconComponent className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h5 className="font-display text-xs font-bold text-slate-800 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                      {item.name}
                    </h5>
                    <p className="text-3xs text-slate-500 dark:text-slate-400 leading-normal mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-indigo-650 dark:text-indigo-400 opacity-60 group-hover:opacity-100 transition">
                  Launch Tool
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
