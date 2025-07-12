import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createOrderEmailContent } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    // Create email content using the utility function
    const { text, html } = createOrderEmailContent(orderData);
    
    // Send email using the reusable service
    const result = await sendEmail({
      to: process.env.SMTP_TO || "info@just5stars.com",
      replyTo: orderData.email,
      subject: "New Order Confirmation - Just5Stars",
      text,
      html,
    });

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send order email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing order email:", error);
    return NextResponse.json(
      { error: "Failed to process order email" },
      { status: 500 }
    );
  }
} 