import { useState, useEffect, useRef } from "react";
import QRCode from "qrcode";
import { Download, QrCode, Type, Link, Mail, Phone, Wifi, RefreshCw, Copy, Check } from "lucide-react";

export default function QRGenerator() {
  const [activeTab, setActiveTab] = useState<"text" | "url" | "email" | "phone" | "wifi">("text");
  
  // Custom inputs based on type
  const [textInput, setTextInput] = useState("");
  const [urlInput, setUrlInput] = useState("https://");
  const [emailInput, setEmailInput] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  // Custom styling controls
  const [fgColor, setFgColor] = useState("#0f172a"); // Default slate-900
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrSize, setQrSize] = useState(350);
  const [copied, setCopied] = useState(false);
  
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");

  // Re-generate QR whenever states modify
  useEffect(() => {
    let payload = "";

    switch (activeTab) {
      case "text":
        payload = textInput || "Welcome to PureTools!";
        break;
      case "url":
        payload = urlInput || "https://";
        break;
      case "email":
        if (emailInput) {
          payload = `mailto:${emailInput}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        } else {
          payload = "mailto:hello@example.com";
        }
        break;
      case "phone":
        payload = phoneInput ? `tel:${phoneInput}` : "tel:+1234567890";
        break;
      case "wifi":
        if (wifiSsid) {
          // format: WIFI:S:SSID;T:WPA;P:PASSWORD;H:true;;
          payload = `WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden ? "true" : "false"};;`;
        } else {
          payload = "WIFI:S:PureTools_WiFi;T:WPA;P:puretools123;;";
        }
        break;
    }

    QRCode.toDataURL(payload, {
      width: qrSize,
      margin: 2,
      color: {
        dark: fgColor,
        light: bgColor
      }
    })
      .then((url) => {
        setQrDataUrl(url);
        setErrorMsg("");
      })
      .catch((err) => {
        console.error(err);
        setErrorMsg("Failed to generate QR Code. Adjust values and retry.");
      });
  }, [
    activeTab,
    textInput,
    urlInput,
    emailInput,
    emailSubject,
    emailBody,
    phoneInput,
    wifiSsid,
    wifiPassword,
    wifiEncryption,
    wifiHidden,
    fgColor,
    bgColor,
    qrSize
  ]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `puretools_qr_${activeTab}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      // Fetch the generated blob and write to clipboard
      const res = await fetch(qrDataUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy image to clipboard", err);
    }
  };

  return (
    <div id="qr_generator_tool" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Settings Panel */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <QrCode className="h-5 w-5 text-indigo-500" />
          Configure QR Code Details
        </h3>

        {/* Categories Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[
            { id: "text", label: "Plain Text", icon: Type },
            { id: "url", label: "Website URL", icon: Link },
            { id: "email", label: "Email Address", icon: Mail },
            { id: "phone", label: "Phone Line", icon: Phone },
            { id: "wifi", label: "WiFi Access", icon: Wifi }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700/80 border border-transparent"
                }`}
              >
                <IconComp className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Panel Inputs based on active category */}
        <div className="space-y-4 min-h-[220px]">
          {activeTab === "text" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Your Text Contents</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter any text, instructions, or alphanumeric lines to represent..."
                className="w-full h-36 px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Destination Website URL</label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <p className="text-3xs text-slate-400 dark:text-slate-500">
                Ensure you prefix links with http:// or https:// for correct mobile redirection.
              </p>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Recipient Email</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="hello@example.com"
                  className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Mail Subject (Optional)</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Feedback request"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Pre-populated Message (Optional)</label>
                  <input
                    type="text"
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Hi PureTools team..."
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "phone" && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Telephone Number</label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
              />
              <p className="text-3xs text-slate-400 dark:text-slate-500">
                Include country code for seamless international scanning and calling.
              </p>
            </div>
          )}

          {activeTab === "wifi" && (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Network Name (SSID)</label>
                  <input
                    type="text"
                    value={wifiSsid}
                    onChange={(e) => setWifiSsid(e.target.value)}
                    placeholder="Home_Fiber_WiFi"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Security Encryption</label>
                  <select
                    value={wifiEncryption}
                    onChange={(e) => setWifiEncryption(e.target.value)}
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  >
                    <option value="WPA">WPA / WPA2 (Recommended)</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">None (Open/Public)</option>
                  </select>
                </div>
              </div>

              {wifiEncryption !== "nopass" && (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">Wireless Password</label>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="••••••••••••••"
                    className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="wifi_hidden"
                  checked={wifiHidden}
                  onChange={(e) => setWifiHidden(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="wifi_hidden" className="text-xs font-medium text-slate-550 dark:text-slate-400 select-none">
                  SSID is Hidden (invisible wireless network broadcast)
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Styling controls divider */}
        <hr className="my-6 border-slate-100 dark:border-slate-800" />

        {/* Creative controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Accent Color</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
              <input
                type="color"
                value={fgColor}
                onChange={(e) => setFgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer border-0 rounded-md bg-transparent"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400 uppercase select-all">{fgColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Canvas BG</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-8 cursor-pointer border-0 rounded-md bg-transparent"
              />
              <span className="font-mono text-xs text-slate-600 dark:text-slate-400 uppercase select-all">{bgColor}</span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-3xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Image Resolution</label>
            <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900/60 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800">
              <select
                value={qrSize}
                onChange={(e) => setQrSize(parseInt(e.target.value))}
                className="w-full border-0 bg-transparent text-xs text-slate-600 dark:text-slate-300 focus:outline-none"
              >
                <option value={200}>Standard (200px)</option>
                <option value={350}>High-Definition (350px)</option>
                <option value={600}>Print Masters (600px)</option>
                <option value={1000}>Ultra Scale (1000px)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Visualizer QR Preview Card */}
      <div className="lg:col-span-5 flex flex-col items-center justify-between bg-slate-100/40 dark:bg-slate-950/40 border border-slate-200/60 dark:border-slate-800/60 rounded-2xl p-6">
        <div className="w-full flex justify-between items-center mb-6">
          <span className="text-2xs font-bold font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/55 px-2 py-1 rounded">
            Live Interactive Output
          </span>
          <button
            onClick={() => {
              // reset to tabs defaults
              setTextInput("");
              setUrlInput("https://");
              setEmailInput("");
              setPhoneInput("");
              setWifiSsid("");
              setWifiPassword("");
              setFgColor("#0f172a");
              setBgColor("#ffffff");
              setQrSize(350);
            }}
            title="Reset Settings"
            className="flex items-center justify-center h-8 w-8 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-white dark:bg-slate-900 rounded-lg hover:shadow-xs transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* QR Rendering container */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/50 dark:border-slate-800 shadow-sm max-w-[280px] w-full aspect-square">
          {errorMsg ? (
            <p className="text-xs text-rose-500 text-center">{errorMsg}</p>
          ) : qrDataUrl ? (
            <img
              referrerPolicy="no-referrer"
              src={qrDataUrl}
              alt="Generated custom QR code created instantly with our free QR code generator"
              className="w-full h-full object-contain rounded"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
              <QrCode className="h-10 w-10 animate-pulse text-indigo-400" />
              <span className="text-2xs font-mono">Generating Layout...</span>
            </div>
          )}
        </div>

        {/* Action triggers */}
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          <button
            onClick={handleCopy}
            disabled={!qrDataUrl}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-semibold rounded-xl border cursor-pointer border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 transition ${
              !qrDataUrl && "opacity-50 cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                Copied to Clip
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy Vector QR
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            disabled={!qrDataUrl}
            className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded-xl cursor-pointer bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition shadow-sm ${
              !qrDataUrl && "opacity-50 cursor-not-allowed"
            }`}
          >
            <Download className="h-4 w-4" />
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
