import { Info, ExternalLink } from "lucide-react";

export default function CMABanner() {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
      <Info className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-blue-900">
          New CMA Regulations — March 2026
        </p>
        <p className="text-sm text-blue-700 mt-1">
          The Competition and Markets Authority now requires all UK vet practices to publish standardised
          price lists. Large chains must comply by December 2026, smaller practices by March 2027.
          This means more transparent pricing for pet owners across the UK.
        </p>
        <a
          href="https://www.gov.uk/government/news/cma-concludes-market-investigation-with-major-reforms-to-veterinary-sector"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 mt-2 font-medium"
        >
          Read the CMA report <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
