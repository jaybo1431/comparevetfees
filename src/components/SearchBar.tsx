"use client";

import { useState } from "react";
import { Search, MapPin } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

export default function SearchBar({ onSearch, initialQuery = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  const suggestions = ["Bournemouth", "Poole", "Christchurch", "Dorchester", "Weymouth", "Wimborne"];

  return (
    <div>
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-center bg-white rounded-xl border-2 border-gray-200 focus-within:border-emerald-500 transition shadow-sm">
          <div className="pl-3 sm:pl-4">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 shrink-0" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your town, city, or postcode..."
            className="flex-1 min-w-0 px-2 sm:px-3 py-3 sm:py-4 text-sm sm:text-base bg-transparent outline-none placeholder:text-gray-400"
          />
          <button
            type="submit"
            className="mr-2 bg-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg hover:bg-emerald-700 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium shrink-0"
          >
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline sm:inline">Search</span>
          </button>
        </div>
      </form>
      <div className="flex flex-wrap gap-2 mt-3">
        <span className="text-xs text-gray-400">Popular:</span>
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => {
              setQuery(s);
              onSearch(s);
            }}
            className="text-xs text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full transition hover:bg-emerald-100"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
