import { IsNotEmpty, IsString, IsOptional, IsNumber, Min, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO pour la création d'un nouveau produit.
 * Définit les règles de validation strictes pour les données entrantes.
 */
export class CreateProductDto {
  /**
   * Nom commercial du produit.
   */
  @IsNotEmpty({ message: 'Le nom du produit est obligatoire.' })
  @IsString()
  name: string;

  /**
   * Description détaillée du produit.
   */
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * Traductions optionnelles du nom (fr, en, sw).
   */
  @IsOptional()
  @IsString()
  nameFr?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  nameSw?: string;

  /**
   * Traductions optionnelles de la description (fr, en, sw).
   */
  @IsOptional()
  @IsString()
  descriptionFr?: string;

  @IsOptional()
  @IsString()
  descriptionEn?: string;

  @IsOptional()
  @IsString()
  descriptionSw?: string;

  /**
   * Prix unitaire du produit. 
   * Doit être un nombre positif.
   */
  @IsNotEmpty({ message: 'Le prix est obligatoire.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'Le prix doit être un nombre valide.' })
  @Min(0, { message: 'Le prix ne peut pas être inférieur à 0.' })
  price: number;

  /**
   * Identifiant de la catégorie à laquelle appartient le produit.
   */
  @IsNotEmpty({ message: 'La catégorie est obligatoire.' })
  @Type(() => Number)
  @IsNumber({}, { message: 'L\'identifiant de catégorie doit être un nombre.' })
  categoryId: number;

  /**
   * URL de l'image représentative du produit.
   */
  @IsOptional()
  @IsString()
  image?: string;

  /**
   * Définit si le produit est visible par le public ou reste en brouillon.
   */
  @IsOptional()
  @IsBoolean()
  isPublic?: boolean;

  /**
   * Quantité disponible en stock au moment de la création.
   */
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  stockQuantity?: number;

  /**
   * Unité de mesure (ex: Pièce, Kg, Litre).
   */
  @IsOptional()
  @IsString()
  unit?: string;
}
