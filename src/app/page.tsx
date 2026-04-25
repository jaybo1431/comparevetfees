"use client";

import { useState } from "react";
import { Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PracticeCard from "@/components/PracticeCard";
import PriceComparisonTable from "@/components/PriceComparisonTable";
import StatsBar from "@/components/StatsBar";
import CMABanner from "@/components/CMABanner";
import { practices, searchPractices } from "@/data/practices";

export default function HomePage() {
  const [results, setResults] = useState(practices);
  const [searched, setSearched] = useState(false);

  const handleSearch = (query: string) => {
    const filtered = searchPractices(query);
    setResults(filtered);
    setSearched(true);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-medium px-3 py-1.5 rounded-full mb-4">
              <Shield className="w-3.5 h-3.5" />
              Independent &middot; Transparent &middot; Free
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Know what your vet charges{" "}
              <span className="text-emerald-600">before you walk in.</span>
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Compare veterinary prices across Dorset practices.
              From Bournemouth to Weymouth — see the real costs, side by side.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <StatsBar />
      </section>

      {/* CMA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <CMABanner />
      </section>

      {/* Results */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Practice list */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                {searched ? `${results.length} practices found` : "All Practices"}
              </h2>
              {results.length < practices.length && (
                <button
                  onClick={() => {
                    setResults(practices);
                    setSearched(false);
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Show all
                </button>
              )}
            </div>
            <div className="space-y-3">
              {results.length > 0 ? (
                results.map((p) => <PracticeCard key={p.slug} practice={p} />)
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No practices found for that search.</p>
                  <p className="text-sm text-gray-400 mt-1">Try a different town or postcode.</p>
                </div>
              )}
            </div>
          </div>

          {/* Price comparison sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <PriceComparisonTable practices={results} />

              {/* Trust signals */}
              <div className="mt-6 bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Why CompareVetFees?</h3>
                <ul className="space-y-2.5">
                  {[
                    "100% independent — no vet pays to rank higher",
                    "Prices sourced from published practice data",
                    "Corporate vs independent ownership shown",
                    "Aligned with CMA transparency reforms",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Are you a veterinary practice?
          </h2>
          <p className="text-emerald-100 max-w-lg mx-auto mb-6">
            Claim your profile, update your prices, and reach thousands of local pet owners
            searching for transparent veterinary care.
          </p>
          <button className="bg-white text-emerald-700 font-medium px-6 py-3 rounded-lg hover:bg-emerald-50 transition inline-flex items-center gap-2">
            Claim Your Practice <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}
