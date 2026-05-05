import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPracticeBySlug } from "@/data/practices";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      petType,
      service,
      message,
      practiceSlug,
    } = body;

    // Validate required fields
    if (!name || !email || !petType || !service || !practiceSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get practice details (static fallback for name display)
    const practice = getPracticeBySlug(practiceSlug);
    if (!practice) {
      return NextResponse.json(
        { error: "Practice not found" },
        { status: 404 }
      );
    }

    // Look up practice UUID from Supabase
    const supabase = createAdminClient();
    const { data: dbPractice } = await supabase
      .from("practices")
      .select("id")
      .eq("slug", practiceSlug)
      .single();

    if (dbPractice) {
      // Persist lead in database
      const { error: leadError } = await supabase.from("leads").insert({
        practice_id: dbPractice.id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone || null,
        pet_type: petType,
        service,
        message: message || null,
      });

      if (leadError) {
        console.error("Failed to insert lead:", leadError.message);
      }
    } else {
      // Supabase not seeded yet — log for now
      console.log("=== NEW LEAD (no DB) ===");
      console.log(`Practice: ${practice.name} (${practiceSlug})`);
      console.log(`Customer: ${name} (${email})`);
      console.log("========================");
    }

    // TODO: Send email notification via Resend
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({ ... });

    return NextResponse.json({
      success: true,
      message: "Enquiry sent successfully",
    });
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { error: "Failed to process enquiry" },
      { status: 500 }
    );
  }
}
