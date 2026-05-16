import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import axios from 'axios';
import Filter = require('bad-words');
import * as FormData from 'form-data';

/**
 * Service de modération automatique du contenu.
 * Valide les textes (mots interdits), les images (NSFW via TensorFlow/NSFWJS)
 * et la qualité globale d'une annonce avant sa publication.
 */
@Injectable()
export class ModerationService {
  private readonly logger = new Logger(ModerationService.name);
  private filter: any;
  private model: import('nsfwjs').NSFWJS | null = null;
  private tfModule: typeof import('@tensorflow/tfjs') | null = null;
  private jimpModule: typeof import('jimp') | null = null;
  private modelLoadPromise: Promise<import('nsfwjs').NSFWJS | null> | null = null;

  constructor() {
    this.filter = new Filter();
    this.filter.addWords(
      'tramadol', 'viagra', 'arnaque', 'argent facile', 'investir vite',
      'con', 'connard', 'salope', 'putain', 'merde', 'bâtard', 'pute',
      'sexe', 'porno', 'nude', 'chier', 'enculé', 'nègre', 'pd'
    );
  }

  /**
   * Charge le modèle NSFWJS de manière paresseuse (lazy-loading).
   * Évite de charger TensorFlow au démarrage de l'application (impact mémoire).
   */
  private async ensureModelLoaded(): Promise<import('nsfwjs').NSFWJS | null> {
    if (this.model) {
      return this.model;
    }

    if (!this.modelLoadPromise) {
      this.modelLoadPromise = (async () => {
        this.logger.log("Chargement à la demande du modèle de modération d'image...");

        try {
          const [nsfwModule, tfModule, jimpModule] = await Promise.all([
            import('nsfwjs'),
            import('@tensorflow/tfjs'),
            import('jimp'),
          ]);

          this.tfModule = tfModule;
          this.jimpModule = jimpModule;
          this.model = await nsfwModule.load();
          this.logger.log("Modèle de modération d'image prêt.");
          return this.model;
        } catch (error) {
          const message = error instanceof Error ? error.stack || error.message : String(error);
          this.logger.error('Impossible de charger le modèle NSFWJS', message);
          return null;
        } finally {
          if (!this.model) {
            this.modelLoadPromise = null;
          }
        }
      })();
    }

    return this.modelLoadPromise;
  }

  /**
   * Filtre les contenus textuels inadéquats (mots profanes, produits interdits).
   */
  validateText(title: string, description: string): boolean {
    const isBadTitle = this.filter.isProfane(title);
    const isBadDesc = this.filter.isProfane(description || '');

    if (isBadTitle || isBadDesc) {
      throw new BadRequestException({
        message: "Votre texte contient des termes inappropriés non autorisés.",
        error: 'LOCAL_CONTENT_ERROR'
      });
    }
    return true;
  }

  /**
   * Analyse une image via TensorFlow/NSFWJS pour détecter du contenu explicite.
   * Supporte les URLs distantes et les images encodées en Base64.
   * En cas d'indisponibilité du modèle, la validation est ignorée (fail-open).
   */
  async validateImage(imageUrl: string): Promise<boolean> {
    if (!imageUrl || imageUrl.includes('unsplash.com')) return true;

    const apiUser = process.env.SIGHTENGINE_API_USER;
    const apiSecret = process.env.SIGHTENGINE_API_SECRET;

    if (!apiUser || !apiSecret) {
      this.logger.warn("Clés d'API Sightengine manquantes. Modération d'image ignorée.");
      return true;
    }

    try {
      const data = new FormData();
      data.append('models', 'nudity-2.0,gore,weapons');
      data.append('api_user', apiUser);
      data.append('api_secret', apiSecret);

      if (imageUrl.startsWith('data:')) {
        const base64Data = imageUrl.split(';base64,').pop();
        if (!base64Data) throw new Error('Données Base64 invalides');
        
        const buffer = Buffer.from(base64Data, 'base64');
        data.append('media', buffer, { filename: 'image.jpg' });
      } else {
        data.append('url', imageUrl);
      }

      this.logger.log(`Envoi de l'image à Sightengine pour vérification...`);
      const response = await axios({
        method: 'post',
        url: 'https://api.sightengine.com/1.0/check.json',
        data: data,
        headers: data.getHeaders()
      });

      const result = response.data;

      if (result.status === 'success') {
        // Vérification nudité
        if (result.nudity && (result.nudity.sexual_activity > 0.4 || result.nudity.sexual_display > 0.4 || result.nudity.erotica > 0.6)) {
          this.logger.warn(`Image rejetée pour nudité. Scores: ${JSON.stringify(result.nudity)}`);
          throw new BadRequestException({
            message: "L'image a été rejetée car elle contient de la nudité ou du contenu sexuel.",
            error: 'MODERATION_ERROR_NUDITY'
          });
        }
        
        // Vérification violence/gore
        if (result.gore && result.gore.prob > 0.5) {
           this.logger.warn(`Image rejetée pour gore. Score: ${result.gore.prob}`);
           throw new BadRequestException({
             message: "L'image a été rejetée car elle contient du contenu violent ou graphique.",
             error: 'MODERATION_ERROR_GORE'
           });
        }
      }
      
      return true;
    } catch (error: any) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      this.logger.error("Erreur lors de la communication avec Sightengine:", error?.response?.data || error?.message);
      // En cas d'erreur API, on laisse passer (fail-open) ou on bloque (fail-closed).
      // On choisit fail-open pour ne pas bloquer les utilisateurs si l'API est down.
      return true;
    }
  }

  /**
   * Vérifie la qualité minimale d'une annonce (longueur du titre, description, cohérence du prix).
   */
  validateQuality(title: string, description: string, price: number): boolean {
    const titleWords = title.trim().split(/\s+/).filter(w => w.length > 1);
    if (titleWords.length < 2) throw new BadRequestException({ message: "Titre trop court (min 2 mots).", error: 'QUALITY_ERROR' });
    if (!description || description.trim().length < 10) throw new BadRequestException({ message: "Description trop courte (min 10 caractères).", error: 'QUALITY_ERROR' });
    if (price <= 0 || price > 100000) throw new BadRequestException({ message: "Prix invalide ou incohérent.", error: 'PRICE_ERROR' });
    return true;
  }

  /**
   * Validation complète d'un produit avant publication.
   * Enchaîne les vérifications texte, qualité et image.
   */
  async fullValidation(title: string, description: string, price: number, imageUrl?: string) {
    this.validateText(title, description);
    this.validateQuality(title, description, price);
    if (imageUrl) {
      await this.validateImage(imageUrl);
    }
  }
}
