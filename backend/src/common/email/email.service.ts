import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiInstance: Brevo.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new Brevo.TransactionalEmailsApi();


    require('dns').setDefaultResultOrder('ipv4first');

    const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASSWORD;
    this.logger.debug(`EmailService initialized. API Key present: ${!!apiKey}, Sender: ${process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM}`);

    if (apiKey) {
      this.apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        apiKey,
      );
    } else {
      this.logger.error('BREVO_API_KEY or SMTP_PASSWORD is not defined!');
    }
  }

  /**
   * Envoi d'un code OTP (One-Time Password) pour la vrification de l'email.
   */
  async sendOtp(email: string, otp: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] OTP for ${email}: ${otp}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Votre code de vérification WapiBei';
    sendSmtpEmail.htmlContent = `
      <div style="background-color: #ffffff; color: #1e293b; padding: 40px 20px; font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', Roboto, sans-serif; max-width: 480px; margin: auto;">
  
  <div style="margin-bottom: 32px; text-align: left;">
    <span style="font-size: 20px; font-weight: 800; color: #059669; letter-spacing: -0.5px;">WapiBei</span>
  </div>

  <h1 style="font-size: 24px; font-weight: 700; color: #0f172a; margin-bottom: 16px; letter-spacing: -0.02em;">
    Vérifiez votre adresse e-mail
  </h1>
  
  <p style="font-size: 15px; line-height: 1.6; color: #475569; margin-bottom: 32px;">
    Merci de nous avoir rejoint. Pour finaliser la configuration de votre compte, veuillez saisir le code de validation suivant :
  </p>

  <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
    <div style="font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 32px; font-weight: 700; letter-spacing: 12px; color: #059669;">
      ${otp}
    </div>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 8px; font-weight: 500;">
      Valable pendant 10 minutes
    </p>
  </div>

  <p style="font-size: 13px; line-height: 1.5; color: #64748b; margin-bottom: 40px;">
    Si vous n'avez pas créé de compte sur WapiBei, vous pouvez ignorer cet e-mail en toute sécurité.
  </p>

  <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
    <p style="font-size: 12px; color: #94a3b8; margin: 0;">
      &copy; 2026 WapiBei. Plateforme de gestion commerciale.
    </p>
    <p style="font-size: 12px; color: #94a3b8; margin-top: 4px;">
      Besoin d'aide ? <a href="mailto:support@wapibei.com" style="color: #059669; text-decoration: none;">Contactez le support</a>
    </p>
  </div>
</div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'noreply@wapibei.com'
    };
    sendSmtpEmail.to = [{ email: email }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Email OTP sent to ${email} via Brevo`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send email to ${email}: ${message}`);
      return false;
    }
  }

  /**
   * Envoi d'un lien de reninitialisation de mot de passe.
   */
  async sendPasswordReset(email: string, token: string) {
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Reset link for ${email}: ${resetLink}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = 'Rinitialisation de votre mot de passe WapiBei';
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">Rinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demand la rinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Rinitialiser mon mot de passe</a>
        </div>
        <p>Ce lien expire dans 1 heure. Si vous n'avez pas demand cette action, aucune mesure n'est necessaire.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;"> 2026 WapiBei. Tous droits rservs.</p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei Support',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'noreply@wapibei.com'
    };
    sendSmtpEmail.to = [{ email: email }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Reset link sent to ${email} via Brevo`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send reset email to ${email}: ${message}`);
      return false;
    }
  }

  /**
   * Envoi d'une confirmation de commande groupée au client (plusieurs produits).
   */
  async sendBulkOrderConfirmation(data: {
    customerEmail: string;
    customerName: string;
    items: { productName: string; price: number; quantity: number }[];
    totalPrice: number;
    orderIds: string[];
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Bulk Order confirmation for ${data.customerEmail}: ${data.items.length} items - ${data.totalPrice} FC`);
      return true;
    }

    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(
            item.price * item.quantity
          ).toLocaleString()} FC</td>
      </tr>
    `,
      )
      .join('');

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Confirmation de votre commande WapiBei`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">🛍️ Commande Validée !</h2>
        <p>Bonjour <strong>${data.customerName}</strong>,</p>
        <p>Merci pour votre confiance ! Votre commande a bien été reçue. Voici le récapitulatif :</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background: #f9fafb;">
              <th style="padding: 10px; text-align: left; border-bottom: 2px solid #eee;">Produit</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Qté</th>
              <th style="padding: 10px; text-align: right; border-bottom: 2px solid #eee;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding: 15px 10px; font-weight: bold; text-align: right;">TOTAL :</td>
              <td style="padding: 15px 10px; font-weight: bold; text-align: right; color: #059669; font-size: 18px;">
                ${data.totalPrice.toLocaleString()} FC
              </td>
            </tr>
          </tfoot>
        </table>

        <p>Les vendeurs ont été notifiés et vous contacteront très prochainement pour finaliser la livraison.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;"> 2026 WapiBei Market. Votre shopping local en confiance.</p>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei Market',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'noreply@wapibei.com'
    };
    sendSmtpEmail.to = [{ email: data.customerEmail }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      this.logger.log(`Bulk order confirmation sent to ${data.customerEmail}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Failed to send bulk order email to ${data.customerEmail}: ${message}`);
      return false;
    }
  }

  /**
   * Notification Email pour le VENDEUR.
   */
  async sendVendorOrderAlert(data: {
    vendorEmail: string;
    vendorName: string;
    customerName: string;
    customerPhone: string;
    productName: string;
    productImage: string;
    totalPrice: number;
    orderId: string;
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Vendor Email for ${data.vendorEmail}: ${data.productName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Nouvelle vente : ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ef4444; border-radius: 10px;">
        <h2 style="color: #ef4444;">🎉 Nouvelle commande reçue !</h2>
        <p>Félicitations <strong>${data.vendorName}</strong>, vous avez une nouvelle vente sur WapiBei.</p>
        
        <div style="display: flex; gap: 20px; align-items: start; background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          ${data.productImage ? `<img src="${data.productImage}" alt="${data.productName}" style="width: 120px; height: 120px; object-fit: cover; border-radius: 8px;" />` : ''}
          <div>
            <p style="margin: 0 0 5px 0;"><strong>Produit :</strong> ${data.productName}</p>
            <p style="margin: 0 0 5px 0;"><strong>Prix :</strong> ${data.totalPrice.toLocaleString()} FC</p>
            <p style="margin: 0;"><strong>ID Commande :</strong> #${data.orderId.slice(0, 8)}</p>
          </div>
        </div>

        <div style="border-top: 1px solid #fee2e2; padding-top: 15px;">
          <h3 style="margin-top: 0;">Informations Client :</h3>
          <p style="margin: 5px 0;">👤 ${data.customerName}</p>
          <p style="margin: 5px 0;">📞 ${data.customerPhone}</p>
        </div>

        <p style="background: #ef4444; color: white; padding: 10px; margin-top: 20px; text-align: center; border-radius: 5px; font-weight: bold;">
          Pensez à contacter le client pour organiser la livraison.
        </p>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei Sales', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'sales@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.vendorEmail }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send vendor email: ${data.vendorEmail}`, error);
      return false;
    }
  }

  /**
   * Notification Email pour l'ADMINISTRATEUR.
   */
  async sendAdminOrderAlert(data: {
    adminEmail: string;
    orderCount: number;
    totalAmount: number;
    customerName: string;
    items: string[];
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Admin Email: New order from ${data.customerName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `⚠️ NOUVELLE COMMANDE PLATEFORME : ${data.customerName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; background: #f3f4f6; padding: 20px;">
        <div style="background: white; max-width: 600px; margin: auto; padding: 25px; border-radius: 10px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
          <h2 style="color: #111827; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">📊 Rapport de commande Admin</h2>
          <p>Une nouvelle session d'achat a été complétée sur la plateforme.</p>
          <ul style="list-style: none; padding: 0;">
            <li><strong>Client :</strong> ${data.customerName}</li>
            <li><strong>Nombre d'articles :</strong> ${data.orderCount}</li>
            <li><strong>Volume total :</strong> ${data.totalAmount.toLocaleString()} FC</li>
          </ul>
          <div style="background: #eff6ff; padding: 10px; border-radius: 5px; margin-top: 15px;">
            <p><strong>Articles :</strong><br/>${data.items.join('<br/>')}</p>
          </div>
          <p style="font-size: 11px; color: #9ca3af; margin-top: 25px; text-align: center;">Système de surveillance WapiBei</p>
        </div>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei Monitoring', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'admin@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.adminEmail }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send admin email: ${data.adminEmail}`, error);
      return false;
    }
  }
}

