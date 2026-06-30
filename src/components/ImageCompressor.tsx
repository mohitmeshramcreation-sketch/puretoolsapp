import { useState, useRef, ChangeEvent } from "react";
import { Upload, Download, HelpCircle, Image as ImageIcon, Sparkles, Sliders, Check, AlertCircle, RefreshCw } from "lucide-react";

interface CompressedFile {
  id: string;
  name: string;
  originalSize: number;
  compressedSize: number;
  originalUrl: string;
  compressedUrl: string;
  width: number;
  height: number;
  format: string;
}

interface ImageCompressorProps {
  initialFormat?: "original" | "image/jpeg" | "image/png" | "image/webp";
  isResizer?: boolean;
}

export default function ImageCompressor({ initialFormat = "original", isResizer = false }: ImageCompressorProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [processedFiles, setProcessedFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(80); // 10-100%
  const [targetWidthPercent, setTargetWidthPercent] = useState(isResizer ? 75 : 100); // 10-100% scale
  const [targetFormat, setTargetFormat] = useState<"original" | "image/jpeg" | "image/png" | "image/webp">(initialFormat);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFormatExtension = (mimeType: string) => {
    if (mimeType === "image/jpeg") return "jpg";
    if (mimeType === "image/png") return "png";
    if (mimeType === "image/webp") return "webp";
    return "bin";
  };

  const processImages = async () => {
    if (selectedFiles.length === 0) return;
    setIsProcessing(true);
    const results: CompressedFile[] = [];

    for (const file of selectedFiles) {
      try {
        const result = await compressSingleImage(file);
        results.push(result);
      } catch (err) {
        console.error("Failed to compress image:", file.name, err);
      }
    }

    setProcessedFiles(results);
    setIsProcessing(false);
  };

  const compressSingleImage = (file: File): Promise<CompressedFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          // Calculate scale dimensions
          const scale = targetWidthPercent / 100;
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);

          // Prepare canvas
          const canvas = document.createElement("canvas");
          canvas.width = w;
          canvas.height = h;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Unable to create offscreen Canvas context."));
            return;
          }

          // Simple white background fill specifically for PNG to JPEG conversions
          const outputMime = targetFormat === "original" ? file.type : targetFormat;
          if (outputMime === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, w, h);
          }

          ctx.drawImage(img, 0, 0, w, h);

          // Compress and convert formats
          const targetQuality = quality / 100;
          const dataUrl = canvas.toDataURL(outputMime, targetQuality);

          // Convert dataurl back to check final compressed size
          const head = "data:" + outputMime + ";base64,";
          const approxSize = Math.round((dataUrl.length - head.length) * 3 / 4);

          // Generate file target name
          const ext = getFormatExtension(outputMime);
          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
          const processedName = `${nameWithoutExt}_purecompressed.${ext}`;

          resolve({
            id: Math.random().toString(36).substring(7),
            name: processedName,
            originalSize: file.size,
            compressedSize: approxSize,
            originalUrl: event.target?.result as string,
            compressedUrl: dataUrl,
            width: w,
            height: h,
            format: outputMime
          });
        };
        img.onerror = () => reject(new Error("Failed to load source image object."));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("File reader read error."));
      reader.readAsDataURL(file);
    });
  };

  const triggerDownload = (compressed: CompressedFile) => {
    const link = document.createElement("a");
    link.href = compressed.compressedUrl;
    link.download = compressed.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    processedFiles.forEach((file) => triggerDownload(file));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <div id="image_compressor_tool" className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      {/* Upload Container Zone */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
          <h3 className="font-display text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-indigo-500" />
            {isResizer ? "Image Resizer Pro" : "Upload Target Images"}
          </h3>

          {/* Upload Drop Container */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 dark:hover:border-indigo-650 rounded-2xl p-10 bg-slate-50/40 dark:bg-slate-950/20 hover:bg-slate-50 dark:hover:bg-slate-950/40 cursor-pointer transition select-none text-center"
          >
            <Upload className="h-10 w-10 text-slate-400 dark:text-slate-650 mb-3 animate-bounce" />
            <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Drag & Drop your images here, or <span className="text-indigo-500 hover:underline">browse</span>
            </h4>
            <p className="text-3xs text-slate-400 mt-2">
              Supports bulk JPG, PNG, or WEBP. All actions occur entirely in sandbox browser memory.
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Uploaded Files Manifest list */}
          {selectedFiles.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex justify-between items-center px-1">
                <span className="text-xs font-bold text-slate-500">Selected Queue ({selectedFiles.length})</span>
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-3xs font-semibold text-rose-500 hover:underline"
                >
                  Clear Queue
                </button>
              </div>

              <div className="max-h-48 overflow-y-auto pr-1 space-y-1.5 scrollbar-thin">
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center p-3 bg-slate-50/50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-850"
                  >
                    <div className="flex items-center gap-2.5 overflow-hidden">
                      <ImageIcon className="h-4 w-4 text-slate-400 shrink-0" />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px] md:max-w-xs">
                        {file.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-slate-400">{formatFileSize(file.size)}</span>
                      <button
                        onClick={() => removeSelectedFile(idx)}
                        className="text-slate-400 hover:text-rose-500 p-0.5 rounded transition"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Configurations sliders */}
        {selectedFiles.length > 0 && (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <h3 className="font-display text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="h-4 w-4 text-indigo-500" />
              Adjust Output Compression Parameters
            </h3>

            <div className="space-y-4">
              {/* Quality slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Target Quality Ratio</span>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between font-mono text-3xs text-slate-400">
                  <span>Small size (high compression)</span>
                  <span>Max Quality (lossless/original)</span>
                </div>
              </div>

              {/* Resize slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Scale Dimensions</span>
                  <span className="font-mono text-xs font-bold text-indigo-600 dark:text-indigo-400">{targetWidthPercent}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={targetWidthPercent}
                  onChange={(e) => setTargetWidthPercent(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              {/* Convert Drop list */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 block">Convert Core Format</label>
                <select
                  value={targetFormat}
                  onChange={(e) => setTargetFormat(e.target.value as any)}
                  className="w-full p-3 text-xs font-medium bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:text-slate-350"
                >
                  <option value="original">Keep Original Input Format</option>
                  <option value="image/jpeg">Convert bulk to JPEG (.jpg)</option>
                  <option value="image/png">Convert bulk to PNG (.png)</option>
                  <option value="image/webp">Convert bulk to WebP (.webp)</option>
                </select>
              </div>
            </div>

            <button
              onClick={processImages}
              disabled={isProcessing}
              className="w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition shadow-sm cursor-pointer"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Compressing, Converting & Resizing Image stream...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Apply Optimal Compression
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Visualizer outcomes grid */}
      <div className="lg:col-span-12 xl:col-span-5 bg-slate-100/30 dark:bg-slate-950/45 border border-slate-250/20 dark:border-slate-800 rounded-2xl p-6 flex flex-col justify-between min-h-[350px]">
        <div>
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xs font-bold font-mono text-indigo-500 uppercase tracking-widest bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded">
              Processed High-Efficiency Outputs
            </span>
            {processedFiles.length > 1 && (
              <button
                onClick={handleDownloadAll}
                className="text-xs font-bold flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Download className="h-3.5 w-3.5" /> Bulk Download
              </button>
            )}
          </div>

          {processedFiles.length > 0 ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {processedFiles.map((file) => {
                const savings = Math.max(0, Math.round(((file.originalSize - file.compressedSize) / file.originalSize) * 100));

                return (
                  <div
                    key={file.id}
                    className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-4 hover:shadow-2xs transition"
                  >
                    {/* Tiny visual thumbnail */}
                    <img
                      referrerPolicy="no-referrer"
                      src={file.compressedUrl}
                      alt={`Compressed preview of ${file.name} optimized via image compressor online`}
                      className="h-16 w-16 object-cover bg-slate-50 border border-slate-100 rounded-xl"
                    />

                    {/* Meta info details */}
                    <div className="flex-1 overflow-hidden space-y-1 text-center md:text-left">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-2.5 gap-y-1 text-3xs font-mono font-semibold text-slate-400">
                        <span>Original: {formatFileSize(file.originalSize)}</span>
                        <span>Processed: {formatFileSize(file.compressedSize)}</span>
                        <span>Res: {file.width}×{file.height} px</span>
                      </div>
                    </div>

                    {/* Savings badge + download button */}
                    <div className="flex items-center gap-3">
                      {savings > 0 && (
                        <span className="text-3xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/60 px-2 py-1 rounded-md">
                          -{savings}% Size SAVVED
                        </span>
                      )}
                      <button
                        onClick={() => triggerDownload(file)}
                        className="p-3 bg-slate-50 hover:bg-indigo-50 text-indigo-600 dark:bg-slate-800 dark:hover:bg-indigo-950 dark:text-indigo-400 dark:hover:text-indigo-300 rounded-xl transition border border-slate-150/40 dark:border-slate-800 cursor-pointer"
                        title="Download compressed image asset"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center gap-2 text-slate-400 py-16 text-center">
              <ImageIcon className="h-10 w-10 text-slate-200 dark:text-slate-850 stroke-[1.2]" />
              <h4 className="text-xs font-bold text-slate-500">Wait for your uploads</h4>
              <p className="text-3xs text-slate-400 max-w-[200px] mt-0.5">
                Add JPG, PNG, or WEBP images, configure compression parameters, and convert instantly.
              </p>
            </div>
          )}
        </div>

        {/* Dynamic total efficiency metrics */}
        {processedFiles.length > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-200/50 dark:border-slate-850 flex items-center gap-3 bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100/30 p-3 rounded-xl">
            <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0" />
            <p className="text-3xs text-indigo-950/70 dark:text-indigo-400 leading-normal font-medium">
              Privacy Shield Active: These image transformations took place locally. No image assets were exposed to our hosts.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
