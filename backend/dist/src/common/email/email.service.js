"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const Brevo = require("@getbrevo/brevo");
let EmailService = EmailService_1 = class EmailService {
    constructor() {
        this.logger = new common_1.Logger(EmailService_1.name);
        this.apiInstance = new Brevo.TransactionalEmailsApi();
        require('dns').setDefaultResultOrder('ipv4first');
        const apiKey = process.env.BREVO_API_KEY;
        this.logger.debug(`EmailService initialized. API Key present: ${!!apiKey}, Sender: ${process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM}`);
        if (apiKey) {
            this.apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
        }
        else {
            this.logger.error('BREVO_API_KEY is not defined! HTTP API will fail.');
        }
    }
    async sendOtp(email, otp) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] OTP for ${email}: ${otp}`);
            return true;
        }
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = 'Votre code de vérification WapiBei';
        sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
  
  <div style="background-color: #E67E22; padding: 24px 20px; text-align: center;">
    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">WapiBei</span>
  </div>

  <div style="padding: 32px 24px;">
    <h1 style="font-size: 22px; font-weight: 700; color: #1a202c; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em;">
      Vérifiez votre adresse e-mail
    </h1>

    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 32px;">
      Merci de nous avoir rejoint. Pour finaliser la configuration de votre compte, veuillez saisir le code de validation suivant :
    </p>

    <div style="background-color: #fffaf0; border: 2px solid #feebc8; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <div style="font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #E67E22;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 8px; font-weight: 500;">
        Valable pendant 10 minutes
      </p>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #718096; margin-bottom: 40px;">
      Si vous n'avez pas créé de compte sur WapiBei, vous pouvez ignorer cet e-mail en toute sécurité.
    </p>

    <div style="border-top: 1px solid #edf2f7; padding-top: 24px;">
      <p style="font-size: 12px; color: #a0aec0; margin: 0;">
        &copy; 2026 WapiBei. Plateforme de shopping local.
      </p>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
        Besoin d'aide ? <a href="mailto:support@wapibei.com" style="color: #E67E22; text-decoration: none; font-weight: 600;">Contactez le support</a>
      </p>
    </div>
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send email to ${email}: ${message}`);
            return false;
        }
    }
    async sendPasswordReset(email, token) {
        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] Reset link for ${email}: ${resetLink}`);
            return true;
        }
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = 'Rinitialisation de votre mot de passe WapiBei';
        sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 24px 20px; text-align: center;">
          <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">WapiBei</span>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="color: #1a202c; margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 700;">Réinitialisation de mot de passe</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">Bonjour,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #E67E22; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(230, 126, 34, 0.2);">Réinitialiser mon mot de passe</a>
          </div>
          
          <p style="font-size: 13px; line-height: 1.5; color: #718096; background-color: #f7fafc; padding: 12px; border-radius: 8px;">
            ⚠️ Ce lien expire dans 1 heure. Si vous n'avez pas demandé cette action, aucune mesure n'est nécessaire.
          </p>

          <div style="border-top: 1px solid #edf2f7; padding-top: 24px; margin-top: 32px;">
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">
              &copy; 2026 WapiBei. Tous droits réservés.
            </p>
          </div>
        </div>
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send reset email to ${email}: ${message}`);
            return false;
        }
    }
    async sendBulkOrderConfirmation(data) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] Bulk Order confirmation for ${data.customerEmail}: ${data.items.length} items - ${data.totalPrice} $`);
            return true;
        }
        const itemsHtml = data.items
            .map((item) => `
      <tr>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; vertical-align: middle; width: 60px;">
          ${item.productImage ? `<img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; display: block;" />` : `<div style="width: 50px; height: 50px; border-radius: 8px; background: #edf2f7;"></div>`}
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
          <span style="font-weight: 700; color: #1e293b; font-size: 15px; display: block;">${item.productName}</span>
          <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">WapiBei Verified</span>
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; text-align: center; color: #64748b; font-weight: 700;">${item.quantity}</td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 800; color: #E67E22; font-size: 16px;">${(item.price * item.quantity).toLocaleString()} $</td>
      </tr>
    `)
            .join('');
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `🛍️ Votre commande WapiBei est validée !`;
        sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #E67E22; padding: 32px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Commande Confirmée</h1>
        </div>

        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #4a5568; margin-top: 0;">Bonjour <strong>${data.customerName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #718096;">Bonne nouvelle ! Votre commande a bien été reçue. Voici le récapitulatif de vos achats sur <strong>WapiBei</strong> :</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background-color: #f7fafc;">
                <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase; width: 60px;">Image</th>
                <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">Détails</th>
                <th style="padding: 12px 10px; text-align: center; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">Qté</th>
                <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">Montant</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 24px 10px 0 10px; font-weight: 700; text-align: right; color: #2d3748; font-size: 16px;">MONTANT TOTAL :</td>
                <td style="padding: 24px 10px 0 10px; font-weight: 800; text-align: right; color: #E67E22; font-size: 22px;">
                  ${data.totalPrice.toLocaleString()} $
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f0fdf4; border-left: 4px solid #2D5A27; padding: 16px; border-radius: 8px; margin: 32px 0;">
            <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.5;">
              <strong>Note importante :</strong> Les vendeurs ont été notifiés et vous contacteront directement pour organiser les détails de la livraison.
            </p>
          </div>

          <p style="font-size: 14px; color: #a0aec0; text-align: center; margin-top: 40px; line-height: 1.5;">
            Merci d'avoir choisi WapiBei pour votre shopping local !<br/>
            &copy; 2026 WapiBei Market.
          </p>
        </div>
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send bulk order email to ${data.customerEmail}: ${message}`);
            return false;
        }
    }
    async sendVendorOrderAlert(data) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] Vendor Email for ${data.vendorEmail}: ${data.productName}`);
            return true;
        }
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `🎉 Nouvelle vente sur WapiBei : ${data.productName}`;
        sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2D5A27; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">🎉 NOUVELLE COMMANDE !</h2>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #2d3748; margin-top: 0;">Félicitations <strong>${data.vendorName}</strong>,</p>
          <p style="font-size: 15px; color: #4a5568;">Une nouvelle vente vient d'être réalisée dans votre boutique :</p>
          
          <table cellpadding="0" cellspacing="0" style="width: 100%; background: #f7fafc; border-radius: 12px; border: 1px solid #edf2f7; margin: 24px 0;">
            <tr>
              ${data.productImage ? `<td style="padding: 20px; width: 80px; vertical-align: middle;"><img src="${data.productImage}" alt="${data.productName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; display: block;" /></td>` : ''}
              <td style="padding: 20px; vertical-align: middle;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 700; color: #2d3748;">${data.productName}</p>
                <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: 800; color: #E67E22;">${data.totalPrice.toLocaleString()} $</p>
                <p style="margin: 0; font-size: 12px; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.5px;">Réf: #${data.orderId.slice(0, 8)}</p>
              </td>
            </tr>
          </table>

          <div style="border-top: 2px dashed #edf2f7; padding-top: 24px; margin-top: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; color: #718096; letter-spacing: 1px;">Coordonnées du client</h3>
            <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 10px;">
              <tr>
                <td style="padding: 16px;">
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #2d3748;"><strong>👤 Nom :</strong> ${data.customerName}</p>
                  <p style="margin: 0; font-size: 15px; color: #2d3748;"><strong>📞 Tél :</strong> <a href="tel:${data.customerPhone}" style="color: #E67E22; text-decoration: none; font-weight: 700;">${data.customerPhone}</a></p>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #E67E22; color: #ffffff; padding: 14px; margin-top: 32px; text-align: center; border-radius: 10px; font-weight: 700; font-size: 15px;">
            Contactez le client pour organiser la livraison.
          </div>
        </div>
      </div>
    `;
        sendSmtpEmail.sender = { name: 'WapiBei Sales', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'sales@wapibei.com' };
        sendSmtpEmail.to = [{ email: data.vendorEmail }];
        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send vendor email: ${data.vendorEmail}`, error);
            return false;
        }
    }
    async sendAdminOrderAlert(data) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] Admin Email: New order from ${data.customerName}`);
            return true;
        }
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `⚠️ ADMIN : Nouvelle vente plateforme - ${data.customerName}`;
        sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; max-width: 600px; margin: auto; padding: 32px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <h2 style="color: #1a202c; border-bottom: 3px solid #E67E22; padding-bottom: 12px; margin-top: 0;">📊 Tableau de bord Admin</h2>
          <p style="color: #4a5568; font-size: 15px;">Une nouvelle commande vient d'être passée sur WapiBei.</p>

          <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #718096; font-size: 13px;">Client :</td>
                <td style="font-weight: 700; color: #2d3748; text-align: right;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="color: #718096; font-size: 13px; padding-top: 8px;">Articles :</td>
                <td style="font-weight: 700; color: #2d3748; text-align: right; padding-top: 8px;">${data.orderCount}</td>
              </tr>
              <tr>
                <td style="color: #718096; font-size: 13px; padding-top: 8px;">Total :</td>
                <td style="font-weight: 800; color: #2D5A27; text-align: right; padding-top: 8px; font-size: 18px;">${data.totalAmount.toLocaleString()} $</td>
              </tr>
            </table>
          </div>

          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px;">
            <strong style="display: block; margin-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #64748b;">Produits commandés :</strong>
            <table cellpadding="0" cellspacing="0" style="width: 100%;">
            ${data.items.map(item => `
              <tr>
                ${item.productImage ? `<td style="padding: 4px 10px 4px 0; width: 32px; vertical-align: middle;"><img src="${item.productImage}" style="width: 32px; height: 32px; border-radius: 4px; object-fit: cover; display: block;" /></td>` : ''}
                <td style="padding: 4px 0; vertical-align: middle; font-size: 13px; color: #2d3748; font-weight: 500;">${item.productName}</td>
              </tr>
            `).join('')}
            </table>
          </div>
          
          <p style="font-size: 11px; color: #a0aec0; margin-top: 32px; text-align: center; font-style: italic;">
            Auto-notification WapiBei Engine
          </p>
        </div>
      </div>
    `;
        sendSmtpEmail.sender = { name: 'WapiBei Monitoring', email: process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM || 'admin@wapibei.com' };
        sendSmtpEmail.to = [{ email: data.adminEmail }];
        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send admin email: ${data.adminEmail}`, error);
            return false;
        }
    }
    async sendWelcomeEmail(email, name) {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `Bienvenue chez WapiBei, ${name} ! 🟠`;
        sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">WAPIBEI</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-weight: 600;">Le marché intelligent de Goma</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a202c; font-size: 24px; font-weight: 800; margin-top: 0;">Heureux de vous voir parmi nous !</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
            Bonjour <strong>${name}</strong>,<br><br>
            Votre compte est maintenant actif. Vous faites désormais partie de l'écosystème WapiBei, où vous pouvez comparer les prix, suivre vos vendeurs préférés et dénicher les meilleures offres en un clic.
          </p>
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 15px; margin: 30px 0;">
            <h3 style="color: #2D5A27; font-size: 14px; text-transform: uppercase; margin-top: 0; letter-spacing: 1px;">Ce que vous pouvez faire :</h3>
            <ul style="color: #4a5568; margin: 15px 0 0 0; padding-left: 20px; font-weight: 500;">
              <li style="margin-bottom: 10px;">Comparer les prix de Goma en temps réel.</li>
              <li style="margin-bottom: 10px;">Suivre vos boutiques préférées.</li>
              <li style="margin-bottom: 10px;">Acheter en toute confiance avec les scores de confiance.</li>
            </ul>
          </div>
          <a href="${process.env.FRONTEND_URL || '#'}" style="display: block; background-color: #E67E22; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 16px; margin-top: 20px; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.2);">EXPLORER LES PRODUITS</a>
        </div>
        <div style="padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px;">© 2026 WapiBei Tech. Tous droits réservés.</p>
        </div>
      </div>
    `;
        sendSmtpEmail.sender = { name: 'WapiBei', email: process.env.BREVO_SENDER_EMAIL || 'no-reply@wapibei.com' };
        sendSmtpEmail.to = [{ email }];
        try {
            await this.apiInstance.sendTransacEmail(sendSmtpEmail);
            return true;
        }
        catch (error) {
            this.logger.error(`Failed to send welcome email to ${email}`, error);
            return false;
        }
    }
    async sendPriceDropAlert(data) {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `🎉 Baisse de prix sur ${data.productName} !`;
        sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="padding: 30px; text-align: center;">
          <div style="display: inline-block; background-color: #2D5A27; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">Alerte Prix</div>
          <h2 style="font-size: 22px; font-weight: 900; color: #1a202c; margin-top: 0;">C'est le moment d'acheter !</h2>
          <img src="${data.productImage}" style="width: 100%; border-radius: 15px; margin: 20px 0; aspect-ratio: 1; object-fit: cover;" />
          <h3 style="color: #4a5568; margin-bottom: 5px;">${data.productName}</h3>
          <div style="margin: 20px 0;">
            <span style="color: #a0aec0; text-decoration: line-through; font-size: 18px; margin-right: 10px;">${data.oldPrice} $</span>
            <span style="color: #E67E22; font-size: 28px; font-weight: 900;">${data.newPrice} $</span>
          </div>
          <a href="${data.productLink}" style="display: block; background-color: #2D5A27; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; margin-top: 10px;">VOIR L'OFFRE</a>
        </div>
      </div>
    `;
        sendSmtpEmail.to = [{ email: data.email }];
        return this.apiInstance.sendTransacEmail(sendSmtpEmail);
    }
    async sendClosureAdminReport(data) {
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = `✅ Transaction Clôturée : ${data.orderId}`;
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
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map