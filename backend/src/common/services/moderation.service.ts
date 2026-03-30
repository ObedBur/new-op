import { Injectable, BadRequestException, OnModuleInit } from '@nestjs/common';
import * as nsfw from 'nsfwjs';
import * as tf from '@tensorflow/tfjs';
import axios from 'axios';
import { Jimp } from 'jimp';
import Filter = require('bad-words');

@Injectable()
export class ModerationService implements OnModuleInit {
  private filter: any;
  private model: nsfw.NSFWJS | null = null;

  constructor() {
    this.filter = new Filter();
    this.filter.addWords('tramadol', 'viagra', 'arnaque', 'argent facile', 'investir vite');
  }

  async onModuleInit() {
    console.error(" Initialisation du modèle de modération d'image (NSFWJS)...");
    try {
      this.model = await nsfw.load();
      console.error(' Modèle de modération d\'image chargé avec succès.');
    } catch (error) {
      console.error(' Erreur lors du chargement du modèle NSFWJS:', error);
    }
  }

  validateText(title: string, description: string): boolean {
    const isBadTitle = this.filter.isProfane(title);
    const isBadDesc = this.filter.isProfane(description || '');

    console.log(`[Moderation] Text validation: title profane=${isBadTitle}, desc profane=${isBadDesc}`);

    if (isBadTitle || isBadDesc) {
      throw new BadRequestException({
        message: "Votre texte contient des termes inappropriés non autorisés.",
        error: 'LOCAL_CONTENT_ERROR'
      });
    }
    return true;
  }

  /**
   * Modération d'image locale via TensorFlow/NSFWJS
   */
  async validateImage(imageUrl: string): Promise<boolean> {
    if (!imageUrl || imageUrl.includes('unsplash.com')) return true;
    if (!this.model) return true;

    let imageTensor: tf.Tensor3D | null = null;

    try {
      let buffer: Buffer;

      // 1. Détecter si c'est une image Base64 ou une URL distante
      if (imageUrl.startsWith('data:')) {
        const base64Data = imageUrl.split(';base64,').pop();
        if (!base64Data) throw new Error('Invalid Base64 data');
        buffer = Buffer.from(base64Data, 'base64');
      } else {
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        buffer = Buffer.from(response.data);
      }

      // 2. Décoder l'image
      const image = await Jimp.read(buffer);
      const { width, height, data } = image.bitmap;
      
      const numChannels = 3;
      const numPixels = width * height;
      const values = new Int32Array(numPixels * numChannels);

      for (let i = 0; i < numPixels; i++) {
        const j = i * 4;
        values[i * numChannels + 0] = data[j + 0];
        values[i * numChannels + 1] = data[j + 1];
        values[i * numChannels + 2] = data[j + 2];
      }

      imageTensor = tf.tensor3d(values, [height, width, numChannels], 'int32');

      const predictions = await this.model.classify(imageTensor);
      console.log(`[Moderation] Image predictions for ${imageUrl}:`, predictions);

      const nsfwThreshold = 0.30;
      const dangerousClasses = ['Porn', 'Hentai', 'Sexy'];

      const topPrediction = predictions.find(p => dangerousClasses.includes(p.className));

      if (topPrediction && topPrediction.probability > nsfwThreshold) {
        console.warn(`[Moderation] Image REJECTED: ${topPrediction.className} (${topPrediction.probability})`);
        throw new BadRequestException({
          message: `L'image a été rejetée car elle contient du contenu ${topPrediction.className.toLowerCase()}.`,
          error: 'LOCAL_IMAGE_ERROR'
        });
      }

      console.log(`[Moderation] Image ACCEPTED`);

      return true;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      console.error("NSFW Analysis error:", error);
      return true;
    } finally {
      if (imageTensor) {
        imageTensor.dispose();
      }
    }
  }

  validateQuality(title: string, description: string, price: number): boolean {
    const titleWords = title.trim().split(/\s+/).filter(w => w.length > 1);
    if (titleWords.length < 2) throw new BadRequestException({ message: "Titre trop court (min 2 mots).", error: 'QUALITY_ERROR' });
    if (!description || description.trim().length < 10) throw new BadRequestException({ message: "Description trop courte (min 10 car.).", error: 'QUALITY_ERROR' });
    if (price <= 0 || price > 100000) throw new BadRequestException({ message: "Prix invalide ou incohérent.", error: 'PRICE_ERROR' });
    return true;
  }

  async fullValidation(title: string, description: string, price: number, imageUrl?: string) {
    this.validateText(title, description);
    this.validateQuality(title, description, price);
    if (imageUrl) {
      await this.validateImage(imageUrl);
    }
  }
}