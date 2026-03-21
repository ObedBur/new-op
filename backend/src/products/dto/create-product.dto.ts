import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    categoryId: number;

    @IsOptional()
    @IsString()
    image?: string;
}

