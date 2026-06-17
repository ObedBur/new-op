import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiInstance: Brevo.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new Brevo.TransactionalEmailsApi();


    require('dns').setDefaultResultOrder('ipv4first');

    const apiKey = process.env.BREVO_API_KEY;
    this.logger.debug(`EmailService initialized. API Key present: ${!!apiKey}`);

    if (apiKey) {
      this.apiInstance.setApiKey(
        Brevo.TransactionalEmailsApiApiKeys.apiKey,
        apiKey,
      );
    } else {
      this.logger.error('BREVO_API_KEY is not defined! HTTP API will fail.');
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
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
    
      <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
        <tr>
          <td style="padding: 44px 36px; text-align: center;">
            
            <div style="margin-bottom: 28px;">
              <span style="background-color: #fff7ed; color: #E67E22; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                Sécurité WapiBei
              </span>
            </div>

            <div style="margin-bottom: 24px; text-align: center;">
              <div style="background-color: #fff7ed; padding: 16px; border-radius: 20px; display: inline-block; width: 28px; height: 28px; line-height: 28px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </div>
            </div>

            <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.02em; line-height: 1.25;">
              Vérifiez votre adresse e-mail
            </h1>

            <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 32px 0;">
              Merci de nous avoir rejoint ! Pour finaliser la configuration de votre compte et sécuriser votre accès, veuillez utiliser le code de validation unique ci-dessous :
            </p>

            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #f3f4f6; border-radius: 20px; padding: 28px 24px; margin-bottom: 32px; text-align: center;">
              <tr>
                <td>
                  <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #E67E22; padding-left: 10px; line-height: 1;">
                    ${otp}
                  </div>
                  
                  <div style="margin-top: 18px; display: inline-block; background-color: #fff7ed; border-radius: 8px; padding: 6px 14px; border: 1px solid #ffedd5;">
                    <span style="font-size: 12px; color: #c2410c; font-weight: 700; display: inline-block; vertical-align: middle;">
                      ⏱ Valable pendant 10 minutes
                    </span>
                  </div>
                </td>
              </tr>
            </table>

            <p style="color: #9ca3af; font-size: 13px; line-height: 1.5; margin: 0 0 12px 0;">
              Si vous n'avez pas initié cette demande, vous pouvez ignorer cet e-mail en toute sécurité. Votre compte reste protégé.
            </p>

          </td>
        </tr>
        
        <tr>
          <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 8px 0; font-weight: 600; letter-spacing: 0.05em;">
              L'AFRIQUE QUI ACHÈTE ET QUI VEND
            </p>
            <p style="font-size: 12px; color: #9ca3af; margin: 0;">
              &copy; 2026 WapiBei · Plateforme de commerce local.
            </p>
            <p style="font-size: 12px; margin: 6px 0 0 0;">
              <a href="mailto:support@wapibei.com" style="color: #E67E22; text-decoration: none; font-weight: 600;">Contacter le support</a>
            </p>
          </td>
        </tr>
      </table>

    </div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com'
    };
    sendSmtpEmail.to = [{ email: email }];

    try {
      const result = await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      // On ne logue QUE le messageId — jamais les headers (qui contiennent la clé API)
      const messageId = result?.body?.messageId || 'unknown';
      this.logger.log(`Email OTP sent to ${email} via Brevo. messageId: ${messageId}`);
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      const fullError = error instanceof Error ? error.stack : String(error);
      this.logger.error(`Failed to send email to ${email}: ${message}`);
      this.logger.error(`Full error details: ${fullError}`);
      this.logger.error(`Email config - From: ${process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM}, Has API Key: ${!!process.env.BREVO_API_KEY}`);
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
    sendSmtpEmail.subject = 'Reinitialisation de votre mot de passe WapiBei';
    sendSmtpEmail.htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
    
    <!-- Conteneur Principal -->
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
      <tr>
        <td style="padding: 44px 36px; text-align: center;">
          
          <!-- Badge de la Marque -->
          <div style="margin-bottom: 28px;">
            <span style="background-color: #fff7ed; color: #E67E22; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
              Sécurité WapiBei
            </span>
          </div>

          <!-- Icône de Clé de Sécurité -->
          <div style="margin-bottom: 24px; text-align: center;">
            <div style="background-color: #fff7ed; padding: 16px; border-radius: 20px; display: inline-block; width: 28px; height: 28px; line-height: 28px;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
              </svg>
            </div>
          </div>

          <!-- Titre Principal -->
          <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.02em; line-height: 1.25;">
            Réinitialisation de mot de passe
          </h1>

          <!-- Texte descriptif -->
          <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0 0 32px 0; text-align: left;">
            Bonjour,<br /><br />
            Vous avez demandé la réinitialisation de votre mot de passe pour votre compte WapiBei. Cliquez sur le bouton ci-dessous pour configurer une nouvelle clé d'accès sécurisée :
          </p>

          <!-- Bouton d'action principal -->
          <div style="margin-bottom: 36px;">
            <a href="${resetLink}" style="display: inline-block; background-color: #E67E22; color: #ffffff; padding: 16px 36px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 10px 20px -3px rgba(230, 126, 34, 0.35);">
              Réinitialiser mon mot de passe
            </a>
          </div>

          <!-- Bloc d'Alerte Temporelle UI/UX -->
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border: 1px solid #f3f4f6; border-radius: 16px; padding: 16px; margin-bottom: 12px; text-align: left;">
            <tr>
              <td>
                <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.5;">
                  <span style="color: #c2410c; font-weight: 700;">⏱ Expire dans 1 heure :</span> Ce lien est à usage unique. Si vous n'avez pas demandé cette action, ignorez simplement cet e-mail, votre mot de passe actuel restera inchangé.
                </p>
              </td>
            </tr>
          </table>

        </td>
      </tr>
      
      <!-- Pied de page -->
      <tr>
        <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 8px 0; font-weight: 600; letter-spacing: 0.05em;">
            L'AFRIQUE QUI ACHÈTE ET QUI VEND
          </p>
          <p style="font-size: 12px; color: #9ca3af; margin: 0;">
            &copy; 2026 WapiBei · Plateforme de commerce local.
          </p>
        </td>
      </tr>
    </table>

  </div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei Support',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com'
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
    items: { productName: string; price: number; quantity: number; productImage?: string }[];
    totalPrice: number;
    orderIds: string[];
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Bulk Order confirmation for ${data.customerEmail}: ${data.items.length} items - ${data.totalPrice} $`);
      return true;
    }

    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 16px 0; border-bottom: 1px solid #f3f4f6; vertical-align: middle; width: 64px;">
          ${item.productImage 
            ? `<img src="${item.productImage}" alt="${item.productName}" width="52" height="52" style="width: 52px; height: 52px; border-radius: 12px; border: 1px solid #e5e7eb; object-fit: cover; display: block;" />` 
            : `<div style="width: 52px; height: 52px; border-radius: 12px; background-color: #f3f4f6; border: 1px solid #e5e7eb;"></div>`
          }
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #f3f4f6; vertical-align: middle;">
          <span style="font-weight: 700; color: #111827; font-size: 14px; display: block; margin-bottom: 2px;">${item.productName}</span>
          <span style="font-size: 11px; color: #16a34a; font-weight: 700; background-color: #f0fdf4; padding: 2px 6px; border-radius: 4px; display: inline-block;">WapiBei Vérifié</span>
        </td>
        <td style="padding: 16px 12px; border-bottom: 1px solid #f3f4f6; text-align: center; color: #4b5563; font-weight: 700; font-size: 14px; width: 40px;">
          x${item.quantity}
        </td>
        <td style="padding: 16px 0; border-bottom: 1px solid #f3f4f6; text-align: right; font-weight: 800; color: #111827; font-size: 15px; width: 90px;">
          ${(item.price * item.quantity).toLocaleString()} $
        </td>
      </tr>
    `,
      )
      .join('');

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `🛍️ Votre commande WapiBei est validée !`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 44px 36px; text-align: center;">
              
              <div style="margin-bottom: 24px;">
                <span style="background-color: #fff7ed; color: #E67E22; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                  Panier Traité
                </span>
              </div>

              <div style="margin-bottom: 24px; text-align: center;">
                <div style="background-color: #fff7ed; padding: 16px; border-radius: 20px; display: inline-block; width: 28px; height: 28px; line-height: 28px;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                </div>
              </div>

              <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.02em; line-height: 1.2;">
                Merci pour votre achat !
              </h1>

              <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 32px 0;">
                Bonjour <strong>${data.customerName}</strong>, votre commande a bien été reçue et enregistrée. Voici le récapitulatif de votre panier :
              </p>
              
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 24px; text-align: left;">
                <thead>
                  <tr>
                    <th colspan="2" style="text-align: left; padding-bottom: 8px; color: #9ca3af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Article</th>
                    <th style="text-align: center; padding-bottom: 8px; color: #9ca3af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Qté</th>
                    <th style="text-align: right; padding-bottom: 8px; color: #9ca3af; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 16px; padding: 20px; margin-bottom: 32px; border: 1px solid #f3f4f6; text-align: left;">
                <tr>
                  <td style="font-size: 14px; color: #4b5563; font-weight: 600; vertical-align: middle;">Montant total payé :</td>
                  <td style="font-size: 24px; color: #E67E22; font-weight: 800; text-align: right; line-height: 1; vertical-align: middle;">
                    ${data.totalPrice.toLocaleString()} $
                  </td>
                </tr>
              </table>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0fdf4; border-left: 4px solid #2D5A27; border-radius: 4px 12px 12px 4px; padding: 18px; text-align: left;">
                <tr>
                  <td>
                    <p style="margin: 0; font-size: 13px; color: #166534; line-height: 1.6;">
                      <strong>💡 Prochaine étape :</strong> Les vendeurs ont été immédiatement notifiés. Ils prendront directement contact avec vous par téléphone pour fixer le lieu et l'heure de votre livraison.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <tr>
            <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 6px 0; font-weight: 600; letter-spacing: 0.05em;">
                L'AFRIQUE QUI ACHÈTE ET QUI VEND
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                &copy; 2026 WapiBei Market · Shopping Local Réinventé.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;
    sendSmtpEmail.sender = {
      name: 'WapiBei Market',
      email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com'
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
    sendSmtpEmail.subject = `💰 Nouvelle vente sur WapiBei : ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 44px 36px; text-align: center;">
              
              <div style="margin-bottom: 24px;">
                <span style="background-color: #eaf5ea; color: #2D5A27; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                  Vente Enregistrée
                </span>
              </div>

              <div style="margin-bottom: 24px; text-align: center;">
                <div style="background-color: #eaf5ea; padding: 16px; border-radius: 20px; display: inline-block; width: 28px; height: 28px; line-height: 28px;">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2D5A27" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <circle cx="9" cy="21" r="1"></circle>
                    <circle cx="20" cy="21" r="1"></circle>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                  </svg>
                </div>
              </div>

              <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.02em; line-height: 1.2;">
                Félicitations, ${data.vendorName} !
              </h1>

              <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 28px 0;">
                Un client vient de commander un article disponible dans votre boutique en ligne.
              </p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 20px; border: 1px solid #f3f4f6; margin-bottom: 28px; text-align: left;">
                <tr>
                  <td style="padding: 20px;">
                    ${data.productImage ? `
                    <div style="margin-bottom: 16px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; background-color: #ffffff;">
                      <img src="${data.productImage}" alt="${data.productName}" width="100%" style="max-width: 100%; height: auto; display: block;" />
                    </div>
                    ` : ''}
                    
                    <h3 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 8px 0; line-height: 1.4;">
                      ${data.productName}
                    </h3>
                    
                    <table cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td>
                          <span style="color: #E67E22; font-size: 22px; font-weight: 800; display: block;">
                            ${data.totalPrice.toLocaleString()} $
                          </span>
                        </td>
                        <td style="text-align: right; vertical-align: middle;">
                          <span style="color: #9ca3af; font-size: 12px; font-family: monospace; font-weight: 500;">
                            Réf: #${data.orderId.slice(0, 8).toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <h4 style="margin: 0 0 10px 0; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em; font-weight: 700; text-align: left;">
                👤 Informations de livraison
              </h4>
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; padding: 16px; margin-bottom: 12px; text-align: left;">
                <tr>
                  <td>
                    <p style="margin: 0 0 6px 0; font-size: 14px; color: #111827;"><strong>Nom :</strong> ${data.customerName}</p>
                    <p style="margin: 0; font-size: 14px; color: #111827;">
                      <strong>Téléphone :</strong> 
                      <a href="tel:${data.customerPhone}" style="color: #E67E22; text-decoration: none; font-weight: 700;">${data.customerPhone}</a>
                    </p>
                  </td>
                </tr>
              </table>

              <div style="background-color: #2D5A27; color: #ffffff; padding: 14px; text-align: center; border-radius: 14px; font-weight: 700; font-size: 14px; margin-top: 24px; box-shadow: 0 10px 15px -3px rgba(45, 90, 39, 0.25);">
                📞 Appelez le client pour livrer le produit.
              </div>

            </td>
          </tr>
          
          <tr>
            <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="font-size: 11px; color: #cbd5e1; margin: 0 0 4px 0; font-weight: 600; letter-spacing: 0.05em;">
                L'AFRIQUE QUI ACHÈTE ET QUI VEND
              </p>
              <p style="font-size: 12px; color: #9ca3af; margin: 0;">
                &copy; 2026 WapiBei · Notifications Vendeur.
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei Sales', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'sales@wapibei.com' };
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
    items: { productName: string; productImage?: string }[];
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Admin Email: New order from ${data.customerName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `📊 ADMIN : Nouvelle vente plateforme - ${data.customerName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f8fafc; padding: 50px 20px; min-height: 100vh;">
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          <tr>
            <td style="padding: 36px 32px;">
              
              <div style="margin-bottom: 20px;">
                <span style="background-color: #f1f5f9; color: #475569; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 6px; letter-spacing: 0.05em; text-transform: uppercase;">
                  Système Core
                </span>
              </div>

              <div style="margin-bottom: 20px; text-align: left;">
                <div style="background-color: #f1f5f9; padding: 12px; border-radius: 14px; display: inline-block; width: 24px; height: 24px; line-height: 24px; text-align: center;">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                </div>
              </div>

              <h2 style="color: #0f172a; font-size: 20px; font-weight: 800; margin: 0 0 6px 0; letter-spacing: -0.02em;">
                Tableau de bord Admin
              </h2>
              <p style="color: #64748b; font-size: 13px; margin: 0 0 24px 0;">
                Une nouvelle transaction vient d'être enregistrée sur l'infrastructure globale de WapiBei.
              </p>

              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin-bottom: 24px; border: 1px solid #f1f5f9; text-align: left;">
                <tr>
                  <td style="color: #64748b; font-size: 13px; padding-bottom: 8px;">Acheteur :</td>
                  <td style="font-weight: 700; color: #0f172a; text-align: right; font-size: 13px; padding-bottom: 8px;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; padding-bottom: 8px;">Volume articles :</td>
                  <td style="font-weight: 700; color: #0f172a; text-align: right; font-size: 13px; padding-bottom: 8px;">${data.orderCount} distinct(s)</td>
                </tr>
                <tr>
                  <td style="color: #64748b; font-size: 13px; font-weight: 600;">Valeur brute :</td>
                  <td style="font-weight: 800; color: #2D5A27; text-align: right; font-size: 16px;">${data.totalAmount.toLocaleString()} $</td>
                </tr>
              </table>

              <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 14px;">
                <span style="display: block; margin-bottom: 12px; font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; letter-spacing: 0.02em;">Logs des articles :</span>
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="text-align: left;">
                  ${data.items.map(item => `
                    <tr>
                      ${item.productImage ? `
                        <td style="padding: 6px 10px 6px 0; width: 32px; vertical-align: middle;">
                          <img src="${item.productImage}" width="32" height="32" style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid #e2e8f0; object-fit: cover; display: block;" />
                        </td>
                      ` : ''}
                      <td style="padding: 6px 0; vertical-align: middle; font-size: 13px; color: #334155; font-weight: 500; line-height: 1.3;">
                        ${item.productName}
                      </td>
                    </tr>
                  `).join('')}
                </table>
              </div>
              
              <p style="font-size: 11px; color: #94a3b8; margin-top: 32px; text-align: center; font-family: monospace;">
                Auto-notification · WapiBei Engine v2.0
              </p>
            </td>
          </tr>
        </table>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei Monitoring', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'admin@wapibei.com' };
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

  /**
   * Message de bienvenue après inscription réussie.
   */
  async sendWelcomeEmail(email: string, name: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `Bienvenue chez WapiBei, ${name} ! 🟠`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
  
        <!-- Conteneur Principal -->
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 560px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
          <tr>
            <td style="padding: 48px 40px; text-align: center;">
              
              <!-- Badge Logo -->
              <div style="margin-bottom: 32px;">
                <span style="background-color: #fff7ed; color: #E67E22; font-size: 13px; font-weight: 700; padding: 6px 16px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
                  WapiBei Marketplace
                </span>
              </div>

              <!-- Icône Centrale -->
              <div style="margin-bottom: 24px; text-align: center;">
                <div style="background-color: #fff7ed; padding: 16px; border-radius: 20px; display: inline-block; width: 32px; height: 32px; line-height: 32px;">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
              </div>

              <!-- Titre Principal -->
              <h1 style="color: #111827; font-size: 26px; font-weight: 800; margin: 0 0 12px 0; letter-spacing: -0.03em; line-height: 1.25;">
                C'est officiel, bienvenue à bord, ${fullName} !
              </h1>

              <!-- Texte d'introduction -->
              <p style="color: #4b5563; font-size: 15px; line-height: 1.6; margin: 0 0 36px 0; max-width: 440px; margin-left: auto; margin-right: auto;">
                Votre compte a été vérifié avec succès. Vous faites désormais partie de notre communauté de commerce intelligent.
              </p>

              <!-- Liste des fonctionnalités (Palette Harmonisée) -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-bottom: 40px; text-align: left;">
                
                <!-- Acheter -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 16px; border: 1px solid #f3f4f6;">
                      <tr>
                        <td style="padding: 20px; width: 44px; text-align: center; vertical-align: middle;">
                          <div style="background-color: #fff7ed; padding: 10px; border-radius: 12px; display: inline-block; width: 24px; height: 24px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <circle cx="9" cy="21" r="1"></circle>
                              <circle cx="20" cy="21" r="1"></circle>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                            </svg>
                          </div>
                        </td>
                        <td style="padding: 20px 20px 20px 0; vertical-align: middle;">
                          <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 700;">Acheter au meilleur prix</h4>
                          <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">Comparez les prix instantanément autour de vous et faites de vraies économies.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Vendre -->
                <tr>
                  <td style="padding-bottom: 16px;">
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 16px; border: 1px solid #f3f4f6;">
                      <tr>
                        <td style="padding: 20px; width: 44px; text-align: center; vertical-align: middle;">
                          <div style="background-color: #fff7ed; padding: 10px; border-radius: 12px; display: inline-block; width: 24px; height: 24px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line>
                              <polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon>
                              <polygon points="12 12 21 6.92 21 17.08 12 22.08"></polygon>
                              <polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                          </div>
                        </td>
                        <td style="padding: 20px 20px 20px 0; vertical-align: middle;">
                          <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 700;">Propulser vos produits</h4>
                          <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">Publiez vos articles, gérez votre visibilité et touchez des milliers de clients locaux.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Discuter -->
                <tr>
                  <td>
                    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f9fafb; border-radius: 16px; border: 1px solid #f3f4f6;">
                      <tr>
                        <td style="padding: 20px; width: 44px; text-align: center; vertical-align: middle;">
                          <div style="background-color: #fff7ed; padding: 10px; border-radius: 12px; display: inline-block; width: 24px; height: 24px;">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#E67E22" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                            </svg>
                          </div>
                        </td>
                        <td style="padding: 20px 20px 20px 0; vertical-align: middle;">
                          <h4 style="margin: 0 0 4px 0; color: #111827; font-size: 14px; font-weight: 700;">Discuter en toute sécurité</h4>
                          <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.4;">Échangez en temps réel avec un système basé sur des scores de fiabilité transparents.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- Bouton d'action principal -->
              <div style="margin-bottom: 40px;">
                <a href="https://new-op-frontend.vercel.app" style="display: inline-block; background-color: #E67E22; color: #ffffff; padding: 16px 44px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 10px 20px -3px rgba(230, 126, 34, 0.35);">
                  Accéder à mon espace
                </a>
              </div>

              <!-- Signature -->
              <table cellpadding="0" cellspacing="0" border="0" width="100%" style="border-top: 1px solid #f3f4f6; padding-top: 24px; text-align: left;">
                <tr>
                  <td>
                    <p style="color: #9ca3af; font-size: 13px; margin: 0;">Prenez soin de vous,</p>
                    <p style="color: #4b5563; font-size: 14px; font-weight: 700; margin: 2px 0 0 0;">L'équipe WapiBei</p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
          
          <!-- Pied de page -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
              <p style="font-size: 12px; color: #9ca3af; margin: 0 0 4px 0;">
                &copy; 2026 WapiBei · Tous droits réservés.
              </p>
              <p style="font-size: 11px; color: #cbd5e1; margin: 0; font-weight: 500; letter-spacing: 0.02em;">
                L'AFRIQUE QUI ACHÈTE ET QUI VEND
              </p>
            </td>
          </tr>
        </table>

      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'no-reply@wapibei.com' };
    sendSmtpEmail.to = [{ email }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
      return false;
    }
  }

  /**
   * Alerte de Baisse de Prix
   */
  async sendPriceDropAlert(data: { email: string, name: string, productName: string, oldPrice: number, newPrice: number, productImage: string, productLink: string }) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = ` Baisse de prix sur ${data.productName} !`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6; padding: 50px 20px; min-height: 100vh; -webkit-font-smoothing: antialiased;">
  
    <table cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
      <tr>
        <td style="padding: 40px 36px; text-align: center;">
          
          <div style="margin-bottom: 24px;">
            <span style="background-color: #fff7ed; color: #E67E22; font-size: 12px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
               Alerte baisse de prix
            </span>
          </div>

          <h1 style="color: #111827; font-size: 24px; font-weight: 800; margin: 0 0 8px 0; letter-spacing: -0.03em; line-height: 1.25;">
            C'est le moment d'acheter !
          </h1>

          <p style="color: #4b5563; font-size: 14px; line-height: 1.5; margin: 0 0 28px 0;">
            Bonne nouvelle ! Un produit que vous suivez vient de bénéficier d'une baisse de prix exclusive.
          </p>
          
          <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #fafafa; border-radius: 20px; border: 1px solid #f3f4f6; margin-bottom: 32px; text-align: left;">
            <tr>
              <td style="padding: 20px;">
                
                <div style="margin-bottom: 16px; border-radius: 12px; overflow: hidden; border: 1px solid #e5e7eb; background-color: #ffffff;">
                  <img src="${data.productImage}" alt="${data.productName}" width="100%" style="max-width: 100%; height: auto; display: block; margin: 0 auto; object-fit: cover;" />
                </div>

                <h3 style="color: #111827; font-size: 16px; font-weight: 700; margin: 0 0 12px 0; line-height: 1.4;">
                  ${data.productName}
                </h3>
                
                <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 12px; border: 1px solid #f3f4f6; padding: 12px 16px;">
                  <tr>
                    <td>
                      <span style="color: #9ca3af; text-decoration: line-through; font-size: 13px; display: block; margin-bottom: 2px;">
                        Au lieu de ${data.oldPrice} $
                      </span>
                      <span style="color: #E67E22; font-size: 26px; font-weight: 800; display: block; line-height: 1;">
                        ${data.newPrice} $
                      </span>
                    </td>
                    <td style="text-align: right; vertical-align: middle;">
                      <span style="background-color: #f0fdf4; color: #16a34a; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 8px;">
                        Meilleure offre
                      </span>
                    </td>
                  </tr>
                </table>

              </td>
            </tr>
          </table>

          <div style="margin-bottom: 12px;">
            <a href="${data.productLink}" style="display: inline-block; background-color: #E67E22; color: #ffffff; padding: 16px 40px; border-radius: 16px; text-decoration: none; font-weight: 700; font-size: 15px; box-shadow: 0 10px 20px -3px rgba(230, 126, 34, 0.35);">
              Voir l'offre sur WapiBei
            </a>
          </div>

        </td>
      </tr>
      
      <tr>
        <td style="background-color: #fafafa; padding: 24px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="font-size: 12px; color: #9ca3af; margin: 0 0 4px 0;">
            &copy; 2026 WapiBei · Tous droits réservés.
          </p>
          <p style="font-size: 11px; color: #cbd5e1; margin: 0; font-weight: 500; letter-spacing: 0.02em;">
            L'AFRIQUE QUI ACHÈTE ET QUI VEND
          </p>
        </td>
      </tr>
    </table>

  </div>
    `;
    sendSmtpEmail.to = [{ email: data.email }];
    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  /**
   * Rapport de Clôture pour l'Admin
   */
  async sendClosureAdminReport(data: { adminEmail: string, orderId: string, clientName: string, vendorName: string, productName: string, amount: number }) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = ` Transaction Clôturée : ${data.orderId}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: monospace; background: #f1f5f9; padding: 20px;">
        <div style="background: #ffffff; padding: 30px; border-radius: 5px; border-top: 4px solid #2D5A27;">
          <h2 style="margin-top: 0;">RAPPORT DE CLÔTURE</h2>
          <p>La transaction suivante a été marquée comme terminée sur WapiBei.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="color: #64748b; padding-bottom: 10px;">N° Commande :</td><td style="font-weight: bold;">${data.orderId}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">Client :</td><td style="font-weight: bold;">${data.clientName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">Vendeur :</td><td style="font-weight: bold;">${data.vendorName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">Produit :</td><td style="font-weight: bold;">${data.productName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">Montant Net :</td><td style="font-weight: bold; color: #2D5A27;">${data.amount} $</td></tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">WapiBei Monitoring Sys</p>
        </div>
      </div>
    `;
    sendSmtpEmail.to = [{ email: data.adminEmail }];
    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  /**
   * Notification de nouveau produit pour les abonnés.
   */
  async sendNewProductNotification(data: {
    email: string;
    customerName: string;
    vendorName: string;
    productName: string;
    productImage: string;
    price: number;
    productLink: string;
  }) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] New product email for ${data.email}: ${data.productName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `🌟 Nouveau chez ${data.vendorName} : ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase;">Nouveauté !</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="color: #4a5568; font-size: 15px;">Bonjour <strong>${data.customerName}</strong>,</p>
          <p style="color: #718096; font-size: 14px; margin-bottom: 25px;">Une boutique que vous suivez, <strong>${data.vendorName}</strong>, vient de publier un nouvel article :</p>
          
          <div style="border: 1px solid #edf2f7; border-radius: 15px; padding: 15px; background: #fcfcfc;">
            <img src="${data.productImage}" style="width: 100%; border-radius: 12px; aspect-ratio: 1; object-fit: cover; margin-bottom: 15px;" />
            <h3 style="color: #1a202c; margin: 0; font-size: 18px; font-weight: 800;">${data.productName}</h3>
            <p style="color: #E67E22; font-size: 24px; font-weight: 900; margin: 10px 0;">${data.price.toLocaleString()} $</p>
          </div>

          <a href="${data.productLink}" style="display: block; background-color: #E67E22; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; margin-top: 25px; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.2);">VOIR LE PRODUIT</a>
          
          <p style="color: #a0aec0; font-size: 11px; margin-top: 30px;">
            Vous recevez cet email car vous suivez cette boutique sur WapiBei.
          </p>
        </div>
      </div>
    `;
    sendSmtpEmail.sender = { name: 'WapiBei Nouveautés', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'no-reply@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.email }];

    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send new product email to ${data.email}`, error);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STATUT COMMANDE : CONFIRMÉE
  // ─────────────────────────────────────────────────────────────────
  async sendOrderConfirmed(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string }) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `✅ Commande confirmée — ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">✅</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">Commande confirmée !</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">Bonjour <strong>${data.customerName}</strong>,<br/>Bonne nouvelle ! Le vendeur <strong>${data.vendorName}</strong> a confirmé votre commande.</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">Produit commandé</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0aec0;">Réf. #${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">Votre commande est en cours de préparation. Vous recevrez une notification dès qu'elle sera expédiée.</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · L'Afrique qui achète et qui vend</p>
        </div>
      </div>`;
    sendSmtpEmail.sender = { name: 'WapiBei', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send order confirmed email to ${data.customerEmail}`, error);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STATUT COMMANDE : EXPÉDIÉE
  // ─────────────────────────────────────────────────────────────────
  async sendOrderShipped(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string; deliveryAddress: string }) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `📦 Votre colis est en route — ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fffbeb;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">📦</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">Votre colis est en route !</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">Bonjour <strong>${data.customerName}</strong>,<br/><strong>${data.vendorName}</strong> vient d'expédier votre commande. Elle est maintenant en chemin vers vous !</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">Produit expédié</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">Adresse de livraison</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1a202c;">${data.deliveryAddress}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">En cas de problème avec votre livraison, contactez le vendeur directement via la plateforme.</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · L'Afrique qui achète et qui vend</p>
        </div>
      </div>`;
    sendSmtpEmail.sender = { name: 'WapiBei', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send order shipped email to ${data.customerEmail}`, error);
      return false;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  // STATUT COMMANDE : ANNULÉE
  // ─────────────────────────────────────────────────────────────────
  async sendOrderCancelled(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string }) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = `❌ Commande annulée — ${data.productName}`;
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fff5f5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">❌</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">Commande annulée</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">Bonjour <strong>${data.customerName}</strong>,<br/>Nous sommes désolés. Votre commande auprès de <strong>${data.vendorName}</strong> a été annulée.</p>
          <div style="background:#fff5f5;border:1px solid #fed7d7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">Commande annulée</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0aec0;">Réf. #${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">Si vous pensez qu'il s'agit d'une erreur, contactez notre support ou cherchez un autre vendeur proposant ce produit sur WapiBei.</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · L'Afrique qui achète et qui vend</p>
        </div>
      </div>`;
    sendSmtpEmail.sender = { name: 'WapiBei', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || process.env.MAIL_FROM || 'noreply@wapibei.com' };
    sendSmtpEmail.to = [{ email: data.customerEmail, name: data.customerName }];
    try {
      await this.apiInstance.sendTransacEmail(sendSmtpEmail);
      return true;
    } catch (error) {
      this.logger.error(`Failed to send order cancelled email to ${data.customerEmail}`, error);
      return false;
    }
  }
}

