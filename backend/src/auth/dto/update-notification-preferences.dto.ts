import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  // Commandes & Ventes
  @IsOptional() @IsBoolean() ordersPush?: boolean;
  @IsOptional() @IsBoolean() ordersEmail?: boolean;
  @IsOptional() @IsBoolean() ordersInApp?: boolean;

  // Vendeurs Favoris
  @IsOptional() @IsBoolean() followsPush?: boolean;
  @IsOptional() @IsBoolean() followsEmail?: boolean;
  @IsOptional() @IsBoolean() followsInApp?: boolean;

  // Offres & Promotions
  @IsOptional() @IsBoolean() promosPush?: boolean;
  @IsOptional() @IsBoolean() promosEmail?: boolean;

  // Sécurité & Compte
  @IsOptional() @IsBoolean() securityEmail?: boolean;
  @IsOptional() @IsBoolean() securityInApp?: boolean;
}
