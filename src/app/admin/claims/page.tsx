import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import ClaimsAdmin from "./ClaimsAdmin";

export default async function AdminClaimsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/claims");

  const admin = createAdminClient();

  // Verify admin role
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

  // Fetch all claims
  const { data: claims } = await admin
    .from("practice_claims")
    .select("*, profiles(email, full_name), practices(name, slug, town)")
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Practice Claims</h1>
      <ClaimsAdmin claims={claims ?? []} />
    </div>
  );
}
