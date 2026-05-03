"use client";

import { useState } from "react";
import { ArrowUpDown, TrendingDown, TrendingUp, Minus } from "lucide-react";
import { Practice, PROCEDURE_LABELS, PRICE_KEYS, PriceKey, getAveragePrice } from "@/data/practices";

interface PriceComparisonTableProps {
  practices: Practice[];
}

export default function PriceComparisonTable({ practices }: PriceComparisonTableProps) {
  const [selectedProcedure, setSelectedProcedure] = useState<PriceKey>("consultation");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const sorted = [...practices].sort((a, b) => {
    const aPrice = a.prices[selectedProcedure] ?? Infinity;
    const bPrice = b.prices[selectedProcedure] ?? Infinity;
    return sortOrder === "asc" ? aPrice - bPrice : bPrice - aPrice;
  });

  const avg = getAveragePrice(selectedProcedure);
  const prices = practices.map((p) => p.prices[selectedProcedure]).filter((p): p is number => p !== undefined);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900">Price Comparison</h3>
          <p className="text-xs sm:text-sm text-gray-500 truncate">Compare costs across {practices.length} practices</p>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedProcedure}
            onChange={(e) => setSelectedProcedure(e.target.value as PriceKey)}
            className="text-xs sm:text-sm border border-gray-200 rounded-lg px-2 sm:px-3 py-2 bg-white focus:outline-none focus:border-emerald-500 flex-1 sm:flex-none min-w-0"
          >
            {PRICE_KEYS.map((key) => (
              <option key={key} value={key}>
                {PROCEDURE_LABELS[key]}
              </option>
            ))}
          </select>
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition shrink-0"
            title={sortOrder === "asc" ? "Sort highest first" : "Sort lowest first"}
          >
            <ArrowUpDown className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 border-b border-gray-100">
        <div className="p-2 sm:p-3 text-center border-r border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-400">Lowest</p>
          <p className="text-base sm:text-lg font-bold text-emerald-600 whitespace-nowrap">£{min}</p>
        </div>
        <div className="p-2 sm:p-3 text-center border-r border-gray-100">
          <p className="text-[10px] sm:text-xs text-gray-400">Average</p>
          <p className="text-base sm:text-lg font-bold text-gray-700 whitespace-nowrap">£{avg}</p>
        </div>
        <div className="p-2 sm:p-3 text-center">
          <p className="text-[10px] sm:text-xs text-gray-400">Highest</p>
          <p className="text-base sm:text-lg font-bold text-red-500 whitespace-nowrap">£{max}</p>
        </div>
      </div>

      {/* Table */}
      <div className="divide-y divide-gray-50">
        {sorted.map((practice, idx) => {
          const price = practice.prices[selectedProcedure];
          if (price === undefined) return null;
          const diff = price - avg;
          const pct = ((price - min) / (max - min)) * 100;

          return (
            <div key={practice.slug} className="flex items-center px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition">
              <div className="w-6 sm:w-8 text-center shrink-0">
                <span className={`text-xs sm:text-sm font-bold ${idx === 0 ? "text-emerald-600" : "text-gray-400"}`}>
                  {idx + 1}
                </span>
              </div>
              <div className="flex-1 min-w-0 ml-2 sm:ml-3">
                <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{practice.name}</p>
                <p className="text-[10px] sm:text-xs text-gray-400 truncate">{practice.town} &middot; {practice.isIndependent ? "Independent" : practice.parentGroup}</p>
              </div>
              <div className="hidden md:block w-32 lg:w-48 mx-2 lg:mx-4">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      pct < 33 ? "bg-emerald-500" : pct < 66 ? "bg-amber-400" : "bg-red-400"
                    }`}
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  />
                </div>
              </div>
              <div className="text-right ml-2 sm:ml-3 shrink-0">
                <p className="text-sm sm:text-base font-bold text-gray-900 whitespace-nowrap">£{price}</p>
                <div className="flex items-center justify-end gap-0.5 sm:gap-1">
                  {diff < -3 ? (
                    <TrendingDown className="w-3 h-3 text-emerald-500 shrink-0" />
                  ) : diff > 3 ? (
                    <TrendingUp className="w-3 h-3 text-red-500 shrink-0" />
                  ) : (
                    <Minus className="w-3 h-3 text-gray-300 shrink-0" />
                  )}
                  <span
                    className={`text-[10px] sm:text-[11px] whitespace-nowrap ${
                      diff < -3 ? "text-emerald-600" : diff > 3 ? "text-red-500" : "text-gray-400"
                    }`}
                  >
                    {diff > 0 ? "+" : ""}
                    {diff !== 0 ? `£${diff}` : "avg"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
