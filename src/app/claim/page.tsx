"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface PracticeOption {
  id: string;
  slug: string;
  name: string;
  town: string;
  is_claimed: boolean;
}

export default function ClaimPage() {
  const [user, setUser] = useState<User | null>(null);
  const [practices, setPractices] = useState<PracticeOption[]>([]);
  const [selectedPractice, setSelectedPractice] = useState("");
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login?redirect=/claim");
        return;
      }
      setUser(user);
    });

    // Fetch unclaimed practices
    supabase
      .from("practices")
      .select("id, slug, name, town, is_claimed")
      .eq("is_published", true)
      .order("name")
      .then(({ data }) => {
        setPractices(data ?? []);
      });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPractice) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: claimError } = await supabase.from("practice_claims").insert({
      practice_id: selectedPractice,
      user_id: user.id,
      evidence,
    });

    if (claimError) {
      setError(claimError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  if (!user) return null;

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <Building2 className="w-10 h-10 text-blue-600 mx-auto mb-3" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Claim submitted</h2>
          <p className="text-sm text-gray-600">
            We will review your claim and get back to you within 24-48 hours.
            You will be notified by email.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Claim your practice</h1>
      <p className="text-sm text-gray-500 mb-8">
        Claiming your practice lets you update prices, respond to enquiries, and manage your listing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="practice" className="block text-sm font-medium text-gray-700 mb-1">
            Select your practice *
          </label>
          <select
            id="practice"
            required
            value={selectedPractice}
            onChange={(e) => setSelectedPractice(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          >
            <option value="">Choose a practice...</option>
            {practices.map((p) => (
              <option key={p.id} value={p.id} disabled={p.is_claimed}>
                {p.name} — {p.town}{p.is_claimed ? " (already claimed)" : ""}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="evidence" className="block text-sm font-medium text-gray-700 mb-1">
            How can we verify you? *
          </label>
          <textarea
            id="evidence"
            required
            rows={4}
            value={evidence}
            onChange={(e) => setEvidence(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
            placeholder="E.g. I am the practice manager / owner. My name is listed on the RCVS register under practice number..."
          />
          <p className="text-xs text-gray-400 mt-1">
            We may contact you to verify your identity before approving the claim.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          {loading ? "Submitting..." : "Submit claim"}
        </button>
      </form>
    </div>
  );
}
