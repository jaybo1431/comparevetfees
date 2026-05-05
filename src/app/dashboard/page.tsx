import { redirect } from "next/navigation";
import Link from "next/link";
import { Heart, Building2, MessageSquare, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  const admin = createAdminClient();

  // Fetch user profile
  const { data: profile } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch saved practices
  const { data: savedPractices } = await admin
    .from("saved_practices")
    .select("practice_id, practices(name, slug, town)")
    .eq("user_id", user.id);

  // Fetch user's claims
  const { data: claims } = await admin
    .from("practice_claims")
    .select("id, status, created_at, practices(name, slug)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // If practice owner, fetch their leads
  const { data: ownedPractice } = await admin
    .from("practices")
    .select("id, name, slug")
    .eq("claimed_by", user.id)
    .maybeSingle();

  let leads: Array<{ id: string; customer_name: string; service: string; is_read: boolean; created_at: string }> = [];
  if (ownedPractice) {
    const { data } = await admin
      .from("leads")
      .select("id, customer_name, service, is_read, created_at")
      .eq("practice_id", ownedPractice.id)
      .order("created_at", { ascending: false })
      .limit(10);
    leads = (data ?? []) as typeof leads;
  }

  const displayName = profile?.full_name || user.email?.split("@")[0] || "User";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-8">Welcome back, {displayName}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Practices */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5 text-red-500" />
            <h2 className="text-sm font-semibold text-gray-900">Saved Practices</h2>
          </div>
          {savedPractices && savedPractices.length > 0 ? (
            <ul className="space-y-2">
              {savedPractices.map((sp: Record<string, unknown>) => {
                const practice = sp.practices as { name: string; slug: string; town: string } | null;
                return (
                  <li key={sp.practice_id as string}>
                    <Link
                      href={`/practice/${practice?.slug}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      {practice?.name} — {practice?.town}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-gray-400">No saved practices yet.</p>
          )}
        </div>

        {/* Claims */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-sm font-semibold text-gray-900">Your Claims</h2>
          </div>
          {claims && claims.length > 0 ? (
            <ul className="space-y-3">
              {claims.map((claim: Record<string, unknown>) => {
                const practice = claim.practices as { name: string; slug: string } | null;
                return (
                  <li key={claim.id as string} className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">{practice?.name}</span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        claim.status === "approved"
                          ? "bg-green-50 text-green-700"
                          : claim.status === "rejected"
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                      }`}
                    >
                      {claim.status as string}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div>
              <p className="text-sm text-gray-400 mb-3">No claims yet.</p>
              <Link href="/claim" className="text-sm text-blue-600 hover:text-blue-700">
                Claim your practice →
              </Link>
            </div>
          )}
        </div>

        {/* Leads (practice owners) */}
        {ownedPractice && (
          <div className="bg-white rounded-xl border border-gray-200 p-5 md:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h2 className="text-sm font-semibold text-gray-900">
                  Recent Enquiries — {ownedPractice.name}
                </h2>
              </div>
              <Link
                href="/dashboard/practice"
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Manage practice →
              </Link>
            </div>
            {leads.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {leads.map((lead) => (
                  <div key={lead.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{lead.customer_name}</p>
                      <p className="text-xs text-gray-500">{lead.service}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!lead.is_read && (
                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(lead.created_at).toLocaleDateString("en-GB")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No enquiries yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
