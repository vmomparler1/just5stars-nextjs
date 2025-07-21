
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email, businessName, reviewLink, businessAddress } = await request.json();
    
    // Validate required fields
    if (!email || !businessName || !reviewLink) {
      return NextResponse.json(
        { error: 'Missing required fields: email, businessName, or reviewLink' },
        { status: 400 }
      );
    }

    // Create email content
    const subject = `Tu enlace de reseñas de Google para ${businessName}`;
    
    const text = `
¡Hola!

Aquí tienes el enlace directo para que tus clientes puedan dejar reseñas en Google para tu negocio "${businessName}":

${reviewLink}

¿Cómo usar este enlace?
1. Compártelo con tus clientes satisfechos por WhatsApp, email o redes sociales
2. También puedes crear un código QR con este enlace
3. Cuando hagan clic, irán directamente a la página de reseñas de Google

${businessAddress ? `Dirección del negocio: ${businessAddress}` : ''}

¡Esperamos que consigas muchas reseñas de 5 estrellas!

Saludos,
El equipo de Just5Stars
    `.trim();

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
        <div style="background-color: white; border-radius: 12px; padding: 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">¡Tu enlace de reseñas está listo!</h1>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5;">
            Aquí tienes el enlace directo para que tus clientes puedan dejar reseñas en Google para tu negocio <strong>"${businessName}"</strong>:
          </p>
          
          <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; color: #374151; font-weight: 600;">Tu enlace de reseñas:</p>
            <a href="${reviewLink}" style="color: #2563eb; font-size: 14px; word-break: break-all; text-decoration: none;">${reviewLink}</a>
          </div>
          
          <h3 style="color: #1f2937; font-size: 18px; margin: 25px 0 15px 0;">¿Cómo usar este enlace?</h3>
          <ol style="color: #4b5563; font-size: 16px; line-height: 1.6; padding-left: 20px;">
            <li style="margin-bottom: 8px;">Compártelo con tus clientes satisfechos por WhatsApp, email o redes sociales</li>
            <li style="margin-bottom: 8px;">También puedes crear un código QR con este enlace</li>
            <li style="margin-bottom: 8px;">Cuando hagan clic, irán directamente a la página de reseñas de Google</li>
          </ol>
          
          ${businessAddress ? `
            <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; color: #1e40af;"><strong>Dirección del negocio:</strong> ${businessAddress}</p>
            </div>
          ` : ''}
          
          <div style="background-color: #f0f9ff; border-radius: 8px; padding: 20px; margin-top: 25px;">
            <h4 style="color: #0c4a6e; margin: 0 0 10px 0;">💡 Consejo Pro</h4>
            <p style="color: #0369a1; margin: 0; font-size: 14px;">
              Para obtener mejores resultados, solicita reseñas inmediatamente después de brindar un buen servicio, cuando la experiencia esté fresca en la mente del cliente.
            </p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px; margin: 0;">
              ¡Esperamos que consigas muchas reseñas de 5 estrellas!<br>
              <strong>El equipo de Just5Stars</strong>
            </p>
          </div>
        </div>
      </div>
    `;

    // Send email using the reusable service
    const result = await sendEmail({
      to: email,
      subject,
      text,
      html,
    });

    console.log('Review link email sent successfully:', { email, businessName });

    return NextResponse.json({ 
      success: true, 
      message: 'Email sent successfully' 
    }, { status: 200 });

  } catch (error) {
    console.error('Error sending review link email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
