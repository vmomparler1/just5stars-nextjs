
import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/app/utils/emailService";

export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    
    console.log('Sending customer confirmation email for order:', orderData.order_id);
    
    // Create customer confirmation email content
    const customerEmailContent = createCustomerConfirmationEmail(orderData);
    
    // Send confirmation email to customer with BCC to business
    const result = await sendEmail({
      to: orderData.customer_email,
      bcc: process.env.SMTP_TO || "info@just5stars.com",
      subject: "Confirmación de tu pedido - Just5Stars",
      text: customerEmailContent.text,
      html: customerEmailContent.html,
    });

    if (result.success) {
      console.log('✅ Customer confirmation email sent successfully');
      return NextResponse.json({ success: true }, { status: 200 });
    } else {
      console.error('❌ Failed to send customer confirmation email:', result.error);
      return NextResponse.json(
        { error: result.error || "Failed to send customer confirmation email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error processing customer confirmation email:", error);
    return NextResponse.json(
      { error: "Failed to process customer confirmation email" },
      { status: 500 }
    );
  }
}

function createCustomerConfirmationEmail(orderData: any) {
  const {
    order_id,
    product_name,
    quantity,
    price,
    discount_amount,
    voucher_code,
    customer_email,
    business_name,
    business_postcode,
    business_country,
    stand_colors,
    stripe_session_id
  } = orderData;

  const finalPrice = (price - (discount_amount || 0)).toFixed(2);
  const standColorsData = JSON.parse(stand_colors || '[]');

  const emailText = `
¡Gracias por tu pedido!

Tu pedido ha sido confirmado y procesado correctamente.

DETALLES DEL PEDIDO:
- Número de pedido: ${order_id}
- Producto: ${product_name}
- Cantidad: ${quantity}
- Precio final: €${finalPrice}
${voucher_code ? `- Código de descuento aplicado: ${voucher_code}` : ''}

INFORMACIÓN DEL NEGOCIO:
- Nombre: ${business_name}
- Código postal: ${business_postcode}
- País: ${business_country}

DETALLES DE LOS EXPOSITORES:
${standColorsData.map((stand: any, index: number) => `- Expositor ${index + 1}: Color ${stand.color}`).join('\n')}

FACTURA:
${stripe_session_id ? `Puedes descargar tu factura desde Stripe aquí: https://invoice.stripe.com/i/acct_1PuYrqFJjcjp5vJf/${stripe_session_id}` : 'La factura estará disponible una vez procesado el pago.'}

PRÓXIMOS PASOS:
1. Recibirás un email adicional con la información de seguimiento cuando tu pedido sea enviado
2. El tiempo estimado de entrega es de 3-5 días laborables
3. Si tienes alguna pregunta, no dudes en contactarnos

¡Gracias por confiar en Just5Stars!

Equipo Just5Stars
info@just5stars.com
  `;

  const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #2563eb; margin-bottom: 10px;">¡Gracias por tu pedido!</h1>
    <p style="color: #666; font-size: 16px;">Tu pedido ha sido confirmado y procesado correctamente.</p>
  </div>

  <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-top: 0;">Detalles del pedido</h2>
    <p><strong>Número de pedido:</strong> ${order_id}</p>
    <p><strong>Producto:</strong> ${product_name}</p>
    <p><strong>Cantidad:</strong> ${quantity}</p>
    <p><strong>Precio final:</strong> <span style="color: #059669; font-weight: bold;">€${finalPrice}</span></p>
    ${voucher_code ? `<p><strong>Código de descuento aplicado:</strong> ${voucher_code}</p>` : ''}
  </div>

  <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-top: 0;">Información del negocio</h2>
    <p><strong>Nombre:</strong> ${business_name}</p>
    <p><strong>Código postal:</strong> ${business_postcode}</p>
    <p><strong>País:</strong> ${business_country}</p>
  </div>

  <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-top: 0;">Detalles de los expositores</h2>
    ${standColorsData.map((stand: any, index: number) => `<p><strong>Expositor ${index + 1}:</strong> Color ${stand.color}</p>`).join('')}
  </div>

  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-top: 0;">Factura</h2>
    ${stripe_session_id ? `<p style="color: #666;"><strong>Tu factura:</strong> <a href="https://invoice.stripe.com/i/acct_1PuYrqFJjcjp5vJf/${stripe_session_id}" style="color: #2563eb;" target="_blank">Descargar factura desde Stripe</a></p>` : '<p style="color: #666;">La factura estará disponible una vez procesado el pago.</p>'}
  </div>

  <div style="background-color: #dbeafe; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #333; margin-top: 0;">Próximos pasos</h2>
    <ol style="color: #666; line-height: 1.6;">
      <li>Recibirás un email adicional con la información de seguimiento cuando tu pedido sea enviado</li>
      <li>El tiempo estimado de entrega es de 3-5 días laborables</li>
      <li>Si tienes alguna pregunta, no dudes en contactarnos</li>
    </ol>
  </div>

  <div style="text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
    <p style="color: #059669; font-weight: bold; font-size: 18px;">¡Gracias por confiar en Just5Stars!</p>
    <p style="color: #666;">
      Equipo Just5Stars<br>
      <a href="mailto:info@just5stars.com" style="color: #2563eb;">info@just5stars.com</a>
    </p>
  </div>
</div>
  `;

  return { text: emailText, html: emailHtml };
}
