const nodemailer = require('nodemailer');
const QRCode = require('qrcode');

// Log environment variables for debugging
console.log('Mailtrap Config:', {
  host: process.env.MAILTRAP_HOST,
  port: process.env.MAILTRAP_PORT,
  user: process.env.MAILTRAP_USER,
  pass: process.env.MAILTRAP_PASS ? '[REDACTED]' : undefined,
});

// Configure Mailtrap SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST || 'sandbox.smtp.mailtrap.io',
  port: parseInt(process.env.MAILTRAP_PORT) || 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  logger: true,
  debug: true,
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Transporter is ready to send emails');
  }
});

async function sendCodeEmail(user, pinCode) {
  try {
    // Generate QR code as a buffer
    const qrBuffer = await new Promise((resolve, reject) => {
      QRCode.toBuffer(pinCode, { scale: 6, margin: 2 }, (err, buffer) => {
        if (err) reject(err);
        else resolve(buffer);
      });
    });

    // Calculate expiration time (24 hours from now)
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const formattedExpiresAt = expiresAt.toLocaleString('fr-FR', {
      timeZone: 'Europe/Paris',
      dateStyle: 'short',
      timeStyle: 'short',
    });

    // Send email
    const info = await transporter.sendMail({
      from: '"Système de Pointage GPRO Consulting" <pointage@gproconsulting.com>', // Updated sender name and email
      to: user.email,
      subject: `Votre code de pointage du ${now.toLocaleDateString('fr-FR', { timeZone: 'Europe/Paris' })}`, // Added timezone for subject date
      text: `Bonjour ${user.name || 'Utilisateur'},\n\nVotre code PIN pour aujourd'hui est : ${pinCode}\n\nVous pouvez utiliser ce code en le scannant via l'application ou en le saisissant manuellement si le scan rencontre un problème.\n\nCe code est valable jusqu'au ${formattedExpiresAt}.\n\nCordialement,\nL'équipe GPRO Consulting`,
      html: `
        <h3>Bonjour ${user.name || 'Utilisateur'},</h3>
        <p>Votre code PIN pour aujourd'hui est : <strong>${pinCode}</strong></p>
        <p>Vous pouvez utiliser ce code de deux manières :</p>
        <ol>
          <li><strong>Scanner le QR Code :</strong> Utilisez l'application de pointage pour scanner l'image ci-dessous.</li>
          <li><strong>Saisir manuellement le code :</strong> En cas de difficulté avec le scan, vous pouvez toujours entrer le code <strong>${pinCode}</strong> directement dans l'application.</li>
        </ol>
        <p>Ce code est valable jusqu'au <strong>${formattedExpiresAt}</strong>.</p>
        <p>
          <img src="cid:qrcode" alt="QR Code de pointage" style="max-width: 200px; border: 1px solid #eee; padding: 5px;" />
        </p>
        <p>Cordialement,<br>L'équipe GPRO Consulting</p>
        <p style="font-size: 0.8em; color: #777;"><em>Ceci est un email automatique, merci de ne pas y répondre.</em></p>
      `,
      attachments: [{
        filename: 'qrcode.png',
        content: qrBuffer,
        contentType: 'image/png',
        cid: 'qrcode',
        encoding: 'base64' // Added encoding as good practice
      }],
    });

    console.log(`Email envoyé à ${user.email}: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Erreur lors de l'envoi à ${user.email}:`, error);
    throw new Error(`Échec de l'envoi de l'email: ${error.message}`);
  }
}
""
module.exports = { sendCodeEmail };