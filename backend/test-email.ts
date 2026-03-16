import * as Brevo from '@getbrevo/brevo';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Charger le .env
dotenv.config({ path: path.join(__dirname, '.env') });

async function testEmail() {
  console.log('--- TEST BREVO API ---');
  console.log('Sender:', process.env.SMTP_FROM);
  console.log('API Key present:', !!process.env.BREVO_API_KEY);

  const apiInstance = new Brevo.TransactionalEmailsApi();
  apiInstance.setApiKey(
    Brevo.TransactionalEmailsApiApiKeys.apiKey,
    process.env.BREVO_API_KEY as string
  );

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = 'Test Connexion WapiBei';
  sendSmtpEmail.htmlContent = '<h1>Bravo !</h1><p>Si vous recevez ceci, votre configuration Brevo est parfaite.</p>';
  sendSmtpEmail.sender = { name: 'WapiBei Test', email: process.env.SMTP_FROM || '' };
  sendSmtpEmail.to = [{ email: process.env.SMTP_FROM || '' }]; // S'envoyer un mail à soi-même

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('SUCCESS:', data.response.statusCode, 'MessageId:', data.body.messageId);
  } catch (error: any) {
    console.error('ERROR:', error.message);
    if (error.response) {
      console.error('SERVER RESPONSE:', error.response.body);
    }
  }
}

testEmail();
