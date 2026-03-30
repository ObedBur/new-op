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
        const apiKey = process.env.BREVO_API_KEY || process.env.SMTP_PASSWORD;
        this.logger.debug(`EmailService initialized. API Key present: ${!!apiKey}, Sender: ${process.env.BREVO_SENDER_EMAIL || process.env.SMTP_FROM}`);
        if (apiKey) {
            this.apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, apiKey);
        }
        else {
            this.logger.error('BREVO_API_KEY or SMTP_PASSWORD is not defined!');
        }
    }
    async sendOtp(email, otp) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] OTP for ${email}: ${otp}`);
            return true;
        }
        const sendSmtpEmail = new Brevo.SendSmtpEmail();
        sendSmtpEmail.subject = 'Votre code de vrification WapiBei';
        sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">Vrification de votre compte WapiBei</h2>
        <p>Bonjour,</p>
        <p> Merci de vous etre inscrit sur WapiBei. Voici votre code de verification :</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p>Ce code expire dans 10 minutes. Si vous n'avez pas demand ce code, vous pouvez ignorer cet e-mail.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #6b7280; text-align: center;"> 2026 WapiBei. Tous droits rservs.</p>
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
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #059669;">Rinitialisation de mot de passe</h2>
        <p>Bonjour,</p>
        <p>Vous avez demand la rinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer :</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background: #059669; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Rinitialiser mon mot de passe</a>
        </div>
        <p>Ce lien expire dans 1 heure. Si vous n'avez pas demand cette action, aucune mesure n'est ncessaire.</p>
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            this.logger.error(`Failed to send reset email to ${email}: ${message}`);
            return false;
        }
    }
    async sendBulkOrderConfirmation(data) {
        if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
            this.logger.log(`[SIMULATION] Bulk Order confirmation for ${data.customerEmail}: ${data.items.length} items - ${data.totalPrice} FC`);
            return true;
        }
        const itemsHtml = data.items
            .map((item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.productName}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${(item.price * item.quantity).toLocaleString()} FC</td>
      </tr>
    `)
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
        }
        catch (error) {
            this.logger.error(`Failed to send admin email: ${data.adminEmail}`, error);
            return false;
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], EmailService);
//# sourceMappingURL=email.service.js.map