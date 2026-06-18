import { useState } from "react";
import { Sparkles, FileText, CheckCheck, RefreshCw, Copy, Check, ChevronRight, HelpCircle } from "lucide-react";

export default function AITextTools() {
  const [activeTool, setActiveTool] = useState<"summarize" | "grammar" | "rewrite" | "improve" | "ideas">("summarize");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [rewriteOption, setRewriteOption] = useState("professional");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sampleTexts = {
    summarize: "Artificial intelligence (AI), in its broadest sense, is intelligence exhibited by machines, particularly computer systems. It is a field of research in computer science that develops and studies methods and software which enable machines to perceive their environment and use learning and reasoning to take actions that maximize their chances of achieving a set of goals. Such machines may be called AIs. AI technology is widely used throughout industry, government, and science. Some high-profile applications include advanced web search engines (e.g., Google Search), recommendation systems (used by YouTube, Amazon, and Netflix), interacting via human speech (such as Google Assistant, Siri, and Alexa), self-driving vehicles (e.g., Waymo), generative and creative tools (ChatGPT and Midjourney), and playing games such as chess and Go.",
    grammar: "Me and my coworker goes to the office everyday but yeasterday we am staying home to finish the report because of the rain. We has many works to do and no time for lunch properly.",
    rewrite: "We need to schedule a quick meeting to align on the project deliverables and ensure that everybody is on the same page before the client review on Friday.",
    improve: "The site is very slow. It takes too long to load files. Users get frustrated. We should make it faster. Adding caching will help.",
    ideas: "A newsletter about personal finance, productivity, and simple tech utilities for busy millennial professionals."
  };

  const handleApplySample = () => {
    setInputText(sampleTexts[activeTool]);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setErrorMsg("Please enter layout writing content first.");
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setOutputText("");

    try {
      const response = await fetch("/api/ai/text-tools", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          text: inputText,
          tool: activeTool,
          option: activeTool === "rewrite" ? rewriteOption : undefined
        })
      });

      const data = await response.json();
      if (response.ok && data.output) {
        setOutputText(data.output);
      } else {
        setErrorMsg(data.error || "Failed to process text via Gemini AI. Ensure server configurations are active.");
      }
    } catch (err: any) {
      setErrorMsg("Unable to communicate with the secure AI server. Try again shortly.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed.", err);
    }
  };

  return (
    <div id="ai_text_tools_tool" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Control panel */}
      <div className="lg:col-span-12 flex flex-wrap gap-2 p-1.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/50 dark:border-slate-800/80">
        {[
          { id: "summarize", label: "Summarizer", desc: "Key summaries & bullet points" },
          { id: "grammar", label: "Grammar Corrector", desc: "Perfect spelling & phrasing" },
          { id: "rewrite", label: "Smart Rewriter", desc: "Adapt copy to other styles" },
          { id: "improve", label: "Style Enhancer", desc: "Boost readability & flow" },
          { id: "ideas", label: "Idea Generator", desc: "Outlines & brainstorm maps" }
        ].map((toolOption) => {
          const isSelected = activeTool === toolOption.id;
          return (
            <button
              key={toolOption.id}
              onClick={() => {
                setActiveTool(toolOption.id as any);
                setInputText("");
                setOutputText("");
                setErrorMsg("");
              }}
              className={`flex-1 min-w-[140px] px-4 py-3 text-left rounded-lg transition-all ${
                isSelected
                  ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-xs border border-slate-100 dark:border-slate-850"
                  : "text-slate-600 dark:text-slate-400 hover:bg-white/40 dark:hover:bg-slate-900/40 text-xs font-semibold"
              }`}
            >
              <div className="text-xs">{toolOption.label}</div>
              <div className="text-3xs opacity-75 font-normal mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
                {toolOption.desc}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main interface grids */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-transparent px-1">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Input Content</span>
          <button
            onClick={handleApplySample}
            className="text-3xs font-semibold text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900 px-2.5 py-1 rounded-lg transition"
          >
            Insert Practice Text
          </button>
        </div>

        <div className="relative bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Paste your document instructions here to ${activeTool}...`}
            className="w-full h-80 px-1 py-1 text-sm bg-transparent border-0 focus:outline-none focus:ring-0 dark:text-white resize-none"
            maxLength={6000}
          />

          <div className="flex justify-between items-center text-3xs text-slate-450 dark:text-slate-500 font-mono border-t border-slate-50 dark:border-slate-800 pt-3 mt-2">
            <span>Character Limit: {inputText.length} / 6,000</span>
            {inputText && (
              <button
                onClick={() => setInputText("")}
                className="hover:text-slate-700 dark:hover:text-slate-300 transition"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Multi-tool adjustment logic for Rewriter style selection */}
        {activeTool === "rewrite" && (
          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 p-4 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Style Voice:</span>
              <p className="text-3xs text-slate-400 dark:text-slate-500">Pick a tone perspective</p>
            </div>
            <select
              value={rewriteOption}
              onChange={(e) => setRewriteOption(e.target.value)}
              className="bg-white dark:bg-slate-900 text-xs font-semibold border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-1.5 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="professional">👔 Professional/Corporate</option>
              <option value="casual">☕ Friendly/Casual</option>
              <option value="creative">🎨 Creative/Engaging</option>
              <option value="persuasive">🔥 Highly Persuasive</option>
              <option value="educational">🎓 Academic/Scientific</option>
              <option value="short">⚡ Punchy & Summarized</option>
            </select>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={isLoading || !inputText.trim()}
          className={`w-full py-4 px-6 font-semibold flex items-center justify-center gap-2 rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer ${
            isLoading || !inputText.trim()
              ? "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed border border-transparent"
              : "bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-650"
          }`}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              Gemini AI is crafting your text...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Unlock AI Magic
            </>
          )}
        </button>
      </div>

      {/* AI output generation */}
      <div className="lg:col-span-6 flex flex-col gap-4">
        <div className="flex justify-between items-center bg-transparent px-1 min-h-[28px]">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Polished Outcomes</span>
          {outputText && (
            <span className="text-3xs font-bold font-mono text-emerald-500 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Ready to copy
            </span>
          )}
        </div>

        <div className="relative flex flex-col h-[23.5rem] bg-slate-50/50 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-5 justify-between">
          <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
            {outputText ? (
              <p className="text-sm dark:text-slate-200 leading-relaxed whitespace-pre-wrap selection:bg-indigo-150">
                {outputText}
              </p>
            ) : errorMsg ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <span className="text-xs font-semibold text-rose-500 dark:text-rose-450 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900 rounded-xl py-4 px-6 shadow-2xs max-w-sm">
                  {errorMsg}
                </span>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center text-slate-400/80">
                <FileText className="h-10 w-10 text-slate-300 dark:text-slate-700 mb-2 stroke-[1.2]" />
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400">Your results appear here</h4>
                <p className="text-3xs text-slate-400 mt-1 max-w-[240px]">
                  Write or paste text on the left, select a generator, and click click.
                </p>
              </div>
            )}
          </div>

          {/* Copy action container */}
          {outputText && (
            <div className="flex gap-2 justify-end border-t border-slate-100 dark:border-slate-900 pt-3 mt-4">
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 py-2 px-4 text-xs font-semibold rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition shadow-3xs cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 text-emerald-500 animate-scale-in" />
                    Copied Correctly
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Result
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
