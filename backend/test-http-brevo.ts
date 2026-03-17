import * as Brevo from '@getbrevo/brevo';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '.env') });

async function testBrevoHttp() {
    console.log('--- TEST BREVO HTTP API ---');
    const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASSWORD;
    const senderEmail = process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM;

    console.log('API Key present:', !!apiKey);
    if (apiKey) {
        console.log('API Key (truncated):', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));
    }
    console.log('Sender Email:', senderEmail);

    if (!apiKey) {
        console.error('❌ Error: No API Key found');
        return;
    }

    const apiInstance = new Brevo.TransactionalEmailsApi();
    apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        apiKey
    );

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Test HTTP Brevo';
    sendSmtpEmail.htmlContent = '<h1>Test HTTP</h1><p>Vérification de l\'API HTTP Brevo.</p>';
    sendSmtpEmail.sender = { name: 'WapiBei Test', email: senderEmail || '' };
    sendSmtpEmail.to = [{ email: senderEmail || '' }];

    try {
        console.log('Envoi de l\'email via HTTP...');
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('✅ SUCCÈS :', data.response.statusCode);
    } catch (error: any) {
        console.error('❌ ERREUR HTTP :');
        console.error(error.message);
        if (error.response) {
            console.error('Détails de la réponse :', JSON.stringify(error.response.body, null, 2));
        }
    }
}

testBrevoHttp();
