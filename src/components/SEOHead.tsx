import { useEffect } from "react";
import { PageId } from "../types";

interface SEOHeadProps {
  pageId: PageId;
  toolName?: string;
}

export default function SEOHead({ pageId, toolName }: SEOHeadProps) {
  useEffect(() => {
    // Base URL configuration for canonicals and graphs
    const baseUrl = "https://puretool.online";
    const currentSlug = pageId === "home" ? "" : pageId;
    const canonicalUrl = `${baseUrl}/${currentSlug}`;

    let title = "PureTool - Free Online Tools & Useful Utilities Suite";
    let description = "Discover PureTool, an offline-first library of free online tools: high-ratio image compressor, PDF tools online, universal file converter, free QR code generator, and AI writing tools.";
    let keywords = "free online tools, online tools website, free productivity tools, best free web tools, useful online utilities, all in one online tools";
    
    // Multi-schema containment array
    let schemas: any[] = [];

    // Base organization object
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#organization`,
      "name": "PureTool",
      "url": baseUrl,
      "logo": `${baseUrl}/favicon.png`,
    };

    // Base website object
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#website`,
      "url": baseUrl,
      "name": "PureTool",
      "description": "Free, simple and guest-friendly all-in-one web utilities platform.",
      "publisher": { "@id": `${baseUrl}/#organization` }
    };

    // Breadcrumb list logic generator
    const generateBreadcrumb = (name: string, path: string) => {
      const items = [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": baseUrl
        }
      ];
      if (path) {
        items.push({
          "@type": "ListItem",
          "position": 2,
          "name": name,
          "item": `${baseUrl}/${path}`
        });
      }
      return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "description": `Breadcrumb navigation structure for ${name}`,
        "itemListElement": items
      };
    };

    switch (pageId) {
      case "home":
        title = "PureTool - Free Online Tools Website | Best Free Web Tools & Useful Online Utilities";
        description = "Discover PureTool, your all-in-one online tools website featuring free productivity tools, high-speed file converter utility blocks, PNG/JPG compressors, and advanced AI assistants with pure client-side privacy.";
        keywords = "free online tools, online tools website, free productivity tools, best free web tools, useful online utilities, all in one online tools";
        
        schemas = [
          organizationSchema,
          websiteSchema,
          generateBreadcrumb("Home", ""),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes PureTool the best free web tools platform?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "PureTool offers highly secure, offline-first web technologies. Processing (like file optimization, PDF operations, or image format modifications) is carried out directly on your browser sandbox without document files ever leaving your device, delivering perfect data-privacy and safety."
                }
              },
              {
                "@type": "Question",
                "name": "Are there limits or fee tiers to compile files or compress assets?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "No. PureTool provides unlimited access to all system utilities including its file converter, JPG compressor, and custom QR maker completely free without registration constraints, membership obligations, or hidden credit systems."
                }
              },
              {
                "@type": "Question",
                "name": "Do you collect, inspect, or retain user files on remote servers?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely not. All document transformations, asset merges, and image reductions are computed entirely client-side using JavaScript/WebAssembly memory models. We carry zero databases or cloud pipelines that monitor, save, or store your private upload material."
                }
              }
            ]
          }
        ];
        break;

      case "all-tools":
        title = "All Tools Suite | Browse Useful Online Utilities - PureTool";
        description = "Explore our entire clean hub of free online tools. Easily compress image files without losing quality, perform PDF split and merges, convert layouts, make wireless QR codes, or apply serverless text proofreading.";
        keywords = "all in one online tools, online tools website, best free web tools, free productivity tools, useful online utilities";
        
        schemas = [
          generateBreadcrumb("All Tools", "all-tools"),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How do I filter and find specific free online tools on PureTool?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You can use our global search input field or toggle visual categories (such as Documents, Design, and AI Assist) to instantly reveal specific utilities suited for your workflow."
                }
              }
            ]
          }
        ];
        break;

      case "pdf-toolkit":
        title = "Free PDF Tools Online | Merge, Split & Compress PDF - PureTool";
        description = "Make your paperwork easy with free PDF tools online. Instantly merge PDF online, split PDF online, compress PDF files, or compile images directly into standard Adobe formats safely in your local browser environment.";
        keywords = "free PDF tools online, compress PDF online, merge PDF online, split PDF online, convert PDF files";
        
        schemas = [
          generateBreadcrumb("PDF Toolkit", "pdf-toolkit"),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PureTool PDF Toolkit",
            "operatingSystem": "All",
            "applicationCategory": "BusinessApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Web utility to merge PDF online, split PDF pages, convert image sets to PDF document, and compress PDF metadata directly."
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How to merge PDF online safely and quickly?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Simply drag multiple PDF files into our clean interface, re-order them using the layout cards, and click 'Merge PDF Files'. The operation completes instantly in browser memory."
                }
              },
              {
                "@type": "Question",
                "name": "Does the system maintain file styling during a split PDF operation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. Our split parser identifies your designated page ranges and separates them cleanly without altering embedded typography, layout grids, images, or vectorized assets."
                }
              }
            ]
          }
        ];
        break;

      case "image-compressor":
        title = "Image Compressor Online | Compress Image Without Losing Quality - PureTool";
        description = "Use our state-of-the-art image compressor online. Easily compress image without losing quality. Fully functional JPG compressor, PNG compressor, and multi-format resizer that works entirely in-browser.";
        keywords = "image compressor online, compress image without losing quality, JPG compressor, PNG compressor, image converter online";
        
        schemas = [
          generateBreadcrumb("Image Compressor", "image-compressor"),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PureTool Image Compressor",
            "operatingSystem": "All",
            "applicationCategory": "DesignApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "High performance image compressor online optimized for PNG, JPG, and WebP compression with zero quality degradation."
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How can I compress image without losing quality?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our intelligent browser engine compresses images by utilizing visual science algorithms, removing redundant metadata metadata and adjusting non-visible color blocks to lower file weight while preserving pixel layouts."
                }
              }
            ]
          }
        ];
        break;

      case "file-converter":
        title = "Universal File Converter | Convert PDF Files & Multi-Format Images - PureTool";
        description = "Highly reliable image converter online. Convert PDF files, shift text documents to clean layouts, convert PNG to JPG, or transcode WebP instantly. Secure client-side execution.";
        keywords = "convert PDF files, image converter online, png to jpg converter, doc txt format shifts, webp transcoder";
        
        schemas = [
          generateBreadcrumb("File Converter", "file-converter"),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Universal File Converter",
            "operatingSystem": "All",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Convert PDF files, images, WebP blocks, PNG formats, and standard texts entirely in client memory."
          }
        ];
        break;

      case "qr-generator":
        title = "Free QR Code Generator | Create QR Code Online Instantly - PureTool";
        description = "Create custom layout markers with our free QR code generator. Quickly create QR code online for any URL QR generator parameters, phone calls, text, or local WiFi passwords.";
        keywords = "free QR code generator, create QR code online, URL QR generator, wireless layout generator";
        
        schemas = [
          generateBreadcrumb("QR Code Generator", "qr-generator"),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "PureTool QR Code Generator",
            "operatingSystem": "All",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Generate standard custom URL QR code structures, download in high-density transparent formats."
          }
        ];
        break;

      case "ai-text-tools":
        title = "Free AI Writing Tools | Best AI Text Summarizer & Grammar Check - PureTool";
        description = "Supercharge your copywriting workflows. Use free AI writing tools: powerful AI text summarizer, instant AI grammar checker, rewrite variations engine, and AI content assistant powered by secure models.";
        keywords = "free AI writing tools, AI text summarizer, AI grammar checker, AI content assistant, intelligence rewrites";
        
        schemas = [
          generateBreadcrumb("AI Text Tools", "ai-text-tools"),
          {
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "AI Text Assistant Tools",
            "operatingSystem": "All",
            "applicationCategory": "UtilitiesApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "description": "Suite of free AI writing tools including text summarizer, grammar corrector, creative brainstormers, and tone editors."
          },
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What AI model drives the text summarizer and content analyzer?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our writing assistant is driven by Google's high-speed, state-of-the-art Gemini LLM ecosystem, assuring smart and natural responses."
                }
              }
            ]
          }
        ];
        break;

      case "seo-optimizer":
        title = "Google Search Console SEO Hook & Meta Tag Verification - PureTool";
        description = "Optimize your website to rank at the top of Google Search. Prepare sitemaps, construct robots.txt files, and inject site verification tokens index-ready instantly.";
        keywords = "google site verification tag, sitemap generator online, robots txt builder, google search console optimization, rank at top search";
        schemas = [generateBreadcrumb("SEO & Search Console Optimizer", "seo-optimizer")];
        break;

      case "about":
        title = "About Our Free Productivity Tools Philosophy - PureTool";
        description = "Understand the principles of our all in one online tools. PureTool was engineered to offer beautiful online utilities with zero bloat, cookie tracking, or user storage logs.";
        keywords = "about online tools, best free web tools Philosophy, zero tracking utilities";
        schemas = [generateBreadcrumb("About Us", "about")];
        break;

      case "contact":
        title = "Contact Us | Feedback for Free Productivity Tools Hub - PureTool";
        description = "Get in touch with the development ecosystem behind PureTool. Submit ideas, request new file converter layouts, or report issues directly.";
        keywords = "contact puretool, support email, suggest features, bug reports";
        schemas = [generateBreadcrumb("Contact Us", "contact")];
        break;

      case "privacy":
        title = "Privacy Policy | Safest Online Tools Website Promise - PureTool";
        description = "Read how we secure your data. Since all our useful online utilities run inside your browser, user files are never processed or saved on a remote server.";
        keywords = "privacy policy, offline state safety, local files memory, security";
        schemas = [generateBreadcrumb("Privacy Policy", "privacy")];
        break;

      case "terms":
        title = "Terms of Service | PureTool browser apps agreements";
        description = "Learn more about our simplified terms structure. Open usage licenses, zero hidden memberships, and non-liability terms.";
        keywords = "terms of service, legal agreements, usage license";
        schemas = [generateBreadcrumb("Terms of Service", "terms")];
        break;

      case "disclaimer":
        title = "Warranty Disclaimer | PureTool browser compilation limits";
        description = "Read our standard warranty disclaimer regarding browser capabilities, storage memory structures, and regional compliance factors.";
        keywords = "disclaimer, warrant limits, local browser memory";
        schemas = [generateBreadcrumb("Disclaimer", "disclaimer")];
        break;
    }

    // Dynamic head metadata assignments
    document.title = title;

    // 1. Description Tag
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", description);

    // 2. Keywords Tag
    let metaKeys = document.querySelector('meta[name="keywords"]');
    if (!metaKeys) {
      metaKeys = document.createElement("meta");
      metaKeys.setAttribute("name", "keywords");
      document.head.appendChild(metaKeys);
    }
    metaKeys.setAttribute("content", keywords);

    // 3. Canonical Link Header
    let linkCan = document.querySelector('link[rel="canonical"]');
    if (!linkCan) {
      linkCan = document.createElement("link");
      linkCan.setAttribute("rel", "canonical");
      document.head.appendChild(linkCan);
    }
    linkCan.setAttribute("href", canonicalUrl);

    // 4. Open Graph - URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (!ogUrl) {
      ogUrl = document.createElement("meta");
      ogUrl.setAttribute("property", "og:url");
      document.head.appendChild(ogUrl);
    }
    ogUrl.setAttribute("content", canonicalUrl);

    // 5. Open Graph - Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement("meta");
      ogTitle.setAttribute("property", "og:title");
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute("content", title);

    // 6. Open Graph - Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement("meta");
      ogDesc.setAttribute("property", "og:description");
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute("content", description);

    // 7. Twitter - URL
    let twUrl = document.querySelector('meta[name="twitter:url"]');
    if (!twUrl) {
      twUrl = document.createElement("meta");
      twUrl.setAttribute("name", "twitter:url");
      document.head.appendChild(twUrl);
    }
    twUrl.setAttribute("content", canonicalUrl);

    // 8. Twitter - Title
    let twTitle = document.querySelector('meta[name="twitter:title"]');
    if (!twTitle) {
      twTitle = document.createElement("meta");
      twTitle.setAttribute("name", "twitter:title");
      document.head.appendChild(twTitle);
    }
    twTitle.setAttribute("content", title);

    // 9. Twitter - Description
    let twDesc = document.querySelector('meta[name="twitter:description"]');
    if (!twDesc) {
      twDesc = document.createElement("meta");
      twDesc.setAttribute("name", "twitter:description");
      document.head.appendChild(twDesc);
    }
    twDesc.setAttribute("content", description);

    // Inject complex composite JSON-LD Schema Markup
    const existingSchemaScript = document.getElementById("puretool-ld-schema");
    if (existingSchemaScript) {
      existingSchemaScript.remove();
    }

    if (schemas && schemas.length > 0) {
      const script = document.createElement("script");
      script.id = "puretool-ld-schema";
      script.type = "application/ld+json";
      script.text = JSON.stringify(schemas.length === 1 ? schemas[0] : schemas);
      document.head.appendChild(script);
    }
  }, [pageId, toolName]);

  return null;
}

