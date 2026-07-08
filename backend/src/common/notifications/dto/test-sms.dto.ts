import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class TestSmsDto {
  @IsString()
  @IsNotEmpty({
    message: 'Le numéro de téléphone est obligatoire.',
  })
  @Matches(/^\+[1-9]\d{6,14}$/, {
    message:
      'Le numéro de téléphone doit être au format E.164 (ex: +33612345678). Il doit commencer par +, suivi de 7 à 15 chiffres sans espaces ni tirets.',
  })
  phone!: string;

  @IsString()
  @IsNotEmpty({
    message: 'Le message ne peut pas être vide.',
  })
  @Matches(/\S/, {
    message: 'Le message doit contenir au moins 1 caractère réel.',
  })
  @MaxLength(160, {
    message: 'Le message ne peut pas dépasser 160 caractères.',
  })
  message!: string;
}
