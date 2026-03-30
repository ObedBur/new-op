import { IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsOptional()
  fullName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  province?: string;

  @IsString()
  @IsOptional()
  commune?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @IsString()
  @IsOptional()
  oldPassword?: string;

  @IsString()
  @IsOptional()
  @MaxLength(4)
  transactionPin?: string;
}
