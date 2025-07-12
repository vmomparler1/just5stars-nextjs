import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createContactEmailContent } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    const contactData = await request.json();
    
    // Validate required fields
    if (!contactData.name || !contactData.email || !contactData.message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }
    
    // Create email content using the utility function
    const { text, html } = createContactEmailContent(contactData);
    
    // Send email using the reusable service
    const result = await sendEmail({
      to: process.env.SMTP_TO || "info@just5stars.com",
      replyTo: contactData.email,
      subject: `Contact Form: ${contactData.subject || 'General inquiry'} - Just5Stars`,
      text,
      html,
    });

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send contact email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing contact email:", error);
    return NextResponse.json(
      { error: "Failed to process contact email" },
      { status: 500 }
    );
  }
} 