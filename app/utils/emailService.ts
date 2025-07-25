import nodemailer from "nodemailer";

// Create a transporter with SMTP settings
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
      rejectUnauthorized: false, // For development testing only - set to true in production
    },
    // Add timeout configurations for better performance
    connectionTimeout: 30000, // 30 seconds
    greetingTimeout: 15000, // 15 seconds
    socketTimeout: 45000, // 45 seconds
  });
};

export interface EmailOptions {
  to: string;
  from?: string;
  replyTo?: string;
  bcc?: string;
  subject: string;
  text: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export interface EmailServiceResponse {
  success: boolean;
  error?: string;
}

// Helper function to create a timeout promise
const createTimeoutPromise = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Email sending timed out after ${ms}ms`)), ms);
  });
};

export const sendEmail = async (options: EmailOptions): Promise<EmailServiceResponse> => {
  try {
    const transporter = createTransporter();

    console.log(`Attempting to send email to: ${options.to}`);

    // Create the email sending promise
    const mailOptions: any = {
      from: options.from || process.env.SMTP_FROM || "info@just5stars.com",
      to: options.to,
      replyTo: options.replyTo,
      bcc: options.bcc,
      subject: options.subject,
      text: options.text,
      html: options.html,
    };

    if (options.attachments) {
      mailOptions.attachments = options.attachments;
    }

    const sendPromise = transporter.sendMail(mailOptions);

    // Race between sending email and timeout (60 seconds max)
    await Promise.race([
      sendPromise,
      createTimeoutPromise(60000)
    ]);

    console.log(`Email sent successfully to: ${options.to}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to send email" 
    };
  }
};

// Template functions for different email types
export const createOrderEmailContent = (orderData: any) => {
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

  return { text: emailText, html: emailHtml };
};

export const createContactEmailContent = (contactData: any) => {
  const {
    name,
    email,
    phone,
    company,
    message,
    subject: userSubject
  } = contactData;

  const emailText = `
New Contact Form Submission

Contact Information:
- Name: ${name}
- Email: ${email}
- Phone: ${phone || 'Not provided'}
- Company: ${company || 'Not provided'}
- Subject: ${userSubject || 'General inquiry'}

Message:
${message}

---
This message was sent from the Just5Stars contact form.
  `;

  const emailHtml = `
<h2>New Contact Form Submission</h2>

<h3>Contact Information</h3>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
<p><strong>Company:</strong> ${company || 'Not provided'}</p>
<p><strong>Subject:</strong> ${userSubject || 'General inquiry'}</p>

<h3>Message</h3>
<div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 15px 0;">
  ${message.replace(/\n/g, '<br>')}
</div>

<hr style="margin: 20px 0;">
<p style="font-size: 12px; color: #666;">This message was sent from the Just5Stars contact form.</p>
  `;

  return { text: emailText, html: emailHtml };
};