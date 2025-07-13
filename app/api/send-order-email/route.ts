import { NextRequest, NextResponse } from "next/server";
import { sendEmail, createOrderEmailContent } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    // Get raw body text for debugging
    const bodyText = await request.text();
    console.log('Raw request body:', bodyText);
    
    // Check if body is empty
    if (!bodyText || bodyText.trim() === '') {
      console.error('Empty request body received');
      return NextResponse.json(
        { error: 'Empty request body' },
        { status: 400 }
      );
    }
    
    // Parse JSON with better error handling
    let orderData;
    try {
      orderData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Body that failed to parse:', bodyText);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }
    
    // Create email content using the utility function
    const { text, html } = createOrderEmailContent(orderData);
    
    // Send email using the reusable service
    const result = await sendEmail({
      to: process.env.SMTP_TO || "info@just5stars.com",
      replyTo: orderData.email,
      subject: "New Order Confirmation - just5stars",
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