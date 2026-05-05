import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Building2, Check, X as XIcon } from "lucide-react";

export default async function AdminPracticesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/practices");

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

  const { data: practices } = await admin
    .from("practices")
    .select("id, slug, name, town, is_claimed, is_published, is_independent, parent_group")
    .order("name");

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="w-6 h-6 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">All Practices</h1>
        <span className="text-sm text-gray-400 ml-2">({practices?.length ?? 0})</span>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Practice</th>
              <th className="text-left px-4 py-3 font-medium text-gray-700">Town</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Independent</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Claimed</th>
              <th className="text-center px-4 py-3 font-medium text-gray-700">Published</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {practices?.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/practice/${p.slug}`} className="text-blue-600 hover:text-blue-700 font-medium">
                    {p.name}
                  </Link>
                  {p.parent_group && (
                    <span className="text-xs text-gray-400 ml-2">{p.parent_group}</span>
                  )}
                </td>
                <td className="px-4 py-3 text-gray-600">{p.town}</td>
                <td className="px-4 py-3 text-center">
                  {p.is_independent ? (
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <XIcon className="w-4 h-4 text-gray-300 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.is_claimed ? (
                    <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">Yes</span>
                  ) : (
                    <span className="text-xs text-gray-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {p.is_published ? (
                    <Check className="w-4 h-4 text-green-600 mx-auto" />
                  ) : (
                    <XIcon className="w-4 h-4 text-red-400 mx-auto" />
                  )}
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/practice/${p.slug}`}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
