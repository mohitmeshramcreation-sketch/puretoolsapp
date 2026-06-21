export type PageId =
  | "home"
  | "all-tools"
  | "pdf-toolkit"
  | "image-compressor"
  | "file-converter"
  | "qr-generator"
  | "ai-text-tools"
  | "seo-optimizer"
  | "about"
  | "contact"
  | "privacy"
  | "terms"
  | "disclaimer";

export interface ToolItem {
  id: PageId;
  name: string;
  category: "PDF" | "Image" | "Format" | "Marketing" | "AI";
  description: string;
  keywords: string[];
  icon: string; // Dynamic icon reference
  popular?: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BenefitItem {
  title: string;
  description: string;
  icon: string;
}

export interface ReviewItem {
  user: string;
  role: string;
  comment: string;
  rating: number;
}
