import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
<<<<<<< HEAD
import { Transform } from 'class-transformer';
=======
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef

export class VerifyOtpDto {
  @IsEmail()
  @IsNotEmpty()
<<<<<<< HEAD
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp!: string;
}

=======
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6)
  otp: string;
}
>>>>>>> 290370a19af069c11dcba02e6949aa48c45160ef
