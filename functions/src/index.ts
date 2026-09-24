import { onCall, HttpsError } from 'firebase-functions/v2/https';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Initialize Firebase Admin SDK
try {
  admin.initializeApp();
} catch {
  // App already initialized in hot-reload scenarios — safe to ignore
}

// Initialize SMTP transporter using environment variables (or secrets)
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const secure = process.env.SMTP_SECURE === 'true'; // true for port 465
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.error('SMTP configuration missing in environment variables');
    throw new HttpsError('failed-precondition', 'SMTP service is not configured properly.');
  }

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });
};

export const sendPhotoEmail = onCall({ maxInstances: 10 }, async (request) => {
  const data = request.data;
  const email: string = data.email;
  const photoUrl: string = data.photo_url;
  const sessionId: string = data.session_id;

  // ── Validasi parameter wajib ──────────────────────────────────────────────
  if (!email || !photoUrl || !sessionId) {
    throw new HttpsError(
      'invalid-argument',
      'Parameters email, photo_url, and session_id are required.'
    );
  }

  try {
    // 1. Fetch foto dari Firebase Storage untuk dilampirkan
    const response = await fetch(photoUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch photo from storage: ${response.statusText}`);
    }
    const arrayBuffer = await response.arrayBuffer();
    const photoBuffer = Buffer.from(arrayBuffer);

    // Pastikan lampiran tidak kosong — jangan kirim email tanpa foto
    if (photoBuffer.length === 0) {
      throw new HttpsError(
        'failed-precondition',
        'Photo attachment is empty. Email will not be sent without a valid photo.'
      );
    }

    // 2. Siapkan SMTP transporter
    const transporter = getTransporter();

    // 3. Susun isi email sesuai spesifikasi
    const fromAddress = process.env.SMTP_FROM || `"${process.env.SMTP_FROM_NAME || 'Sesijepret Photo Booth'}" <${
      process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER
    }>`;

    const textBody = `Halo,

Terima kasih telah menggunakan Sesijepret.

Foto yang Anda abadikan telah berhasil diproses dan kami lampirkan pada email ini.

Semoga momen tersebut menjadi kenangan indah bersama keluarga, sahabat, maupun orang tersayang.

Sampai jumpa di sesi foto berikutnya.

Salam,
Sesijepret`;

    const htmlBody = `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Sesijepret Memories</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f7;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#E6007A,#9b27af);padding:36px 40px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                📸 Your Sesijepret Memories
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.7;">
                Halo,
              </p>
              <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.7;">
                Terima kasih telah menggunakan <strong>Sesijepret</strong>.
              </p>
              <p style="margin:0 0 16px;color:#333333;font-size:15px;line-height:1.7;">
                Foto yang Anda abadikan telah berhasil diproses dan kami lampirkan pada email ini.
              </p>
              <p style="margin:0 0 24px;color:#333333;font-size:15px;line-height:1.7;">
                Semoga momen tersebut menjadi kenangan indah bersama keluarga, sahabat, maupun orang tersayang.
              </p>

              <!-- Divider -->
              <hr style="border:0;border-top:1px solid #eeeeee;margin:24px 0;" />

              <p style="margin:0 0 8px;color:#333333;font-size:15px;line-height:1.7;">
                Sampai jumpa di sesi foto berikutnya.
              </p>
              <p style="margin:0;color:#555555;font-size:15px;line-height:1.7;">
                Salam,<br />
                <strong>Sesijepret</strong>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9f9fb;padding:20px 40px;text-align:center;border-top:1px solid #eeeeee;">
              <p style="margin:0;font-size:11px;color:#aaaaaa;">
                © ${new Date().getFullYear()} Sesijepret Photo Booth. Dikirim dengan 💜
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const mailOptions = {
      from: fromAddress,
      to: email,
      subject: 'Your Sesijepret Memories 📸',
      text: textBody,
      html: htmlBody,
      attachments: [
        {
          filename: `Sesijepret_${sessionId}.jpg`,
          content: photoBuffer,
          contentType: 'image/jpeg',
        },
      ],
    };

    // 4. Kirim email
    await transporter.sendMail(mailOptions);
    console.log(`[CloudFunction] ✅ Email sent to ${email} for session ${sessionId}`);

    // 5. Update Firestore: simpan email, stage, dan timestamp pengiriman
    const db = admin.firestore();
    const sessionRef = db.collection('sessions').doc(sessionId);
    await sessionRef.update({
      email: email,
      stage: 'EMAIL_SENT',
      email_sent_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (e: unknown) {
    if (e instanceof HttpsError) throw e;
    const errMsg = e instanceof Error ? e.message : String(e);
    console.error('[CloudFunction] ❌ Send mail error:', errMsg);
    throw new HttpsError('internal', `Gagal mengirim email: ${errMsg}`);
  }
});
