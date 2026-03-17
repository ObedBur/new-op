import * as nodemailer from 'nodemailer';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function verifySMTP() {
  console.log('--- VERIFICATION SMTP BREVO ---');
  console.log('Host:', process.env.SMTP_HOST);
  console.log('Port:', process.env.SMTP_PORT);
  console.log('User:', process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  try {
    // Vérifier la connexion
    console.log('Vérification de la connexion...');
    await transporter.verify();
    console.log('✅ SUCCÈS : La configuration SMTP est valide !');

    // Optionnel : Envoyer un mail de test
    console.log('Envoi d\'un email de test à :', process.env.SMTP_FROM);
    const info = await transporter.sendMail({
      from: `"WapiBei Test" <${process.env.SMTP_FROM}>`,
      to: process.env.SMTP_FROM,
      subject: "Test de validation SMTP",
      text: "Si vous recevez cet email, votre configuration SMTP Brevo est correcte.",
      html: "<b>Félicitations !</b><br>Votre configuration SMTP Brevo fonctionne parfaitement.",
    });

    console.log('✅ EMAIL ENVOYÉ :', info.messageId);
  } catch (error: any) {
    console.error('❌ ERREUR DE CONNEXION SMTP :');
    console.error(error.message);
    if (error.code === 'EAUTH') {
      console.error('Détail : Erreur d\'authentification. Vérifiez votre SMTP_USER et SMTP_PASSWORD (clé API).');
    }
  }
}

verifySMTP();
