"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PRICE_KEYS, PROCEDURE_LABELS } from "@/data/practices";

interface PriceRow {
  procedure_key: string;
  price: number;
  notes: string | null;
}

interface PriceEditorProps {
  practiceId: string;
  initialPrices: PriceRow[];
}

export default function PriceEditor({ practiceId, initialPrices }: PriceEditorProps) {
  const priceMap = new Map(initialPrices.map((p) => [p.procedure_key, p]));

  const [prices, setPrices] = useState<Record<string, string>>(
    Object.fromEntries(PRICE_KEYS.map((k) => [k, priceMap.get(k)?.price?.toString() ?? ""]))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);

    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];

    const rows = PRICE_KEYS
      .filter((k) => prices[k] && parseFloat(prices[k]) > 0)
      .map((k) => ({
        practice_id: practiceId,
        procedure_key: k,
        price: parseFloat(prices[k]),
        notes: priceMap.get(k)?.notes ?? null,
        effective_from: today,
      }));

    const { error: upsertError } = await supabase
      .from("prices")
      .upsert(rows, { onConflict: "practice_id,procedure_key,effective_from" });

    if (upsertError) {
      setError(upsertError.message);
    } else {
      setSaved(true);
    }

    setSaving(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">Your Prices</h2>
        <p className="text-sm text-gray-500">Update any price below and hit save.</p>
      </div>

      <div className="divide-y divide-gray-50">
        {PRICE_KEYS.map((key) => {
          const label = PROCEDURE_LABELS[key];
          if (!label) return null;

          return (
            <div key={key} className="flex items-center justify-between px-5 py-3">
              <label htmlFor={key} className="text-sm text-gray-700">
                {label}
              </label>
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-400">&pound;</span>
                <input
                  id={key}
                  type="number"
                  step="0.01"
                  min="0"
                  value={prices[key]}
                  onChange={(e) => setPrices({ ...prices, [key]: e.target.value })}
                  className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-right focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 border-t border-gray-100">
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
            {error}
          </p>
        )}
        {saved && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-3 mb-3">
            Prices saved. Changes will be visible within 1 minute.
          </p>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 text-white font-medium px-5 py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : "Save prices"}
        </button>
      </div>
    </div>
  );
}
