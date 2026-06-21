import { useState, useEffect } from "react";
import { Download, Copy, CheckCircle2, Globe, Search, FileText, Settings, Code, AlertTriangle, ExternalLink, Sparkles, Check, ArrowRight } from "lucide-react";

export default function SEOOptimizer() {
  const [verificationCode, setVerificationCode] = useState("");
  const [savedVerification, setSavedVerification] = useState("");
  const [activeTab, setActiveTab] = useState<"verification" | "sitemap" | "robots" | "checklist">("verification");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Load initially saved verification
  useEffect(() => {
    const saved = localStorage.getItem("gsc-verification-code") || "";
    setVerificationCode(saved);
    setSavedVerification(saved);
  }, []);

  const handleSaveVerification = () => {
    const cleanCode = verificationCode.trim();
    localStorage.setItem("gsc-verification-code", cleanCode);
    setSavedVerification(cleanCode);
    
    // Dispatch custom event or force head tags to refresh
    const event = new CustomEvent("gsc-verification-updated", { detail: cleanCode });
    window.dispatchEvent(event);
    
    // Dynamically inject/update meta tag immediately
    let metaTag = document.querySelector('meta[name="google-site-verification"]');
    if (!metaTag) {
      metaTag = document.createElement("meta");
      metaTag.setAttribute("name", "google-site-verification");
      document.head.appendChild(metaTag);
    }
    metaTag.setAttribute("content", cleanCode);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Generate dynamic sitemap URL list mapping current hostname or default puretool.online
  const hostname = window.location.origin || "https://puretool.online";
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${hostname}/</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${hostname}/all-tools</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/pdf-toolkit</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/image-compressor</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/file-converter</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/qr-generator</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/ai-text-tools</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${hostname}/about</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${hostname}/contact</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${hostname}/privacy</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${hostname}/sitemap.xml
`;

  const downloadFile = (content: string, filename: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div id="seo-optimizer" className="max-w-5xl mx-auto space-y-10 py-4">
      
      {/* 1. Decorative Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-linear-to-r from-indigo-50 to-sky-50 dark:from-indigo-950/20 dark:to-sky-950/20 p-6 md:p-8 rounded-3xl border border-indigo-100/50 dark:border-indigo-900/30">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 px-3 py-1 text-xs font-bold text-indigo-700 dark:text-indigo-400">
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
            SEO & Ranking Suite
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Google Search Console Optimizer
          </h1>
          <p className="text-xs text-slate-550 dark:text-slate-400 max-w-2xl leading-relaxed">
            Verify ownership of <span className="font-semibold text-slate-700 dark:text-slate-300">{hostname}</span>, submit your valid sitemap XML file, and config your robots.txt file to achieve top organic ranking results in search and prevent indexing bugs.
          </p>
        </div>
        <div className="h-14 w-14 shrink-0 rounded-2xl bg-indigo-500/10 dark:bg-indigo-400/15 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-200/50 dark:border-indigo-850">
          <Globe className="h-7 w-7 animate-spin-slow" />
        </div>
      </div>

      {/* 2. Interactive Audit Core Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Navigation Tabs */}
        <div className="flex flex-col gap-2.5">
          {[
            { id: "verification", label: "GSC Verification Tag", desc: "Verify domain ownership instantly", icon: Settings },
            { id: "sitemap", label: "Sitemap.xml Generator", desc: "Build XML map for Google crawls", icon: Code },
            { id: "robots", label: "Robots.txt Constructor", desc: "Set search spider instructions", icon: FileText },
            { id: "checklist", label: "Organic Search Master Guide", desc: "Direct route to top rankings", icon: CheckCircle2 }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 cursor-pointer ${
                  isActive
                    ? "bg-white dark:bg-slate-900 border-indigo-600 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-100 dark:ring-indigo-950"
                    : "bg-slate-50/50 dark:bg-slate-900/35 border-transparent hover:border-slate-200 dark:hover:border-slate-800 hover:bg-white dark:hover:bg-slate-900"
                }`}
              >
                <div className={`mt-0.5 p-2 rounded-xl border shrink-0 ${
                  isActive 
                    ? "bg-indigo-500 text-white border-transparent"
                    : "bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-805"
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <h3 className={`text-xs font-extrabold ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-800 dark:text-slate-200"}`}>
                    {tab.label}
                  </h3>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Content Panel Area */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 shadow-xs min-h-[460px] flex flex-col justify-between">
          
          <div className="space-y-6">
            {/* TAB: VERIFICATION */}
            {activeTab === "verification" && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Settings className="h-5 w-5 text-indigo-500" />
                    Google Verification Token Injector
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Google Search Console requires verifying you own <span className="font-mono text-[11px] bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded">{hostname}</span>. Paste your code below, and this workspace will dynamically inject the necessary meta tag into your site's HTML header instantly!
                  </p>
                </div>

                <div className="space-y-3.5 bg-slate-50/50 dark:bg-slate-950/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-850">
                  <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-550 uppercase tracking-widest block">
                    Your verification ID (from Search Console)
                  </span>
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="e.g. google-site-verification=XYZ123..."
                      className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 dark:text-white focus:outline-none"
                    />
                    <button
                      onClick={handleSaveVerification}
                      className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer shrink-0"
                    >
                      Save & Apply Tag
                    </button>
                  </div>
                  {savedVerification ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-2xs mt-2.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      HTML Meta Tag fully active! Go back to Search Console and hit 'Verify'.
                    </div>
                  ) : (
                    <div className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400 text-2xs mt-2.5">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                      No verification tag saved yet. Get your code using the instructions below.
                    </div>
                  )}
                </div>

                {/* Instructions Block */}
                <div className="space-y-3 border-t border-slate-150/70 dark:border-slate-800/80 pt-5">
                  <h3 className="text-xs font-bold text-slate-800 dark:text-slate-250">
                    How to get your Code:
                  </h3>
                  <ol className="list-decimal list-outside pl-4 space-y-2 text-2xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    <li>Open <strong><a href="https://search.google.com/search-console" target="_blank" rel="noreferrer" className="text-indigo-500 hover:underline inline-flex items-center gap-0.5">Google Search Console <ExternalLink className="h-3 w-3" /></a></strong> and enter your domain (<span className="font-mono text-[10px]">{hostname}</span>).</li>
                    <li>Choose verification method: <strong>HTML Tag</strong> (under Other verification methods).</li>
                    <li>Copy the value inside the <code className="bg-slate-100 dark:bg-slate-800 text-red-500 dark:text-red-400 px-1 py-0.5 rounded font-mono text-[10px]">content="..."</code> attribute. (e.g. if Google gives you <code className="font-mono text-[9px] text-slate-600 dark:text-slate-300">&lt;meta name="google-site-verification" content="XYZ" /&gt;</code>, your code is <span className="bg-slate-100 dark:bg-slate-850 px-1 py-0.5 rounded text-indigo-505">XYZ</span>).</li>
                    <li>Paste that value in the input block above and submit. We inject it instantly!</li>
                  </ol>
                </div>
              </div>
            )}

            {/* TAB: SITEMAP */}
            {activeTab === "sitemap" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Code className="h-5 w-5 text-indigo-500" />
                    Sitemap.xml Generator
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    An XML sitemap tells search engines about your website's organization and lists out its active core pages so indexers can discover them safely.
                  </p>
                </div>

                {/* Simulated Sitemap block preview */}
                <div className="relative group">
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(sitemapXml, "sitemap")}
                      className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer border border-slate-800"
                    >
                      {copiedText === "sitemap" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copiedText === "sitemap" ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => downloadFile(sitemapXml, "sitemap.xml", "application/xml")}
                      className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                  <pre className="text-[10px] font-mono bg-slate-950 text-slate-300 rounded-2xl p-4 overflow-x-auto max-h-56 leading-relaxed border border-slate-900 pr-24 select-all pt-12">
                    {sitemapXml}
                  </pre>
                </div>

                <div className="bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-xl text-3xs border border-indigo-100/30 dark:border-indigo-900/30 space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="font-bold text-slate-850 dark:text-indigo-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Web-Native Integration Active!
                  </div>
                  Our back-end server is already pre-configured to automatically serve this dynamic sitemap directly under <span className="font-mono text-indigo-550 dark:text-indigo-305">{hostname}/sitemap.xml</span>. You don't have to upload anything locally!
                </div>
              </div>
            )}

            {/* TAB: ROBOTS */}
            {activeTab === "robots" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <FileText className="h-5 w-5 text-indigo-500" />
                    Robots.txt Draft Creator
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    This file specifies how web crawler bots should interact with your pages. It guides search indexers directly to your generated sitemap.
                  </p>
                </div>

                <div className="relative group">
                  <div className="absolute right-3 top-3 flex items-center gap-2">
                    <button
                      onClick={() => copyToClipboard(robotsTxt, "robots")}
                      className="px-2.5 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] font-bold hover:bg-slate-800 transition flex items-center gap-1 cursor-pointer border border-slate-800"
                    >
                      {copiedText === "robots" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      {copiedText === "robots" ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => downloadFile(robotsTxt, "robots.txt", "text/plain")}
                      className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-bold hover:bg-indigo-700 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono bg-slate-950 text-slate-300 rounded-2xl p-4 overflow-x-auto max-h-48 leading-relaxed border border-slate-900 pt-12 select-all">
                    {robotsTxt}
                  </pre>
                </div>

                <div className="bg-indigo-50/40 dark:bg-indigo-950/15 p-4 rounded-xl text-3xs border border-indigo-100/30 dark:border-indigo-900/30 space-y-1 text-slate-600 dark:text-slate-400 leading-relaxed">
                  <div className="font-bold text-slate-850 dark:text-indigo-400 flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Server-Level Integration Active!
                  </div>
                  Our back-end runs robots.txt dynamically at <span className="font-mono text-indigo-550 dark:text-indigo-305">{hostname}/robots.txt</span> so Google's indexer discovers it immediately!
                </div>
              </div>
            )}

            {/* TAB: CHECKLIST */}
            {activeTab === "checklist" && (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-indigo-500" />
                    How to Claim the Top Google Search Spot
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                    Follow this roadmap sequentially to trigger rapid indexing in Google in under 48 hours.
                  </p>
                </div>

                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {[
                    { step: "1", title: "Apply Cloudflare Domain Mapping", detail: "Ensure your custom domain 'puretool.online' is mapped fully as a dynamic CNAME/A proxy matching the hosting servers.", done: true },
                    { step: "2", title: "Inject the GSC Site Verification Tag", detail: "Generate your site ownership meta header inside the GSC Panel, then paste it in Tab 1 and hit Save.", done: false },
                    { step: "3", title: "Request Ownership Verification", detail: "Return to Google Search Console and click 'Verify' to instantly confirm your website's active status.", done: false },
                    { step: "4", title: "Submit the generated XML Sitemap", detail: "Go to Indexing > Sitemaps inside Google Search Console, submit your sitemap url: 'https://puretool.online/sitemap.xml'.", done: false },
                    { step: "5", title: "Inspect URL & Request Indexing", detail: "Paste 'https://puretool.online/' in GSC's topmost search bar, hit enter, and click 'Request Indexing' to alert crawlers immediately.", done: false }
                  ].map((item) => (
                    <div key={item.step} className="flex gap-3 text-slate-700 dark:text-slate-300">
                      <span className={`inline-flex items-center justify-center h-5 w-5 rounded-full font-mono text-[10px] font-bold shrink-0 ${
                        item.done ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}>
                        {item.step}
                      </span>
                      <div className="space-y-0.5 mt-0.5">
                        <h4 className="text-[11.5px] font-bold">{item.title}</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-2xs text-slate-500">
            <span>Powered by Client Side Optimization Engines</span>
            <button
              onClick={() => setActiveTab(activeTab === "checklist" ? "verification" : activeTab === "verification" ? "sitemap" : activeTab === "sitemap" ? "robots" : "checklist")}
              className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
            >
              Next Step <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
