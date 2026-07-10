import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateNotificationPreferencesDto {
  // Commandes & Ventes
  @IsOptional() @IsBoolean() ordersPush?: boolean;
  @IsOptional() @IsBoolean() ordersEmail?: boolean;
  @IsOptional() @IsBoolean() ordersInApp?: boolean;
  @IsOptional() @IsBoolean() ordersSms?: boolean;

  // Vendeurs Favoris
  @IsOptional() @IsBoolean() followsPush?: boolean;
  @IsOptional() @IsBoolean() followsEmail?: boolean;
  @IsOptional() @IsBoolean() followsInApp?: boolean;
  @IsOptional() @IsBoolean() followsSms?: boolean;

  // Offres & Promotions
  @IsOptional() @IsBoolean() promosPush?: boolean;
  @IsOptional() @IsBoolean() promosEmail?: boolean;
  @IsOptional() @IsBoolean() promosSms?: boolean;

  // Sécurité & Compte
  @IsOptional() @IsBoolean() securityEmail?: boolean;
  @IsOptional() @IsBoolean() securityInApp?: boolean;
}
