export default function Privacy() {
  return (
    <div id="privacy_policy_page" className="max-w-3xl mx-auto py-12 px-4 space-y-8 select-text">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-905 dark:text-white">
          Privacy Policy
        </h1>
        <p className="text-3xs text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">
          Last Updated: June 18, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs text-slate-550 dark:text-slate-400 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Overview & Core Philosophy
          </h2>
          <p>
            PureTool is engineered with an unwavering commitment to data sovereignty. Unlike standard utilities that stream uploads to remote cloud compilers for extraction, our environment leverages standard WebAssembly and offscreen browser canvas protocols. This means that your files, photos, and document arrays remain entirely within your browser window's memory stack and are destroyed immediately upon page close or tab dismissal.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Data Collections
          </h2>
          <p>
            <strong>Files & Folders:</strong> When utilizing the PDF Toolkit, Image Compressor, or File Converter, we do not require, request, or initiate any network transfer streams for your file structures.
          </p>
          <p>
            <strong>AI text tools:</strong> When completing summarizations or proofreading copies, text inputs are proxied securely to Gemini AI API nodes to generate answers. This interaction is unlogged, and characters are purged instantly after responding.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Cookies and Telemetry
          </h2>
          <p>
            PureTool does not integrate persistent tracking cookies, session identifiers, or marketing analytics pixels. We utilize standard, browser local-storage parameters solely to save your local visual preferences (e.g., active Light/Dark theme setting).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Advertisements & AdSense Integration
          </h2>
          <p>
            To fund high-performance CDN architectures without paywalls, we run quiet ad units using Google AdSense. These networks may analyze contextual keywords or browser profiles to serve matching relevant copy, bound by separate Google Privacy Frameworks.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            5. Contact Support Inquiries
          </h2>
          <p>
            If you transmit support or feedback details via our feedback forms, your submitted name and email coordinates are referenced exclusively to form a reply and are never shared or resold.
          </p>
        </section>
      </div>
    </div>
  );
}
