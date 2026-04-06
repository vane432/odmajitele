import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact - Send contact form email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, listingTitle, ownerEmail } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Chybí povinná pole' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Neplatná e-mailová adresa' },
        { status: 400 }
      );
    }

    const emailSubject = `Dotaz k inzerátu: ${listingTitle || 'OdMajitele.com'}`;
    
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0f172a, #334155); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">
            <span style="font-weight: 900;">Od</span><span style="font-weight: 300;">Majitele</span><span style="color: #f59e0b;">.com</span>
          </h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Nový dotaz k inzerátu</p>
        </div>
        
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h2 style="color: #0f172a; margin-top: 0; font-size: 24px;">Informace o kontaktu</h2>
          <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p style="margin: 8px 0;"><strong>Jméno:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>E-mail:</strong> ${email}</p>
            ${phone ? `<p style="margin: 8px 0;"><strong>Telefon:</strong> ${phone}</p>` : ''}
            ${listingTitle ? `<p style="margin: 8px 0;"><strong>Inzerát:</strong> ${listingTitle}</p>` : ''}
          </div>
        </div>
        
        <div style="background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 20px;">Zpráva</h3>
          <div style="background: #f8fafc; border-radius: 8px; padding: 20px; white-space: pre-wrap; line-height: 1.6;">
${message}
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #64748b; font-size: 14px;">
          <p>Tato zpráva byla odeslána z <a href="https://odmajitele.com" style="color: #f59e0b; text-decoration: none;">OdMajitele.com</a></p>
          <p>Pro odpověď použijte e-mailovou adresu: <strong>${email}</strong></p>
        </div>
      </div>
    `;

    const emailText = `
Nový dotaz k inzerátu - OdMajitele.com

INFORMACE O KONTAKTU:
Jméno: ${name}
E-mail: ${email}
${phone ? `Telefon: ${phone}` : ''}
${listingTitle ? `Inzerát: ${listingTitle}` : ''}

ZPRÁVA:
${message}

---
Pro odpověď použijte e-mailovou adresu: ${email}
    `;

    // For MVP: Send to a default email or owner's email if provided
    const recipientEmail = ownerEmail || 'admin@odmajitele.com';

    const { data, error } = await resend.emails.send({
      from: 'OdMajitele.com <noreply@odmajitele.com>',
      to: [recipientEmail],
      subject: emailSubject,
      html: emailHtml,
      text: emailText,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Chyba při odesílání e-mailu' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data);

    return NextResponse.json({ 
      success: true, 
      message: 'E-mail byl úspěšně odeslán',
      id: data?.id 
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Interní chyba serveru' },
      { status: 500 }
    );
  }
}