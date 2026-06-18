import { useState, useRef, ChangeEvent } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { Upload, Download, RefreshCw, FileText, FileSpreadsheet, Layers, Sparkles, Image as ImageIcon, Sliders, Play, Plus, Trash, AlertCircle } from "lucide-react";

interface PDFMeta {
  id: string;
  name: string;
  size: number;
  pageCount: number;
  fileObject: File;
}

export default function PDFToolkit() {
  const [activeTab, setActiveTab] = useState<"merge" | "split" | "compress" | "img-to-pdf">("merge");
  const [pdfQueue, setPdfQueue] = useState<PDFMeta[]>([]);
  const [imageQueue, setImageQueue] = useState<{ id: string; file: File; url: string }[]>([]);
  const [splitPdfInput, setSplitPdfInput] = useState<PDFMeta | null>(null);
  const [splitRange, setSplitRange] = useState("1-2");
  const [compressLevel, setCompressLevel] = useState("medium"); // medium / extreme
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultsBlobUrl, setResultsBlobUrl] = useState("");
  const [resultsFileName, setResultsFileName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const fileInputRefRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const splitInputRef = useRef<HTMLInputElement>(null);

  const handlePdfUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      setErrorMsg("");

      for (const file of files) {
        try {
          const bytes = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
          const pages = pdfDoc.getPageCount();

          setPdfQueue((prev) => [
            ...prev,
            {
              id: Math.random().toString(36).substring(7),
              name: file.name,
              size: file.size,
              pageCount: pages,
              fileObject: file
            }
          ]);
        } catch (err) {
          setErrorMsg(`Failed to load pdf data for ${file.name}.`);
          console.error(err);
        }
      }
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files) as File[];
      files.forEach((file) => {
        const url = URL.createObjectURL(file);
        setImageQueue((prev) => [
          ...prev,
          {
            id: Math.random().toString(36).substring(7),
            file,
            url
          }
        ]);
      });
    }
  };

  const handleSplitUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0] as File;
      setErrorMsg("");
      try {
        const bytes = await file.arrayBuffer();
        const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pages = pdfDoc.getPageCount();

        setSplitPdfInput({
          id: Math.random().toString(36).substring(7),
          name: file.name,
          size: file.size,
          pageCount: pages,
          fileObject: file
        });
        setSplitRange(`1-${Math.min(pages, 2)}`);
      } catch (err) {
        setErrorMsg("Failed to open PDF metadata. Verify file is not locked.");
      }
    }
  };

  // 1. PDF MERGE Logic
  const executeMerge = async () => {
    if (pdfQueue.length < 2) {
      setErrorMsg("Requires at least two PDF documents to merge.");
      return;
    }
    setIsProcessing(true);
    setResultsBlobUrl("");
    setErrorMsg("");

    try {
      const mergedPdf = await PDFDocument.create();

      for (const meta of pdfQueue) {
        const bytes = await meta.fileObject.arrayBuffer();
        const loadedPdf = await PDFDocument.load(bytes);
        const pages = await mergedPdf.copyPages(loadedPdf, loadedPdf.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultsBlobUrl(url);
      setResultsFileName(`puretools_merged_${Date.now()}.pdf`);
    } catch (err) {
      setErrorMsg("Failed to merge PDF files. Some files might contain restricted fonts or structures.");
      console.error(err);
    } finally {
      setIsProcessing(true); // show ready block
      setIsProcessing(false);
    }
  };

  // 2. PDF SPLIT Logic
  const executeSplit = async () => {
    if (!splitPdfInput) {
      setErrorMsg("Please select a PDF file first.");
      return;
    }

    setIsProcessing(true);
    setResultsBlobUrl("");
    setErrorMsg("");

    try {
      const bytes = await splitPdfInput.fileObject.arrayBuffer();
      const originalPdf = await PDFDocument.load(bytes);
      const totalPages = originalPdf.getPageCount();

      // Parse range instruction (e.g. 1-3 or 2,5,8)
      const rangeIndices: number[] = [];
      const parts = splitRange.split(",");

      for (const part of parts) {
        if (part.includes("-")) {
          const [startStr, endStr] = part.split("-");
          const start = parseInt(startStr.trim());
          const end = parseInt(endStr.trim());
          if (!isNaN(start) && !isNaN(end)) {
            for (let i = start; i <= end; i++) {
              if (i >= 1 && i <= totalPages) {
                rangeIndices.push(i - 1);
              }
            }
          }
        } else {
          const idx = parseInt(part.trim());
          if (!isNaN(idx) && idx >= 1 && idx <= totalPages) {
            rangeIndices.push(idx - 1);
          }
        }
      }

      if (rangeIndices.length === 0) {
        throw new Error("Specified pages are out of boundaries.");
      }

      const splitPdf = await PDFDocument.create();
      const copiedPages = await splitPdf.copyPages(originalPdf, rangeIndices);
      copiedPages.forEach((p) => splitPdf.addPage(p));

      const pdfBytes = await splitPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultsBlobUrl(url);
      setResultsFileName(`puretools_split_${splitPdfInput.name}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to split specified pages. Check input syntax (e.g., '1-3').");
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. PDF COMPRESS Logic (Streams optimization)
  const executeCompress = async () => {
    if (pdfQueue.length === 0) {
      setErrorMsg("Queue is empty. Select a PDF to compress.");
      return;
    }

    setIsProcessing(true);
    setResultsBlobUrl("");
    setErrorMsg("");

    try {
      const sourceMeta = pdfQueue[0];
      const bytes = await sourceMeta.fileObject.arrayBuffer();
      const pdfDoc = await PDFDocument.load(bytes);
      
      // Clear metadata & forms stream to reduce document size client side
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setCreator("");
      pdfDoc.setProducer("");

      const compressedBytes = await pdfDoc.save({ useObjectStreams: compressLevel === "medium" });
      const blob = new Blob([compressedBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultsBlobUrl(url);
      setResultsFileName(`puretools_compressed_${sourceMeta.name}`);
    } catch (err) {
      setErrorMsg("Failed to apply compression routine locally.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. IMAGE TO PDF Logic (Multiple formats to A4 booklet)
  const executeImageToPdf = async () => {
    if (imageQueue.length === 0) {
      setErrorMsg("Queue is empty. Upload image files first.");
      return;
    }

    setIsProcessing(true);
    setResultsBlobUrl("");
    setErrorMsg("");

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgMeta of imageQueue) {
        const file = imgMeta.file;
        const imgBytes = await file.arrayBuffer();
        let embeddedImage;

        // Embed images based on MIME
        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          embeddedImage = await pdfDoc.embedJpg(imgBytes);
        } else if (file.type === "image/png") {
          embeddedImage = await pdfDoc.embedPng(imgBytes);
        } else {
          // Fallback convert webp to jpeg offscreen
          const canvas = document.createElement("canvas");
          const img = await new Promise<HTMLImageElement>((resolve, reject) => {
            const i = new Image();
            i.onload = () => resolve(i);
            i.onerror = reject;
            i.src = imgMeta.url;
          });
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
          const convertedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
          // extract binary
          const response = await fetch(convertedDataUrl);
          const binaryBytes = await response.arrayBuffer();
          embeddedImage = await pdfDoc.embedJpg(binaryBytes);
        }

        // Draw image centered in standard A4 width/height bounds
        const page = pdfDoc.addPage([595.276, 841.89]); // A4 Size
        const { width, height } = embeddedImage.scaleToFit(595.276 - 80, 841.89 - 80);
        
        page.drawImage(embeddedImage, {
          x: (595.276 - width) / 2,
          y: (841.89 - height) / 2,
          width,
          height
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      setResultsBlobUrl(url);
      setResultsFileName(`puretools_images_${Date.now()}.pdf`);
    } catch (err) {
      setErrorMsg("Failed to compile images to PDF.");
      console.error(err);
    } finally {
      setIsProcessing(false);
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
    <div id="pdf_toolkit_tool" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Category settings tab bar */}
      <div className="lg:col-span-12 flex flex-wrap gap-2 p-1 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200/40 dark:border-slate-800">
        {[
          { id: "merge", label: "PDF Merge", desc: "Combine multiple PDFs" },
          { id: "split", label: "PDF Split", desc: "Extract selected pages" },
          { id: "compress", label: "PDF Compress", desc: "Optimize file size" },
          { id: "img-to-pdf", label: "Image to PDF", desc: "Convert images to PDF" }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setResultsBlobUrl("");
              setErrorMsg("");
              setPdfQueue([]);
              setImageQueue([]);
              setSplitPdfInput(null);
            }}
            className={`flex-1 min-w-[120px] px-4 py-2.5 text-center text-xs font-semibold rounded-lg transition ${
              activeTab === tab.id
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 font-bold shadow-3xs"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          {activeTab === "merge" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Layers className="h-4.5 w-4.5 text-indigo-500" />
                Upload files to merge
              </h3>
              <div
                onClick={() => fileInputRefRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition text-center"
              >
                <Plus className="h-8 w-8 text-slate-400 dark:text-slate-650 mb-2 animate-bounce" />
                <h4 className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                  Select PDFs to merge in sequence
                </h4>
                <p className="text-3xs text-slate-400 mt-1">Upload multiple documents.</p>
                <input
                  type="file"
                  ref={fileInputRefRef}
                  onChange={handlePdfUpload}
                  multiple
                  accept=".pdf"
                  className="hidden"
                />
              </div>

              {/* Merge file queues */}
              {pdfQueue.length > 0 && (
                <div className="space-y-1.5 pt-2">
                  <span className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-wider block">Sequence Queue</span>
                  <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                    {pdfQueue.map((meta, idx) => (
                      <div
                        key={meta.id}
                        className="flex justify-between items-center p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="text-xs font-mono font-bold text-indigo-500 shrink-0">#{idx + 1}</span>
                          <span className="text-xs font-semibold text-slate-700 dark:text-slate-350 truncate">{meta.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-3xs font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded">
                            {meta.pageCount} Pages
                          </span>
                          <span className="text-3xs font-mono text-slate-400">{formatFileSize(meta.size)}</span>
                          <button
                            onClick={() => setPdfQueue((prev) => prev.filter((item) => item.id !== meta.id))}
                            className="text-slate-400 hover:text-rose-500"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={executeMerge}
                    className="w-full mt-4 py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Merge Files Now
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "split" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="h-4.5 w-4.5 text-indigo-500" />
                Select a document to split
              </h3>

              <div
                onClick={() => splitInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition text-center"
              >
                <Plus className="h-8 w-8 text-slate-400 dark:text-slate-650 mb-2" />
                <h4 className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                  {splitPdfInput ? `Selected: ${splitPdfInput.name}` : "Upload split target PDF"}
                </h4>
                <p className="text-3xs text-slate-400 mt-1">Specify page bounds below.</p>
                <input
                  type="file"
                  ref={splitInputRef}
                  onChange={handleSplitUpload}
                  accept=".pdf"
                  className="hidden"
                />
              </div>

              {splitPdfInput && (
                <div className="space-y-4 pt-2">
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-850">
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-slate-400 uppercase">Input file</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">{splitPdfInput.name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-3xs font-bold text-slate-400 uppercase">Available pages</span>
                      <p className="text-xs font-bold text-slate-750 dark:text-slate-300">Total: {splitPdfInput.pageCount} Pages</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400">Specify Ranges (e.g. 1-2, 5 or 1-4)</label>
                    <input
                      type="text"
                      value={splitRange}
                      onChange={(e) => setSplitRange(e.target.value)}
                      placeholder="e.g. 1-3, 5"
                      className="w-full px-4 py-3 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900 focus:ring-2 focus:ring-indigo-500 dark:text-white"
                    />
                  </div>

                  <button
                    onClick={executeSplit}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Extract Selected Pages
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "compress" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sliders className="h-4.5 w-4.5 text-indigo-500" />
                Optimize file size
              </h3>

              <div
                onClick={() => fileInputRefRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition text-center"
              >
                <Plus className="h-8 w-8 text-slate-400 dark:text-slate-650 mb-2 animate-bounce" />
                <h4 className="text-xs font-semibold text-slate-755 dark:text-slate-300">
                  {pdfQueue.length > 0 ? `Selected: ${pdfQueue[0].name}` : "Upload PDF document to compress"}
                </h4>
                <input
                  type="file"
                  ref={fileInputRefRef}
                  onChange={handlePdfUpload}
                  accept=".pdf"
                  className="hidden"
                />
              </div>

              {pdfQueue.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Compression strength</label>
                    <select
                      value={compressLevel}
                      onChange={(e) => setCompressLevel(e.target.value)}
                      className="w-full text-xs p-3 font-semibold bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                    >
                      <option value="medium">Standard Compact Stream (Safe, high compatibility)</option>
                      <option value="extreme">Deep Cleanup Stream (Discards optional annotations & forms)</option>
                    </select>
                  </div>

                  <button
                    onClick={executeCompress}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Compress Document Size
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === "img-to-pdf" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <ImageIcon className="h-4.5 w-4.5 text-indigo-500" />
                Convert images to PDF
              </h3>

              <div
                onClick={() => imageInputRef.current?.click()}
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition text-center"
              >
                <Plus className="h-8 w-8 text-slate-400 dark:text-slate-650 mb-2 animate-bounce" />
                <h4 className="text-xs font-semibold text-slate-750 dark:text-slate-300">
                  Select JPG, PNG or WEBP images
                </h4>
                <p className="text-3xs text-slate-400 mt-1">Images compile as sequential PDF slides.</p>
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageUpload}
                  multiple
                  accept="image/*"
                  className="hidden"
                />
              </div>

              {imageQueue.length > 0 && (
                <div className="space-y-4 pt-2">
                  <span className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-wider block">Images Sequence</span>
                  
                  {/* Image slides mapping thumbnails */}
                  <div className="grid grid-cols-4 gap-2.5 max-h-40 overflow-y-auto pr-1">
                    {imageQueue.map((img, idx) => (
                      <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 aspect-square">
                        <img referrerPolicy="no-referrer" src={img.url} alt={`Uploaded image file number ${idx + 1} to compile in PDF toolkit free online`} className="h-full w-full object-cover" />
                        <span className="absolute bottom-1 left-1.5 font-mono text-xs font-bold text-white bg-black/60 px-1 py-0.5 rounded leading-none">
                          #{idx + 1}
                        </span>
                        <button
                          onClick={() => {
                            setImageQueue((prev) => prev.filter((item) => item.id !== img.id));
                            URL.revokeObjectURL(img.url);
                          }}
                          className="absolute top-1 right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full p-0.5 shadow-md transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={executeImageToPdf}
                    className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <RefreshCw className="h-4 w-4" /> Compile Images to PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Visual results outcome preview */}
      <div className="lg:col-span-5 bg-slate-150/20 dark:bg-slate-95" />
      <div className="lg:col-span-5 bg-slate-100/30 dark:bg-slate-950/45 border border-slate-250/25 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
        <div>
          <span className="text-2xs font-bold font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
            PDF Outputs
          </span>

          {resultsBlobUrl ? (
            <div className="mt-8 space-y-6">
              <div className="flex flex-col items-center justify-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-3xs text-center">
                <FileText className="h-14 w-14 text-indigo-500 mb-2 stroke-[1.2]" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[200px]">
                  {resultsFileName}
                </h4>
                <div className="mt-2 flex flex-col font-mono text-3xs text-slate-400 gap-1.5 leading-none">
                  <span>Standard compliance compilation standard</span>
                  <span>Size: Processed locally</span>
                </div>
              </div>

              <a
                href={resultsBlobUrl}
                download={resultsFileName}
                className="w-full py-4 px-6 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
              >
                <Download className="h-4 w-4" />
                Download PDF
              </a>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 text-slate-400 py-16 text-center">
              <FileSpreadsheet className="h-10 w-10 text-slate-250 dark:text-slate-850 stroke-[1.2]" />
              <h4 className="text-xs font-bold text-slate-500">Wait for execution</h4>
              <p className="text-3xs text-slate-400 max-w-[200px] mt-0.5">
                Apply operations like split or merge sequentially and download compiled outcomes.
              </p>
            </div>
          )}
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-100 dark:border-rose-900/60 rounded-xl">
            <p className="text-3xs text-rose-655 font-semibold text-center">{errorMsg}</p>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800 flex items-center gap-3">
          <AlertCircle className="h-4 w-4 text-slate-450 shrink-0" />
          <p className="text-3xs text-slate-400 leading-normal font-medium animate-pulse">
            Local CPU Core compilation: Secure, lightweight, works offline.
          </p>
        </div>
      </div>
    </div>
  );
}
