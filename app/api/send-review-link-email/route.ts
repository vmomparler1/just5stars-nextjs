
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    const { email, businessName, reviewLink, originalLink } = await request.json();
    
    // Validate required fields
    if (!email || !businessName || !reviewLink) {
      return NextResponse.json(
        { error: "Email, business name, and review link are required" },
        { status: 400 }
      );
    }
    
    const emailText = `
¡Hola!

Hemos generado tu enlace de reseñas de Google para ${businessName}.

Tu enlace personalizado: ${reviewLink}

¿Cómo usarlo?
- Comparte este enlace con tus clientes
- Al hacer clic, serán dirigidos directamente a dejar una reseña en Google
- Puedes enviarlo por WhatsApp, email, imprimirlo en tarjetas, etc.

Consejos para conseguir más reseñas:
1. Pide la reseña justo después de brindar un buen servicio
2. Facilita el proceso enviando el enlace directo
3. Agradece siempre las reseñas recibidas
4. Responde a todas las reseñas, tanto positivas como negativas

¡Gracias por usar nuestro generador de enlaces de reseñas!

Saludos,
El equipo de Just5Stars

---
Enlace directo a Google (técnico): ${originalLink}
`;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    <h2 style="color: #1f2937; margin-bottom: 20px;">¡Tu enlace de reseñas está listo! 🌟</h2>
    
    <p style="color: #4b5563; margin-bottom: 20px;">
      Hemos generado tu enlace de reseñas de Google para <strong>${businessName}</strong>.
    </p>
    
    <div style="background-color: #dbeafe; border: 2px solid #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e40af; margin-top: 0;">Tu enlace personalizado:</h3>
      <a href="${reviewLink}" style="color: #2563eb; font-weight: bold; word-break: break-all;">${reviewLink}</a>
    </div>
    
    <h3 style="color: #1f2937; margin-top: 30px;">¿Cómo usarlo?</h3>
    <ul style="color: #4b5563;">
      <li>Comparte este enlace con tus clientes</li>
      <li>Al hacer clic, serán dirigidos directamente a dejar una reseña en Google</li>
      <li>Puedes enviarlo por WhatsApp, email, imprimirlo en tarjetas, etc.</li>
    </ul>
    
    <h3 style="color: #1f2937; margin-top: 30px;">💡 Consejos para conseguir más reseñas:</h3>
    <ol style="color: #4b5563;">
      <li><strong>Timing perfecto:</strong> Pide la reseña justo después de brindar un buen servicio</li>
      <li><strong>Facilita el proceso:</strong> Envía el enlace directo, no hagas que busquen tu negocio</li>
      <li><strong>Agradece siempre:</strong> Las reseñas recibidas merecen un agradecimiento</li>
      <li><strong>Responde a todas:</strong> Tanto positivas como negativas, muestra que te importa</li>
    </ol>
    
    <div style="background-color: #f0fdf4; border: 2px solid #22c55e; padding: 15px; border-radius: 8px; margin: 30px 0;">
      <p style="color: #15803d; margin: 0; font-weight: bold;">
        ¿Necesitas más herramientas para hacer crecer tu negocio? 
        <a href="https://just5stars.com" style="color: #15803d;">Visita just5stars.com</a>
      </p>
    </div>
    
    <p style="color: #6b7280; margin-top: 30px;">
      ¡Gracias por usar nuestro generador de enlaces de reseñas!<br>
      <strong>El equipo de Just5Stars</strong>
    </p>
    
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
    <p style="color: #9ca3af; font-size: 12px;">
      Enlace técnico directo: <a href="${originalLink}" style="color: #9ca3af;">${originalLink}</a>
    </p>
  </div>
</div>
`;

    // Send email using the reusable service
    const result = await sendEmail({
      to: email,
      subject: `Tu enlace de reseñas de Google para ${businessName} - Just5Stars`,
      text: emailText,
      html: emailHtml,
    });

    if (result.success) {
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to send review link email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error sending review link email:", error);
    return NextResponse.json(
      { error: "Failed to send review link email" },
      { status: 500 }
    );
  }
}
