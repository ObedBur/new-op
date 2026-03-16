import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface WhatsAppOrderPayload {
  vendorName: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  productImage?: string;
  deliveryAddress: string;
  totalPrice: number;
}

@Injectable()
export class WhatsAppService {
  private readonly logger = new Logger(WhatsAppService.name);
  // 
  private sanitizePhone(phone: string): string {
    return phone.replace(/[\s\-\(\)\+]/g, '');
  }

  
  // Formate le message WhatsApp pour le vendeur.
   
  private formatOrderMessage(data: WhatsAppOrderPayload): string {
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

  
  //  Envoie un message WhatsApp via l'API configurée.
  
  async sendWhatsAppMessage(to: string, message: string): Promise<boolean> {
    const apiUrl = process.env.WHATSAPP_API_URL;
    const apiToken = process.env.WHATSAPP_API_TOKEN;

    const sanitizedPhone = this.sanitizePhone(to);

    // Mode simulation si l'API n'est pas configurée
    if (!apiUrl || !apiToken) {
      this.logger.warn(
        `[WHATSAPP - SIMULATION] API non configurée. Message pour ${sanitizedPhone}:\n${message}`,
      );
      return true;
    }

    try {
      await axios.post(
        apiUrl,
        {
          phone: sanitizedPhone,
          message,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiToken}`,
          },
          timeout: 10000, // 10s timeout pour éviter de bloquer
        },
      );

      this.logger.log(`WhatsApp envoyé à ${sanitizedPhone}`);
      return true;
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      this.logger.error(
        `Échec envoi WhatsApp à ${sanitizedPhone}: ${errMsg}`,
      );
      // On ne relance PAS l'erreur : la commande reste enregistrée
      return false;
    }
  }

  /**
   * Raccourci pour envoyer une alerte de nouvelle commande au vendeur.
   */
  async sendOrderAlert(
    vendorPhone: string,
    data: WhatsAppOrderPayload,
  ): Promise<boolean> {
    const message = this.formatOrderMessage(data);
    return this.sendWhatsAppMessage(vendorPhone, message);
  }
}
