import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

/**
 * DTO pour la mise à jour d'un produit.
 * Rend tous les champs de CreateProductDto optionnels.
 */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
