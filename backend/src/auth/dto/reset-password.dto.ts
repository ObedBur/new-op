<<<<<<< HEAD
import { IsEmail, IsNotEmpty, IsString, Validate } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsStrongPassword } from '../../common/validators';

export class ResetPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  token!: string;

  @IsString()
  @IsNotEmpty()
  @Validate(IsStrongPassword)
  newPassword!: string;
}

=======
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: 'Le token de réinitialisation est requis' })
  token: string;

  @IsString()
  @IsNotEmpty({ message: 'Le nouveau mot de passe est requis' })
  @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
  newPassword: string;
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
