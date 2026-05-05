import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import PriceEditor from "./PriceEditor";

export default async function ManagePracticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/practice");

  const admin = createAdminClient();

  // Fetch practice owned by this user
  const { data: practice } = await admin
    .from("practices")
    .select("*")
    .eq("claimed_by", user.id)
    .maybeSingle();

  if (!practice) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">No practice found</h1>
        <p className="text-sm text-gray-500 mb-4">
          You have not claimed a practice yet.
        </p>
        <Link href="/claim" className="text-sm text-blue-600 hover:text-blue-700">
          Claim your practice →
        </Link>
      </div>
    );
  }

  // Fetch current prices
  const { data: prices } = await admin
    .from("current_prices")
    .select("procedure_key, price, notes")
    .eq("practice_id", practice.id);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 mb-6 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">Manage {practice.name}</h1>
      <p className="text-sm text-gray-500 mb-8">
        Update your practice info and prices. Changes go live within 1 minute.
      </p>

      <PriceEditor
        practiceId={practice.id}
        initialPrices={(prices ?? []) as Array<{ procedure_key: string; price: number; notes: string | null }>}
      />
    </div>
  );
}
