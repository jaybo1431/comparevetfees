import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: NextRequest) {
  // Verify the calling user is an admin
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { claimId, action } = await request.json();

  if (!claimId || !["approved", "rejected"].includes(action)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get the claim
  const { data: claim } = await admin
    .from("practice_claims")
    .select("practice_id, user_id")
    .eq("id", claimId)
    .single();

  if (!claim) {
    return NextResponse.json({ error: "Claim not found" }, { status: 404 });
  }

  // Update claim status
  await admin
    .from("practice_claims")
    .update({ status: action })
    .eq("id", claimId);

  // If approved, update practice and user role
  if (action === "approved") {
    await admin
      .from("practices")
      .update({ is_claimed: true, claimed_by: claim.user_id })
      .eq("id", claim.practice_id);

    await admin
      .from("profiles")
      .update({ role: "practice_owner" })
      .eq("id", claim.user_id);
  }

  return NextResponse.json({ success: true });
}
