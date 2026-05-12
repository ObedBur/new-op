import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
<<<<<<< HEAD
import { Transform } from 'class-transformer';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}

=======

export class LoginDto {
  @IsEmail({}, { message: "L'adresse email fournie n'est pas valide." })
  @IsNotEmpty({ message: "L'email est requis." })
  email: string;

  @IsString({ message: "Le mot de passe doit être une chaîne de caractères." })
  @IsNotEmpty({ message: "Le mot de passe est obligatoire." })
  password: string;
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
