"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WhatsAppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsAppService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let WhatsAppService = WhatsAppService_1 = class WhatsAppService {
    constructor() {
        this.logger = new common_1.Logger(WhatsAppService_1.name);
    }
    sanitizePhone(phone) {
        return phone.replace(/[\s\-\(\)\+]/g, '');
    }
    formatOrderMessage(data) {
        const photoLine = data.productImage ? ` *Photo :* ${data.productImage}` : '';
        return [
            ` *Nouvelle commande sur WapiBei*`,
            ``,
            ` *Client :* ${data.customerName}`,
            ` *Tel :* ${data.customerPhone}`,
            ` *Adresse :* ${data.deliveryAddress}`,
            ``,
            ` *Produit :* ${data.productName}`,
            ` *Total :* ${data.totalPrice.toLocaleString()} $`,
            photoLine,
            ``,
            `_Veuillez contacter le client pour confirmer la livraison._`,
        ].filter(line => line !== '').join('\n');
    }
    async sendWhatsAppMessage(to, message) {
        const apiUrl = process.env.WHATSAPP_API_URL;
        const apiToken = process.env.WHATSAPP_API_TOKEN;
        const sanitizedPhone = this.sanitizePhone(to);
        if (!apiUrl || !apiToken) {
            this.logger.warn(`[WHATSAPP - SIMULATION] API non configurée. Message pour ${sanitizedPhone}:\n${message}`);
            return true;
        }
        try {
            await axios_1.default.post(apiUrl, {
                phone: sanitizedPhone,
                message,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${apiToken}`,
                },
                timeout: 10000,
            });
            this.logger.log(`WhatsApp envoyé à ${sanitizedPhone}`);
            return true;
        }
        catch (error) {
            const errMsg = error instanceof Error ? error.message : String(error);
            this.logger.error(`Échec envoi WhatsApp à ${sanitizedPhone}: ${errMsg}`);
            return false;
        }
    }
    async sendOrderAlert(vendorPhone, data) {
        const message = this.formatOrderMessage(data);
        return this.sendWhatsAppMessage(vendorPhone, message);
    }
};
exports.WhatsAppService = WhatsAppService;
exports.WhatsAppService = WhatsAppService = WhatsAppService_1 = __decorate([
    (0, common_1.Injectable)()
], WhatsAppService);
//# sourceMappingURL=whatsapp.service.js.map