import { Injectable, Logger } from '@nestjs/common';
import * as Brevo from '@getbrevo/brevo';
import { t } from '../i18n/i18n';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private apiInstance: Brevo.TransactionalEmailsApi;

  constructor() {
    this.apiInstance = new Brevo.TransactionalEmailsApi();


    require('dns').setDefaultResultOrder('ipv4first')

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
   * Envoi d'un code OTP (One-Time Password) pour la vérification de l'email.
   */
  async sendOtp(email: string, otp: string, language?: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] OTP for ${email}: ${otp}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.otp.subject');
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 480px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
  
  <div style="background-color: #E67E22; padding: 24px 20px; text-align: center;">
    <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">WapiBei</span>
  </div>

  <div style="padding: 32px 24px;">
    <h1 style="font-size: 22px; font-weight: 700; color: #1a202c; margin-top: 0; margin-bottom: 16px; letter-spacing: -0.02em;">
      ${t(language, 'email.otp.title')}
    </h1>

    <p style="font-size: 15px; line-height: 1.6; color: #4a5568; margin-bottom: 32px;">
      ${t(language, 'email.otp.body')}
    </p>

    <div style="background-color: #fffaf0; border: 2px solid #feebc8; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 32px;">
      <div style="font-family: 'SF Mono', 'Roboto Mono', monospace; font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #E67E22;">
        ${otp}
      </div>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 8px; font-weight: 500;">
        ${t(language, 'email.otp.validity')}
      </p>
    </div>

    <p style="font-size: 13px; line-height: 1.5; color: #718096; margin-bottom: 40px;">
      ${t(language, 'email.otp.ignore')}
    </p>

    <div style="border-top: 1px solid #edf2f7; padding-top: 24px;">
      <p style="font-size: 12px; color: #a0aec0; margin: 0;">
        &copy; 2026 WapiBei. ${t(language, 'email.otp.footer')}
      </p>
      <p style="font-size: 12px; color: #a0aec0; margin-top: 4px;">
        ${t(language, 'email.otp.help')} <a href="mailto:support@wapibei.com" style="color: #E67E22; text-decoration: none; font-weight: 600;">${t(language, 'email.otp.helpLink')}</a>
      </p>
    </div>
  </div>

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
   * Envoi d'un lien de réinitialisation de mot de passe.
   */
  async sendPasswordReset(email: string, token: string, language?: string) {
    const rawFrontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const frontendUrl = rawFrontendUrl.split(',')[0].trim();
    const resetLink = `${frontendUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Reset link for ${email}: ${resetLink}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.reset.subject');
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 24px 20px; text-align: center;">
          <span style="font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: 1px; text-transform: uppercase;">WapiBei</span>
        </div>

        <div style="padding: 32px 24px;">
          <h2 style="color: #1a202c; margin-top: 0; margin-bottom: 16px; font-size: 20px; font-weight: 700;">${t(language, 'email.reset.title')}</h2>
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">${t(language, 'email.reset.greeting')}</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4a5568;">${t(language, 'email.reset.body')}</p>

          <div style="text-align: center; margin: 32px 0;">
            <a href="${resetLink}" style="background-color: #E67E22; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: 700; display: inline-block; box-shadow: 0 4px 6px -1px rgba(230, 126, 34, 0.2);">${t(language, 'email.reset.cta')}</a>
          </div>
          
          <p style="font-size: 13px; line-height: 1.5; color: #718096; background-color: #f7fafc; padding: 12px; border-radius: 8px;">
            ⚠️ ${t(language, 'email.reset.warning')}
          </p>

          <div style="border-top: 1px solid #edf2f7; padding-top: 24px; margin-top: 32px;">
            <p style="font-size: 11px; color: #a0aec0; text-align: center; margin: 0;">
              &copy; 2026 WapiBei. ${t(language, 'email.reset.footer')}
            </p>
          </div>
        </div>
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
  }, language?: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Bulk Order confirmation for ${data.customerEmail}: ${data.items.length} items - ${data.totalPrice} $`);
      return true;
    }

    const itemsHtml = data.items
      .map(
        (item) => `
      <tr>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; vertical-align: middle; width: 60px;">
          ${item.productImage ? `<img src="${item.productImage}" alt="${item.productName}" style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; display: block;" />` : `<div style="width: 50px; height: 50px; border-radius: 8px; background: #edf2f7;"></div>`}
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; vertical-align: middle;">
          <span style="font-weight: 700; color: #1e293b; font-size: 15px; display: block;">${item.productName}</span>
          <span style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase;">WapiBei Verified</span>
        </td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; text-align: center; color: #64748b; font-weight: 700;">${item.quantity}</td>
        <td style="padding: 15px 10px; border-bottom: 1px solid #edf2f7; text-align: right; font-weight: 800; color: #E67E22; font-size: 16px;">${(
            item.price * item.quantity
          ).toLocaleString()} $</td>
      </tr>
    `,
      )
      .join('');

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.bulk.subject');
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; padding: 0; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; background-color: #ffffff;">
        <!-- Header -->
        <div style="background-color: #E67E22; padding: 32px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">${t(language, 'email.bulk.header')}</h1>
        </div>

        <div style="padding: 32px 24px;">
          <p style="font-size: 16px; color: #4a5568; margin-top: 0;">${t(language, 'email.bulk.greeting', { name: data.customerName })}</p>
          <p style="font-size: 15px; line-height: 1.6; color: #718096;">${t(language, 'email.bulk.body')}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 24px 0;">
            <thead>
              <tr style="background-color: #f7fafc;">
                <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase; width: 60px;">${t(language, 'email.bulk.thImage')}</th>
                <th style="padding: 12px 10px; text-align: left; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">${t(language, 'email.bulk.thDetails')}</th>
                <th style="padding: 12px 10px; text-align: center; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">${t(language, 'email.bulk.thQty')}</th>
                <th style="padding: 12px 10px; text-align: right; border-bottom: 2px solid #e2e8f0; color: #4a5568; font-size: 12px; text-transform: uppercase;">${t(language, 'email.bulk.thAmount')}</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" style="padding: 24px 10px 0 10px; font-weight: 700; text-align: right; color: #2d3748; font-size: 16px;">${t(language, 'email.bulk.total')}</td>
                <td style="padding: 24px 10px 0 10px; font-weight: 800; text-align: right; color: #E67E22; font-size: 22px;">
                  ${data.totalPrice.toLocaleString()} $
                </td>
              </tr>
            </tfoot>
          </table>

          <div style="background-color: #f0fdf4; border-left: 1px solid rgba(45,90,39,0.12); padding: 16px; border-radius: 8px; margin: 32px 0;">
            <p style="margin: 0; font-size: 14px; color: #166534; line-height: 1.5;">
              <strong>${t(language, 'email.bulk.noteTitle')}</strong> ${t(language, 'email.bulk.note')}
            </p>
          </div>

          <p style="font-size: 14px; color: #a0aec0; text-align: center; margin-top: 40px; line-height: 1.5;">
            ${t(language, 'email.bulk.thanks')}<br/>
            &copy; 2026 WapiBei Market.
          </p>
        </div>
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
  }, language?: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Vendor Email for ${data.vendorEmail}: ${data.productName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.vendor.subject', { product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; padding: 0; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #2D5A27; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800;">${t(language, 'email.vendor.header')}</h2>
        </div>

        <div style="padding: 24px;">
          <p style="font-size: 16px; color: #2d3748; margin-top: 0;">${t(language, 'email.vendor.greeting', { name: data.vendorName })}</p>
          <p style="font-size: 15px; color: #4a5568;">${t(language, 'email.vendor.body')}</p>
          
          <table cellpadding="0" cellspacing="0" style="width: 100%; background: #f7fafc; border-radius: 12px; border: 1px solid #edf2f7; margin: 24px 0;">
            <tr>
              ${data.productImage ? `<td style="padding: 20px; width: 80px; vertical-align: middle;"><img src="${data.productImage}" alt="${data.productName}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px; display: block;" /></td>` : ''}
              <td style="padding: 20px; vertical-align: middle;">
                <p style="margin: 0 0 5px 0; font-size: 16px; font-weight: 700; color: #2d3748;">${data.productName}</p>
                <p style="margin: 0 0 5px 0; font-size: 18px; font-weight: 800; color: #E67E22;">${data.totalPrice.toLocaleString()} $</p>
                <p style="margin: 0; font-size: 12px; color: #a0aec0; text-transform: uppercase; letter-spacing: 0.5px;">${t(language, 'email.vendor.ref')} #${data.orderId.slice(0, 8)}</p>
              </td>
            </tr>
          </table>

          <div style="border-top: 2px dashed #edf2f7; padding-top: 24px; margin-top: 24px;">
            <h3 style="margin: 0 0 16px 0; font-size: 14px; text-transform: uppercase; color: #718096; letter-spacing: 1px;">${t(language, 'email.vendor.customerTitle')}</h3>
            <table cellpadding="0" cellspacing="0" style="width: 100%; background-color: #fffaf0; border: 1px solid #feebc8; border-radius: 10px;">
              <tr>
                <td style="padding: 16px;">
                  <p style="margin: 0 0 8px 0; font-size: 15px; color: #2d3748;"><strong>👤 ${t(language, 'email.vendor.nameLabel')}</strong> ${data.customerName}</p>
                  <p style="margin: 0; font-size: 15px; color: #2d3748;"><strong>📞 ${t(language, 'email.vendor.phoneLabel')}</strong> <a href="tel:${data.customerPhone}" style="color: #E67E22; text-decoration: none; font-weight: 700;">${data.customerPhone}</a></p>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color: #E67E22; color: #ffffff; padding: 14px; margin-top: 32px; text-align: center; border-radius: 10px; font-weight: 700; font-size: 15px;">
            ${t(language, 'email.vendor.cta')}
          </div>
        </div>
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
  }, language?: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] Admin Email: New order from ${data.customerName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.admin.subject', { customer: data.customerName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: sans-serif; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; max-width: 600px; margin: auto; padding: 32px; border-radius: 12px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
          <h2 style="color: #1a202c; border-bottom: 3px solid #E67E22; padding-bottom: 12px; margin-top: 0;">📊 ${t(language, 'email.admin.title')}</h2>
          <p style="color: #4a5568; font-size: 15px;">${t(language, 'email.admin.body')}</p>

          <div style="background-color: #edf2f7; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #718096; font-size: 13px;">${t(language, 'email.admin.client')}</td>
                <td style="font-weight: 700; color: #2d3748; text-align: right;">${data.customerName}</td>
              </tr>
              <tr>
                <td style="color: #718096; font-size: 13px; padding-top: 8px;">${t(language, 'email.admin.items')}</td>
                <td style="font-weight: 700; color: #2d3748; text-align: right; padding-top: 8px;">${data.orderCount}</td>
              </tr>
              <tr>
                <td style="color: #718096; font-size: 13px; padding-top: 8px;">${t(language, 'email.admin.total')}</td>
                <td style="font-weight: 800; color: #2D5A27; text-align: right; padding-top: 8px; font-size: 18px;">${data.totalAmount.toLocaleString()} $</td>
              </tr>
            </table>
          </div>

          <div style="border: 1px solid #e2e8f0; padding: 16px; border-radius: 12px;">
            <strong style="display: block; margin-bottom: 12px; font-size: 12px; text-transform: uppercase; color: #64748b;">${t(language, 'email.admin.productsTitle')}</strong>
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
            ${t(language, 'email.admin.footer')}
          </p>
        </div>
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

  /**
   * Message de bienvenue après inscription réussie.
   */
  async sendWelcomeEmail(email: string, name: string, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.welcome.subject', { name });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 40px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">WAPIBEI</h1>
          <p style="color: rgba(255,255,255,0.9); margin-top: 10px; font-weight: 600;">${t(language, 'email.welcome.subtitle')}</p>
        </div>
        <div style="padding: 40px 30px;">
          <h2 style="color: #1a202c; font-size: 24px; font-weight: 800; margin-top: 0;">${t(language, 'email.welcome.title')}</h2>
          <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
            ${t(language, 'email.welcome.greeting', { name })}
          </p>
          <p style="color: #4a5568; line-height: 1.6; font-size: 16px;">
            ${t(language, 'email.welcome.body')}
          </p>
          <div style="background-color: #f7fafc; padding: 25px; border-radius: 15px; margin: 30px 0;">
            <h3 style="color: #2D5A27; font-size: 14px; text-transform: uppercase; margin-top: 0; letter-spacing: 1px;">${t(language, 'email.welcome.whatYouCanDo')}</h3>
            <ul style="color: #4a5568; margin: 15px 0 0 0; padding-left: 20px; font-weight: 500;">
              <li style="margin-bottom: 10px;">${t(language, 'email.welcome.f1')}</li>
              <li style="margin-bottom: 10px;">${t(language, 'email.welcome.f2')}</li>
              <li style="margin-bottom: 10px;">${t(language, 'email.welcome.f3')}</li>
            </ul>
          </div>
          <a href="${process.env.FRONTEND_URL || '#'}" style="display: block; background-color: #E67E22; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 16px; margin-top: 20px; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.2);">${t(language, 'email.welcome.cta')}</a>
        </div>
        <div style="padding: 20px; text-align: center; border-top: 1px solid #f1f5f9;">
          <p style="color: #94a3b8; font-size: 12px;">${t(language, 'email.welcome.footer')}</p>
        </div>
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
  async sendPriceDropAlert(data: { email: string, name: string, productName: string, oldPrice: number, newPrice: number, productImage: string, productLink: string }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.pricedrop.subject', { product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="padding: 30px; text-align: center;">
          <div style="display: inline-block; background-color: #2D5A27; color: white; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 800; margin-bottom: 20px; text-transform: uppercase;">${t(language, 'email.pricedrop.badge')}</div>
          <h2 style="font-size: 22px; font-weight: 900; color: #1a202c; margin-top: 0;">${t(language, 'email.pricedrop.title')}</h2>
          <img src="${data.productImage}" style="width: 100%; border-radius: 15px; margin: 20px 0; aspect-ratio: 1; object-fit: cover;" />
          <h3 style="color: #4a5568; margin-bottom: 5px;">${data.productName}</h3>
          <div style="margin: 20px 0;">
            <span style="color: #a0aec0; text-decoration: line-through; font-size: 18px; margin-right: 10px;">${data.oldPrice} $</span>
            <span style="color: #E67E22; font-size: 28px; font-weight: 900;">${data.newPrice} $</span>
          </div>
          <a href="${data.productLink}" style="display: block; background-color: #2D5A27; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; margin-top: 10px;">${t(language, 'email.pricedrop.cta')}</a>
        </div>
      </div>
    `;
    sendSmtpEmail.to = [{ email: data.email }];
    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  /**
   * Relance pour panier abandonné
   */
  async sendAbandonedCart(data: { email: string, name: string, itemCount: number, cartLink: string }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.cart.subject', { name: data.name });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="padding: 30px; text-align: center;">
          <h2 style="font-size: 22px; font-weight: 900; color: #1a202c; margin-top: 0;">${t(language, 'email.cart.title')}</h2>
          <p style="color: #4a5568; margin-bottom: 20px;">${t(language, 'email.cart.body', { count: data.itemCount })}</p>
          <a href="${data.cartLink}" style="display: block; background-color: #E67E22; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; margin-top: 10px;">${t(language, 'email.cart.cta')}</a>
        </div>
      </div>
    `;
    sendSmtpEmail.to = [{ email: data.email }];
    return this.apiInstance.sendTransacEmail(sendSmtpEmail);
  }

  /**
   * Rapport de Clôture pour l'Admin
   */
  async sendClosureAdminReport(data: { adminEmail: string, orderId: string, clientName: string, vendorName: string, productName: string, amount: number }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.closure.subject', { orderId: data.orderId });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: monospace; background: #f1f5f9; padding: 20px;">
        <div style="background: #ffffff; padding: 30px; border-radius: 5px; border-top: 1px solid rgba(45,90,39,0.12);">
          <h2 style="margin-top: 0;">${t(language, 'email.closure.title')}</h2>
          <p>${t(language, 'email.closure.body')}</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;">
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="color: #64748b; padding-bottom: 10px;">${t(language, 'email.closure.orderId')}</td><td style="font-weight: bold;">${data.orderId}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">${t(language, 'email.closure.client')}</td><td style="font-weight: bold;">${data.clientName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">${t(language, 'email.closure.vendor')}</td><td style="font-weight: bold;">${data.vendorName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">${t(language, 'email.closure.product')}</td><td style="font-weight: bold;">${data.productName}</td></tr>
            <tr><td style="color: #64748b; padding-bottom: 10px;">${t(language, 'email.closure.amount')}</td><td style="font-weight: bold; color: #2D5A27;">${data.amount} $</td></tr>
          </table>
          <p style="margin-top: 30px; font-size: 12px; color: #94a3b8;">${t(language, 'email.closure.footer')}</p>
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
  }, language?: string) {
    if (!process.env.BREVO_API_KEY && !process.env.SMTP_PASSWORD) {
      this.logger.log(`[SIMULATION] New product email for ${data.email}: ${data.productName}`);
      return true;
    }

    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.newproduct.subject', { vendor: data.vendorName, product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 500px; margin: auto; border: 1px solid #e2e8f0; border-radius: 20px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #E67E22; padding: 24px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 800; text-transform: uppercase;">${t(language, 'email.newproduct.title')}</h2>
        </div>
        <div style="padding: 30px; text-align: center;">
          <p style="color: #4a5568; font-size: 15px;">${t(language, 'email.newproduct.greeting', { name: data.customerName })}</p>
          <p style="color: #718096; font-size: 14px; margin-bottom: 25px;">${t(language, 'email.newproduct.body', { vendor: data.vendorName })}</p>
          
          <div style="border: 1px solid #edf2f7; border-radius: 15px; padding: 15px; background: #fcfcfc;">
            <img src="${data.productImage}" style="width: 100%; border-radius: 12px; aspect-ratio: 1; object-fit: cover; margin-bottom: 15px;" />
            <h3 style="color: #1a202c; margin: 0; font-size: 18px; font-weight: 800;">${data.productName}</h3>
            <p style="color: #E67E22; font-size: 24px; font-weight: 900; margin: 10px 0;">${data.price.toLocaleString()} $</p>
          </div>

          <a href="${data.productLink}" style="display: block; background-color: #E67E22; color: #ffffff; text-align: center; padding: 18px; border-radius: 12px; text-decoration: none; font-weight: 900; font-size: 14px; margin-top: 25px; box-shadow: 0 4px 12px rgba(230, 126, 34, 0.2);">${t(language, 'email.newproduct.cta')}</a>
          
          <p style="color: #a0aec0; font-size: 11px; margin-top: 30px;">
            ${t(language, 'email.newproduct.footer')}
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
  async sendOrderConfirmed(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.confirmed.subject', { product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#f0fdf4;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">✅</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">${t(language, 'email.confirmed.title')}</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">${t(language, 'email.confirmed.greeting', { name: data.customerName, vendor: data.vendorName })}</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">${t(language, 'email.confirmed.productLabel')}</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0aec0;">${t(language, 'email.confirmed.ref')} #${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">${t(language, 'email.confirmed.body')}</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · ${t(language, 'email.confirmed.footer')}</p>
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
  async sendOrderShipped(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string; deliveryAddress: string }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.shipped.subject', { product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fffbeb;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">📦</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">${t(language, 'email.shipped.title')}</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">${t(language, 'email.shipped.greeting', { name: data.customerName, vendor: data.vendorName })}</p>
          <div style="background:#f7f7f7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">${t(language, 'email.shipped.productLabel')}</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:8px 0 0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">${t(language, 'email.shipped.addressLabel')}</p>
            <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#1a202c;">${data.deliveryAddress}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">${t(language, 'email.shipped.body')}</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · ${t(language, 'email.shipped.footer')}</p>
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
  async sendOrderCancelled(data: { customerEmail: string; customerName: string; productName: string; orderId: string; vendorName: string }, language?: string) {
    const sendSmtpEmail = new Brevo.SendSmtpEmail();
    sendSmtpEmail.subject = t(language, 'email.cancelled.subject', { product: data.productName });
    sendSmtpEmail.htmlContent = `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:520px;margin:auto;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;">
        <div style="background:#1a1a1a;padding:24px 20px;text-align:center;">
          <span style="font-size:22px;font-weight:800;color:#E67E22;letter-spacing:1px;">WapiBei</span>
        </div>
        <div style="padding:32px 24px;background:#fff;">
          <div style="text-align:center;margin-bottom:24px;">
            <div style="width:64px;height:64px;background:#fff5f5;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:32px;">❌</div>
          </div>
          <h1 style="font-size:22px;font-weight:800;color:#1a202c;margin:0 0 8px;">${t(language, 'email.cancelled.title')}</h1>
          <p style="color:#4a5568;font-size:15px;line-height:1.6;">${t(language, 'email.cancelled.greeting', { name: data.customerName, vendor: data.vendorName })}</p>
          <div style="background:#fff5f5;border:1px solid #fed7d7;border-radius:12px;padding:20px;margin:24px 0;">
            <p style="margin:0;font-size:13px;color:#718096;text-transform:uppercase;letter-spacing:1px;">${t(language, 'email.cancelled.productLabel')}</p>
            <p style="margin:6px 0 0;font-size:17px;font-weight:700;color:#1a202c;">${data.productName}</p>
            <p style="margin:4px 0 0;font-size:12px;color:#a0aec0;">${t(language, 'email.cancelled.ref')} #${data.orderId.slice(0, 8).toUpperCase()}</p>
          </div>
          <p style="color:#4a5568;font-size:14px;">${t(language, 'email.cancelled.body')}</p>
        </div>
        <div style="background:#f7fafc;padding:16px;text-align:center;">
          <p style="font-size:12px;color:#a0aec0;margin:0;">© WapiBei · ${t(language, 'email.cancelled.footer')}</p>
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