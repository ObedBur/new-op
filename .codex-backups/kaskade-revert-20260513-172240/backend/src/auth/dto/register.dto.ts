import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  IsEnum, 
  IsOptional,
  Validate
} from 'class-validator';
import { Transform } from 'class-transformer';
import { 
  IsValidPhoneNumber,
  IsValidProvince,
  IsValidCommune,
  IsBoutiqueRequiredForVendor,
  IsStrongPassword
} from '../../common/validators';
import { Role } from '@prisma/client';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsStrongPassword)
  password!: string;

  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidPhoneNumber)
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidProvince)
  province!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsValidCommune)
  commune!: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  @Validate(IsBoutiqueRequiredForVendor)
  boutiqueName?: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role!: Role;

  @IsString()
  @IsOptional()
  kycStatus?: string;
}

