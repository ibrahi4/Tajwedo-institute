import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'tajwedoinstitute@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || '',
  },
});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const adminEmail = process.env.GMAIL_USER || 'tajwedoinstitute@gmail.com';
    const userEmail = data.email;

    if (!userEmail) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 });
    }

    const adminMailOptions = {
      from: `"Tajwedo Institute Contact" <${adminEmail}>`,
      to: adminEmail,
      subject: `📩 New Contact Message from ${data.name || 'User'} | Tajwedo Institute`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #FAFAF7;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 25px; border-radius: 12px; border: 1px solid #EDE6DD;">
            <h2 style="color: #0D4F4F;">New Inquiry Message</h2>
            <p><strong>Name:</strong> ${data.name || 'N/A'}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone / WhatsApp:</strong> ${data.phone || 'N/A'}</p>
            <p><strong>Message:</strong></p>
            <p style="background: #F5F0EB; padding: 15px; border-radius: 8px;">${data.message || ''}</p>
          </div>
        </div>
      `,
    };

    const userMailOptions = {
      from: `"Tajwedo Institute | معهد تجويدو" <${adminEmail}>`,
      to: userEmail,
      subject: `✨ We received your message | معهد تجويدو`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #FAFAF7; padding: 20px; color: #2C2418;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #EDE6DD;">
            <div style="background-color: #0D4F4F; padding: 25px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Tajwedo Institute</h1>
              <p style="color: #C8A96E; margin: 5px 0 0 0; font-size: 13px;">Online Quran & Arabic Institute</p>
            </div>
            <div style="padding: 25px;">
              <h2 style="color: #0D4F4F;">Assalamu Alaikum ${data.name || ''},</h2>
              <p>Thank you for reaching out to <strong>Tajwedo Institute</strong>. We have received your message and our team will get back to you within 24 hours.</p>
              <div dir="rtl" style="text-align: right; background-color: #FAFAF7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                <h3 style="color: #0D4F4F; margin-top: 0;">السلام عليكم ورحمة الله وبركاته ${data.name || ''}،</h3>
                <p style="margin: 0;">جزاكم الله خيراً على تواصلكم مع <strong>معهد تجويدو</strong>. تم استلام رسالتكم وسيقوم فريقنا بالرد عليكم في أقرب وقت.</p>
              </div>
            </div>
          </div>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(userMailOptions),
    ]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error?.message || 'Server Error' }, { status: 500 });
  }
}