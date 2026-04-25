import { NextRequest, NextResponse } from "next/server";
import { getPracticeBySlug } from "@/data/practices";

// Email notification function (placeholder - integrate with Resend, SendGrid, etc.)
async function sendEmailNotification(data: {
  practiceEmail?: string;
  practiceName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  petType: string;
  service: string;
  message: string;
  submittedAt: string;
}) {
  // Log the enquiry for now
  console.log("=== NEW LEAD ENQUIRY ===");
  console.log(`Practice: ${data.practiceName}`);
  console.log(`Customer: ${data.customerName} (${data.customerEmail})`);
  console.log(`Phone: ${data.customerPhone || "Not provided"}`);
  console.log(`Pet: ${data.petType} | Service: ${data.service}`);
  console.log(`Message: ${data.message || "None"}`);
  console.log(`Submitted: ${data.submittedAt}`);
  console.log("========================");

  // TODO: Integrate with email service
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send({
  //   from: 'enquiries@comparevetfees.com',
  //   to: data.practiceEmail || 'admin@comparevetfees.com',
  //   subject: `New Enquiry from ${data.customerName} via CompareVetFees`,
  //   html: `
  //     <h2>New Lead from CompareVetFees</h2>
  //     <p><strong>Practice:</strong> ${data.practiceName}</p>
  //     <p><strong>Customer:</strong> ${data.customerName}</p>
  //     <p><strong>Email:</strong> ${data.customerEmail}</p>
  //     <p><strong>Phone:</strong> ${data.customerPhone}</p>
  //     <p><strong>Pet Type:</strong> ${data.petType}</p>
  //     <p><strong>Service Needed:</strong> ${data.service}</p>
  //     <p><strong>Message:</strong> ${data.message}</p>
  //     <hr />
  //     <p><small>Lead generated via CompareVetFees.com</small></p>
  //   `,
  // });

  return true;
}

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
      practiceName,
    } = body;

    // Validate required fields
    if (!name || !email || !petType || !service || !practiceSlug) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get practice details
    const practice = getPracticeBySlug(practiceSlug);
    if (!practice) {
      return NextResponse.json(
        { error: "Practice not found" },
        { status: 404 }
      );
    }

    // Prepare email data
    const emailData = {
      practiceEmail: undefined, // TODO: Add practice email to data model
      practiceName: practice.name,
      customerName: name,
      customerEmail: email,
      customerPhone: phone || "",
      petType,
      service,
      message: message || "",
      submittedAt: new Date().toISOString(),
    };

    // Send email notification
    await sendEmailNotification(emailData);

    // TODO: Store lead in database for tracking
    // await db.leads.create({
    //   practiceId: practice.slug,
    //   customerName: name,
    //   customerEmail: email,
    //   ...
    // });

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
