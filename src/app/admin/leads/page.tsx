import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { MessageSquare, Clock } from "lucide-react";

export default async function AdminLeadsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/leads");

  const admin = createAdminClient();

  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Access denied</h1>
        <p className="text-sm text-gray-500 mt-2">Admin privileges required.</p>
      </div>
    );
  }

  const { data: leads } = await admin
    .from("leads")
    .select("*, practices(name, slug, town)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">All Leads</h1>
      </div>

      {!leads || leads.length === 0 ? (
        <p className="text-sm text-gray-400">No leads yet.</p>
      ) : (
        <div className="space-y-3">
          {leads.map((lead: Record<string, unknown>) => {
            const practice = lead.practices as { name: string; town: string } | null;
            return (
              <div key={lead.id as string} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {lead.customer_name as string}
                    </p>
                    <p className="text-xs text-gray-500">
                      {lead.customer_email as string}
                      {lead.customer_phone ? ` · ${lead.customer_phone}` : ""}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {lead.pet_type as string} · {lead.service as string} · {practice?.name}, {practice?.town}
                    </p>
                    {typeof lead.message === "string" && lead.message && (
                      <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded-lg p-3">
                        {lead.message}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {!(lead.is_read as boolean) && (
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    )}
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(lead.created_at as string).toLocaleDateString("en-GB")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
