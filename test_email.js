// Test kirim email dengan lampiran foto besar ke alamat UPI
const nodemailer = require('nodemailer');
const { createCanvas } = (() => {
  // Fallback: create a large buffer that simulates a composed photo (~500KB PNG)
  return { createCanvas: null };
})();

async function main() {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'hanifhabiburrahman512@gmail.com',
      pass: 'ggmymwuzknefwyqq',
    },
  });

  // Simulate a composed photo: create a ~500KB buffer of fake PNG data
  // This simulates what happens when base64 is decoded to a Buffer
  const fakePhotoSize = 500 * 1024; // 500KB
  const photoBuffer = Buffer.alloc(fakePhotoSize, 0xFF);
  
  // Put valid PNG header so email clients recognize it
  const pngHeader = Buffer.from('89504e470d0a1a0a', 'hex');
  pngHeader.copy(photoBuffer, 0);

  console.log(`Photo buffer size: ${photoBuffer.length} bytes (${(photoBuffer.length / 1024).toFixed(0)} KB)`);
  console.log('Sending to hanifhabiburrahman512@upi.edu...');

  const info = await transporter.sendMail({
    from: '"Boro Photo Booth" <hanifhabiburrahman512@gmail.com>',
    to: 'hanifhabiburrahman512@upi.edu',
    subject: 'Test Boro dengan Lampiran Foto',
    text: 'Email ini berisi lampiran foto dari Boro Photo Booth.',
    html: '<p>Email ini berisi lampiran foto dari <strong>Boro Photo Booth</strong>.</p>',
    attachments: [
      {
        filename: 'BoroPicture_test.png',
        content: photoBuffer,
        contentType: 'image/png',
      },
    ],
  });

  console.log('Email sent! Response:', info.response);
  console.log('Message ID:', info.messageId);
}

main().catch((err) => {
  console.error('FAILED:', err.message);
  process.exit(1);
});
