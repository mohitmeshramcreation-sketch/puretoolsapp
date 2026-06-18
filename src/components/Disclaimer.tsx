export default function Disclaimer() {
  return (
    <div id="disclaimer_page" className="max-w-3xl mx-auto py-12 px-4 space-y-8 select-text">
      <div className="space-y-3">
        <h1 className="font-display text-3xl font-extrabold text-slate-905 dark:text-white">
          Warranty Disclaimer
        </h1>
        <p className="text-3xs text-slate-400 font-mono font-bold uppercase tracking-widest leading-none">
          Last Updated: June 18, 2026
        </p>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none text-xs text-slate-550 dark:text-slate-400 space-y-6 leading-relaxed">
        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            1. Service Provided "As-Is"
          </h2>
          <p>
            PureTool provides its PDF Toolkit, Image Compressor, File Converter, and AI Text utilities entirely "As-Is" and "As Available" without express or implied warranties of any kind. This includes, but is not limited to, implied warranties of fitness for a particular purpose or non-infringement.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            2. Local Compilation Limits
          </h2>
          <p>
            Because file optimization, merging, and image formatting are conducted entirely within your local device's browser sandbox, processing speeds and successful compilation are dependent upon your device hardware, system processor, memory capacity, and active browser compliance. PureTool does not warrant or guarantee that all document formats will compile flawlessly or without system lag.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            3. Limitation of Liability
          </h2>
          <p>
            In no event shall PureTool, its engineers, partners, or subsidiaries be liable for any direct, indirect, incidental, consequential, special, or exemplary damages—including but not limited to loss of assets, data leakage, file corruptions, business interruptions, or systems downtime—arising out of or in connection with the use or performance of our applications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            4. Third-Party Outputs
          </h2>
          <p>
            All AI writing results produced by our Gemini-powered assistants are generated dynamically by external large language models. PureTool does not warrant or assume liability for the accuracy, truthfulness, factual correctness, safety, or legal compliance of any generated text outcomes.
          </p>
        </section>
      </div>
    </div>
  );
}
