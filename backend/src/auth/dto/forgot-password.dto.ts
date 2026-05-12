import { IsEmail, IsNotEmpty } from 'class-validator';
<<<<<<< HEAD
import { Transform } from 'class-transformer';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;
}

=======

export class ForgotPasswordDto {
  @IsEmail({}, { message: 'Veuillez fournir une adresse e-mail valide' })
  @IsNotEmpty({ message: "L'e-mail est requis" })
  email: string;
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
