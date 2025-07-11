import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Create a transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Replace with environment variable in production
  },
  tls: {
    rejectUnauthorized: false, // For development testing only - set to true in production
  },
});

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();

    const {
      productName,
      voucherApplied,
      price,
      numberOfStands,
      colorStands,
      businessName,
      businessPostcode,
      businessCountry,
      email,
      phoneNumber,
      googleBusinessId
    } = orderData;

    // Create email content
    const emailText = `
New Order Confirmation

Product Selected: ${productName}
Voucher Applied: ${voucherApplied || 'None'}
Price: €${price}
Number of Stands: ${numberOfStands}
Stand Colors: ${colorStands.map((stand: any, index: number) => `Stand ${index + 1}: ${stand.color}`).join(', ')}

Business Information:
- Name: ${businessName}
- Postcode: ${businessPostcode}
- Country: ${businessCountry}

Contact Information:
- Email: ${email}
- Phone: ${phoneNumber}

Google Business ID: ${googleBusinessId || 'Not found'}
    `;

    const emailHtml = `
<h2>New Order Confirmation</h2>

<h3>Product Information</h3>
<p><strong>Product Selected:</strong> ${productName}</p>
<p><strong>Voucher Applied:</strong> ${voucherApplied || 'None'}</p>
<p><strong>Price:</strong> €${price}</p>
<p><strong>Number of Stands:</strong> ${numberOfStands}</p>
<p><strong>Stand Colors:</strong></p>
<ul>
  ${colorStands.map((stand: any, index: number) => `<li>Stand ${index + 1}: ${stand.color}</li>`).join('')}
</ul>

<h3>Business Information</h3>
<p><strong>Business Name:</strong> ${businessName}</p>
<p><strong>Postcode:</strong> ${businessPostcode}</p>
<p><strong>Country:</strong> ${businessCountry}</p>

<h3>Contact Information</h3>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phoneNumber}</p>

<h3>Google Business Information</h3>
<p><strong>Google Business ID:</strong> ${googleBusinessId || 'Not found'}</p>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "info@just5stars.com",
      to: process.env.SMTP_TO || "info@just5stars.com",
      replyTo: email,
      subject: "New Order Confirmation - Just5Stars",
      text: emailText,
      html: emailHtml,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error sending order email:", error);
    return NextResponse.json(
      { error: "Failed to send order email" },
      { status: 500 }
    );
  }
} 