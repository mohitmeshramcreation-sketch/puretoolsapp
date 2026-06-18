export default function Terms() {
  return (
    <div id="terms_conditions_page" className="max-w-3xl mx-auto py-12 px-4 space-y-8 select-text">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-905 dark:text-white">
          Terms & Conditions
        </h1>
        <p className="text-3xs text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">
          Last Updated: June 18, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs text-slate-550 dark:text-slate-400 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Scope of Use
          </h2>
          <p>
            PureTools grants user a free, non-exclusive, non-transferable global license to access and complete document conversions, image processing, or marketing QR generation for any personal, corporate, academic, or commercial purposes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Proprietary Rights
          </h2>
          <p>
            All custom graphics layouts, brand marks, and local compilation architectures remain the intellectual property of PureTools. Any files or folders uploaded or processed within our boundaries remain entirely yours, representing your private assets.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Abuse & Automated Scrapes
          </h2>
          <p>
            You are prohibited from building script wrappers to complete automated scrapes, spamming our Secure Gemini API portals, or deploying crawlers designed to exhaust server assets. We reserve the right to throttle network requests from active bots.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Service Limits & Modifications
          </h2>
          <p>
            Because we operate entirely without paywalls or user log-ins, PureTools provides utility tools "as is" and "as available". We reserve the right to update compilation libraries, adjust tool layouts, or refine services at our sole discretion.
          </p>
        </section>
      </div>
    </div>
  );
}
