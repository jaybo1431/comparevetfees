"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";

interface Claim {
  id: string;
  practice_id: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
  evidence: string | null;
  created_at: string;
  profiles: { email: string; full_name: string | null } | null;
  practices: { name: string; slug: string; town: string } | null;
}

export default function ClaimsAdmin({ claims: initialClaims }: { claims: Claim[] }) {
  const [claims, setClaims] = useState(initialClaims);
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (claimId: string, action: "approved" | "rejected") => {
    setLoading(claimId);

    const res = await fetch("/api/admin/claims", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claimId, action }),
    });

    if (res.ok) {
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: action } : c))
      );
    }

    setLoading(null);
  };

  return (
    <div className="space-y-4">
      {claims.length === 0 && (
        <p className="text-sm text-gray-400">No claims yet.</p>
      )}

      {claims.map((claim) => (
        <div key={claim.id} className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {claim.practices?.name} — {claim.practices?.town}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                By {claim.profiles?.full_name || claim.profiles?.email} &middot;{" "}
                {new Date(claim.created_at).toLocaleDateString("en-GB")}
              </p>
              {claim.evidence && (
                <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3">
                  {claim.evidence}
                </p>
              )}
            </div>

            <div className="shrink-0">
              {claim.status === "pending" ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleAction(claim.id, "approved")}
                    disabled={loading === claim.id}
                    className="bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(claim.id, "rejected")}
                    disabled={loading === claim.id}
                    className="bg-red-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Reject
                  </button>
                </div>
              ) : (
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    claim.status === "approved"
                      ? "bg-green-50 text-green-700"
                      : "bg-red-50 text-red-600"
                  }`}
                >
                  {claim.status}
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
