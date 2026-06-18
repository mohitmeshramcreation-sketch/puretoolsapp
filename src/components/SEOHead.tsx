import { useEffect } from "react";
import { PageId } from "../types";

interface SEOHeadProps {
  pageId: PageId;
  toolName?: string;
}

export default function SEOHead({ pageId, toolName }: SEOHeadProps) {
  useEffect(() => {
    let title = "PureTools - Free, Simple & Privacy-First Online Tools";
    let description = "Free online PDF, Image Compressor, File Converter, QR Code, and AI Text tools. Fast, secure, and registration-free utility platform.";
    let keywords = "free online tools, PDF tools online, compress PDF online, image compressor, convert files online, free AI tools, QR code generator";
    let schemaJson: any = null;

    const baseSchema = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "PureTools",
      "url": "https://ais-pre-xdl4dxjr6aljj3m2ecxggc-1019715178748.asia-southeast1.run.app/",
      "operatingSystem": "All",
      "applicationCategory": "UtilityApplication",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };

    switch (pageId) {
      case "home":
        title = "PureTools | Free Online Tools To Make Your Work Easier";
        description = "Discover PureTools, an offline-first, private-by-design library of essential online tools: PDF utility suite, high-ratio Image Compressor, Universal File Converter, custom QR layout, and server-side Gemini AI Text Assistant.";
        schemaJson = {
          ...baseSchema,
          "name": "PureTools Home",
          "description": description,
        };
        break;
      case "all-tools":
        title = "All Tools | PureTools Essential Utilities Suite";
        description = "Browse our selection of the 5 most popular and high-performance developer and document utilities: PDF editing, image sizing, asset conversions, QR codes, and AI copywriting.";
        break;
      case "pdf-toolkit":
        title = "PDF Toolkit Online | Merge, Split & Compress PDF - PureTools";
        description = "Free client-side PDF utility. Perform PDF merge, PDF split, image to PDF, or custom file compression instantly in the browser without server transfers.";
        keywords = "compress PDF online, PDF tools online, merge pdf free, split pdf, image to pdf converter";
        schemaJson = {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": "PureTools PDF Toolkit",
          "applicationCategory": "BusinessApplication",
          "description": description,
        };
        break;
      case "image-compressor":
        title = "Image Compressor & WebP Converter - PureTools";
        description = "Compress JPG, PNG, and WEBP image files in bulk with customizable ratios. Instantly convert formats and resize dimensions entirely client-side.";
        keywords = "image compressor, compress png, compress jpeg, batch image compressor, webp converter";
        schemaJson = {
          ...baseSchema,
          "@type": "SoftwareApplication",
          "name": "PureTools Image Compressor",
          "applicationCategory": "DesignApplication",
          "description": description,
        };
        break;
      case "file-converter":
        title = "Universal File Converter | JPG, PNG, WEBP, TXT to PDF - PureTools";
        description = "Convert image formats (PNG to JPG, JPG to PNG, WEBP to JPG) and TXT documents directly to PDF standard format effortlessly in milliseconds.";
        keywords = "convert files online, png to jpg free, jpg to png, convert webp to jpeg, txt to pdf tool";
        break;
      case "qr-generator":
        title = "QR Code Generator free | Make Custom QRs - PureTools";
        description = "Instantly generate custom QR codes for URLs, plain texts, emails, call lines, or WiFi access networks. Download custom QR as high-quality PNG.";
        keywords = "QR code generator, generate qr, free qr code layout, custom wireless qr, phone call qr maker";
        break;
      case "ai-text-tools":
        title = "AI Text Tools & Writing Assistant - PureTools";
        description = "Leverage Gemini 3.5 AI models to summarize long documents, proofread syntax, rewrite copies in multiple tones, or brainstorm creative ideas instantly.";
        keywords = "free AI tools, AI writing assistant, ai grammar fixer, ai document summarizer, rewriting tool";
        break;
      case "about":
        title = "About Our Philosophy | PureTools Core Values";
        description = "Why we created PureTools: to build simple, powerful, high-performance web applications that respect user privacy, run client-side, and carry zero tracking.";
        break;
      case "contact":
        title = "Contact Support | PureTools Feedback Channels";
        description = "Get in touch with the PureTools engineers. Send feedback, submit bug reports, or request feature additions directly.";
        break;
      case "privacy":
        title = "Privacy Policy - PureTools Core Protections";
        description = "Read how PureTools protects your safety. Because we process your files entirely in the browser memory, they are never uploaded to our servers.";
        break;
      case "terms":
        title = "Terms & Conditions - PureTools Operational Agreements";
        description = "Read our simplified operational terms and agreements. High-performance, license-free visual tools for all personal or commercial workflows.";
        break;
      case "disclaimer":
        title = "Disclaimer & Warranties - PureTools Safety Sheets";
        description = "PureTools provides browser-based utility services 'as is'. Learn more about file security and non-liability rules.";
        break;
    }

    // Update document title
    document.title = title;

    // Head element selections
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    let metaKeys = document.querySelector('meta[name="keywords"]');
    if (!metaKeys) {
      metaKeys = document.createElement("meta");
      metaKeys.setAttribute("name", "keywords");
      document.head.appendChild(metaKeys);
    }
    metaKeys.setAttribute("content", keywords);

    // Open Graph meta tags updates
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    // Inject JSON-LD Schema Markup
    const existingSchemaScript = document.getElementById("puretools-ld-schema");
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schemaJson) {
      const script = document.createElement("script");
      script.id = "puretools-ld-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemaJson);
      document.head.appendChild(script);
    }
  }, [pageId, toolName]);

  return null;
}
