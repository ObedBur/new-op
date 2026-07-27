import {
  IsString,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * DTO de validation pour l'envoi d'un SMS.
 *
 * Ce DTO est requis pour activer la ValidationPipe globale sur le endpoint
 * POST /notifications/test-sms. Sans classe décorée, la pipe est inopérante.
 *
 * phone : format E.164 strict (ex: +33612345678, +243812345678)
 * message : entre 1 et 1600 caractères réels (après trim)
 */
export class SendSmsDto {
  /**
   * Numéro de téléphone destinataire au format E.164 strict.
   * Règle : + suivi de 1 à 9 (pas de 0), puis 6 à 14 chiffres.
   * Exemples valides : +33612345678, +243812345678, +12125551234
   * Exemples invalides : 0612345678, +33 6 12, ++33, +336, abc
   */
  @IsString({
    message: 'Le numéro de téléphone doit être une chaîne de caractères.',
  })
  @IsNotEmpty({ message: 'Le numéro de téléphone est obligatoire.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message:
      'Le numéro de téléphone doit être au format E.164 (ex: +33612345678). ' +
      'Il doit commencer par +, suivi de 7 à 15 chiffres sans espaces ni tirets.',
  })
  phone!: string;

  /**
   * Contenu du SMS à envoyer.
   * Longueur maximale : 1600 caractères (10 segments GSM7 / 7 segments Unicode).
   * Le contenu est trimé automatiquement avant validation.
   */
  @IsString({ message: 'Le message doit être une chaîne de caractères.' })
  @IsNotEmpty({ message: 'Le message ne peut pas être vide.' })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @MinLength(1, {
    message: 'Le message doit contenir au moins 1 caractère réel.',
  })
  @MaxLength(1600, {
    message:
      'Le message ne peut pas dépasser 1600 caractères (limite SMS multi-segments).',
  })
  message!: string;
}
