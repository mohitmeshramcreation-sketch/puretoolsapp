import { useState, useRef, ChangeEvent } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Upload, Download, RefreshCw, FileCode, Check, Image as ImageIcon, Sparkles, FileText, AlertCircle } from "lucide-react";

interface ConvertedFile {
  id: string;
  sourceName: string;
  sourceSize: number;
  targetName: string;
  targetSize: number;
  dataUrl: string; // Image formats
  pdfBytes?: Uint8Array; // For documents
  mimeType: string;
}

export default function FileConverter() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [conversionType, setConversionType] = useState<"png-to-jpg" | "jpg-to-png" | "webp-to-jpg" | "txt-to-pdf">("png-to-jpg");
  const [convertedFile, setConvertedFile] = useState<ConvertedFile | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto detect best conversion layout on drop
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setConvertedFile(null);
      setErrorMsg("");

      // Smart auto-selection
      const name = file.name.toLowerCase();
      if (name.endsWith(".png")) {
        setConversionType("png-to-jpg");
      } else if (name.endsWith(".jpg") || name.endsWith(".jpeg")) {
        setConversionType("jpg-to-png");
      } else if (name.endsWith(".webp")) {
        setConversionType("webp-to-jpg");
      } else if (name.endsWith(".txt")) {
        setConversionType("txt-to-pdf");
      }
    }
  };

  const executeConversion = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setConvertedFile(null);
    setErrorMsg("");

    try {
      if (conversionType === "txt-to-pdf") {
        await convertTxtToPdf(selectedFile);
      } else {
        await convertImage(selectedFile, conversionType);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to convert file. Ensure it is not corrupted and is of the proper layout.");
    } finally {
      setIsProcessing(false);
    }
  };

  const convertImage = (file: File, type: typeof conversionType): Promise<void> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Unable to create Canvas context."));
            return;
          }

          let mimeType = "image/png";
          let suffix = ".png";

          if (type === "png-to-jpg" || type === "webp-to-jpg") {
            mimeType = "image/jpeg";
            suffix = ".jpg";
            // Pre-fill white background to fix transparent PNG conversions
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }

          ctx.drawImage(img, 0, 0);

          const resultDataUrl = canvas.toDataURL(mimeType, 1.0);
          const head = "data:" + mimeType + ";base64,";
          const approxSize = Math.round((resultDataUrl.length - head.length) * 3 / 4);

          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const originalSizeExt = suffix;

          setConvertedFile({
            id: Math.random().toString(36).substring(7),
            sourceName: file.name,
            sourceSize: file.size,
            targetName: `${nameWithoutExt}_pureconverted${suffix}`,
            targetSize: approxSize,
            dataUrl: resultDataUrl,
            mimeType
          });
          resolve();
        };
        img.onerror = () => reject(new Error("Loaded image object is invalid or corrupted."));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Fail to read uploaded image."));
      reader.readAsDataURL(file);
    });
  };

  // Convert pure TXT files into standard A4 formatted PDF booklets!
  const convertTxtToPdf = async (file: File): Promise<void> => {
    const text = await file.text();
    const pdfDoc = await PDFDocument.create();

    // Standard Helvetica font layout
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;
    const lineHeight = 15;
    
    // Page dimensions
    const margin = 50;
    const pageMaxWidth = 595.276; // A4 Width
    const pageMaxHeight = 841.89; // A4 Height
    const textWidth = pageMaxWidth - (margin * 2);
    const textHeight = pageMaxHeight - (margin * 2);

    let page = pdfDoc.addPage([pageMaxWidth, pageMaxHeight]);
    let currentY = pageMaxHeight - margin;

    // Line wrapping calculations
    const words = text.split(/(\s+)/);
    let currentLine = "";

    for (const word of words) {
      if (word === "\n" || word === "\r\n") {
        if (currentLine) {
          page.drawText(currentLine, { x: margin, y: currentY, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
          currentY -= lineHeight;
          currentLine = "";
        } else {
          currentY -= lineHeight - 3;
        }

        // Add additional pages when exceeding boundary limits
        if (currentY < margin) {
          page = pdfDoc.addPage([pageMaxWidth, pageMaxHeight]);
          currentY = pageMaxHeight - margin;
        }
        continue;
      }

      const testLine = currentLine + word;
      const width = font.widthOfTextAtSize(testLine, fontSize);

      if (width > textWidth) {
        page.drawText(currentLine, { x: margin, y: currentY, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
        currentY -= lineHeight;
        currentLine = word.trim() ? word : "";

        if (currentY < margin) {
          page = pdfDoc.addPage([pageMaxWidth, pageMaxHeight]);
          currentY = pageMaxHeight - margin;
        }
      } else {
        currentLine = testLine;
      }
    }

    // Flush any remaining line
    if (currentLine.trim()) {
      page.drawText(currentLine, { x: margin, y: currentY, size: fontSize, font, color: rgb(0.1, 0.1, 0.1) });
    }

    const pdfBytes = await pdfDoc.save();
    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;

    setConvertedFile({
      id: Math.random().toString(36).substring(7),
      sourceName: file.name,
      sourceSize: file.size,
      targetName: `${nameWithoutExt}_pureconverted.pdf`,
      targetSize: pdfBytes.length,
      dataUrl: "", // Handled separately via blob
      pdfBytes,
      mimeType: "application/pdf"
    });
  };

  const triggerDownload = () => {
    if (!convertedFile) return;

    let href = convertedFile.dataUrl;
    if (convertedFile.pdfBytes) {
      const blob = new Blob([convertedFile.pdfBytes], { type: "application/pdf" });
      href = URL.createObjectURL(blob);
    }

    const link = document.createElement("a");
    link.href = href;
    link.download = convertedFile.targetName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob url if generated
    if (convertedFile.pdfBytes) {
      URL.revokeObjectURL(href);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div id="file_converter_tool" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Configuration zone */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <FileCode className="h-5 w-5 text-indigo-500" />
            Universal File Converter
          </h3>

          {/* Quick upload drop box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition select-none text-center"
          >
            <Upload className="h-10 w-10 text-slate-400 dark:text-slate-650 mb-3 animate-bounce" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {selectedFile ? `Selected: ${selectedFile.name}` : "Select any Image or Text Document"}
            </h4>
            <p className="text-3xs text-slate-400 mt-2">
              Accepts PNG, JPG, WEBP, or TXT. Converts files securely using purely browser compilers.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".png,.jpeg,.jpg,.webp,.txt"
              className="hidden"
            />
          </div>

          {/* Settings panel for routing target layouts */}
          {selectedFile && (
            <div className="mt-6 space-y-4">
              <div className="space-y-1">
                <label className="text-3xs font-bold text-slate-400 uppercase tracking-wider block">Target Conversion</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {[
                    { id: "png-to-jpg", label: "PNG to JPEG (.jpg)", accepts: [".png"] },
                    { id: "jpg-to-png", label: "JPEG to PNG (.png)", accepts: [".jpg", ".jpeg"] },
                    { id: "webp-to-jpg", label: "WebP to JPEG (.jpg)", accepts: [".webp"] },
                    { id: "txt-to-pdf", label: "Raw Text to PDF Booklet", accepts: [".txt"] }
                  ].map((option) => {
                    const isAllowed = selectedFile ? option.accepts.some((ext) => selectedFile.name.toLowerCase().endsWith(ext)) : true;
                    const isSelected = conversionType === option.id;

                    return (
                      <button
                        key={option.id}
                        disabled={!isAllowed}
                        onClick={() => setConversionType(option.id as any)}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg text-xs font-bold border transition text-left cursor-pointer ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/50 dark:border-indigo-800 dark:text-indigo-400"
                            : isAllowed
                            ? "bg-white border-slate-150 text-slate-650 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
                            : "bg-slate-50 border-transparent text-slate-300 dark:bg-slate-950 dark:text-slate-600 cursor-not-allowed"
                        }`}
                      >
                        <Sparkles className={`h-4 w-4 shrink-0 ${isSelected ? "text-indigo-500" : "text-slate-350"}`} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {selectedFile && (
          <button
            onClick={executeConversion}
            disabled={isProcessing}
            className="w-full mt-6 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Processing local rendering engines...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Generate File Format Change
              </>
            )}
          </button>
        )}
      </div>

      {/* Outcome preview */}
      <div className="lg:col-span-5 bg-slate-100/30 dark:bg-slate-950/45 border border-slate-250/20 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <span className="text-2xs font-bold font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
            Output Conversion State
          </span>

          {convertedFile ? (
            <div className="mt-8 space-y-6">
              {/* Graphic container mockup representation */}
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-3xs text-center">
                {conversionType === "txt-to-pdf" ? (
                  <FileText className="h-14 w-14 text-rose-500 mb-2 stroke-[1.2]" />
                ) : (
                  <ImageIcon className="h-14 w-14 text-emerald-500 mb-2 stroke-[1.2]" />
                )}
                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                  {convertedFile.targetName}
                </h4>
                <div className="mt-3 flex flex-col font-mono text-2xs text-slate-400 gap-1.5 leading-none">
                  <span>Input: {formatFileSize(convertedFile.sourceSize)}</span>
                  <span>Outcome Size: {formatFileSize(convertedFile.targetSize)}</span>
                </div>
              </div>

              <button
                onClick={triggerDownload}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download Processed File
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16 text-center">
              <FileCode className="h-10 w-10 text-slate-200 dark:text-slate-850 stroke-[1.2]" />
              <h4 className="text-xs font-bold text-slate-500">Wait for selection</h4>
              <p className="text-3xs text-slate-400 max-w-[200px] mt-0.5">
                Upload image or document, format parameters matching, and click Compile.
              </p>
            </div>
          )}
        </div>

        {/* Local processing confirmation block */}
        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-slate-400 shrink-0" />
          <p className="text-3xs text-slate-400 leading-normal font-medium">
            Local Sandbox Conversion: Fast rendering, perfect confidentiality, zero server transfers.
          </p>
        </div>
      </div>
    </div>
  );
}
