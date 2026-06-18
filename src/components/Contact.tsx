import { useState, FormEvent } from "react";
import { Mail, Send, CheckCircle2, MessageSquare, AlertCircle, RefreshCw } from "lucide-react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("feedback");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg("All mandatory parameters are required.");
      return;
    }

    setIsSubmitting(true);

    // Simulate real network submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    }, 1200);
  };

  return (
    <div id="contact_us_page" className="max-w-2xl mx-auto py-12 px-4 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Contact Support & Engineers
        </h1>
        <p className="text-xs text-slate-550 dark:text-slate-400">
          Have an optimization request, bug report, or idea? We respond within 24 working hours.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs relative">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-850 dark:text-white">
                Message Received successfully!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                Thank you for contributing to PureTools. Our engineering queue will analyze your request and reply shortly.
              </p>
            </div>
            <button
              onClick={() => setSubmitted(false)}
              className="mt-4 px-5 py-2.5 text-xs font-bold text-indigo-550 hover:underline cursor-pointer"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Your Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@company.com"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Select Conversation Topic</label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full p-3 bg-slate-50/50 dark:bg-slate-950 border border-slate-250/20 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-505 dark:text-slate-300"
              >
                <option value="feedback">General Platform Feedback</option>
                <option value="bug">Bug Report / Processing Error</option>
                <option value="feature">New Tool Request</option>
                <option value="ads">Partnership / Monetization Inquiry</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">Detailed Message</label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Give details specifications regarding your inquiry..."
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-center gap-2 text-rose-600 text-xs">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Sending secure data block...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Feedback Inquiry
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
