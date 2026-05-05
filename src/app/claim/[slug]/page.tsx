"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Building2, Send } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ClaimPracticePage({ params }: PageProps) {
  const { slug } = use(params);
  const [user, setUser] = useState<User | null>(null);
  const [practice, setPractice] = useState<{ id: string; name: string; town: string; is_claimed: boolean } | null>(null);
  const [evidence, setEvidence] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push(`/login?redirect=/claim/${slug}`);
        return;
      }
      setUser(user);
    });

    supabase
      .from("practices")
      .select("id, name, town, is_claimed")
      .eq("slug", slug)
      .single()
      .then(({ data }) => {
        setPractice(data);
      });
  }, [router, slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !practice) return;

    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: claimError } = await supabase.from("practice_claims").insert({
      practice_id: practice.id,
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
            Your claim for <strong>{practice?.name}</strong> is under review.
            We will email you within 24-48 hours.
          </p>
        </div>
      </div>
    );
  }

  if (!practice) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Loading practice...</p>
      </div>
    );
  }

  if (practice.is_claimed) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Already claimed</h2>
          <p className="text-sm text-gray-600">
            <strong>{practice.name}</strong> has already been claimed by another user.
            If you believe this is an error, please contact us.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        Claim {practice.name}
      </h1>
      <p className="text-sm text-gray-500 mb-8">
        Prove you own or manage this practice to update prices, respond to enquiries, and manage your listing.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <p className="text-sm font-medium text-gray-900">{practice.name}</p>
          <p className="text-xs text-gray-500">{practice.town}</p>
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
