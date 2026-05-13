import { IsNumber, IsPositive, IsNotEmpty } from 'class-validator';

export class ApproveRequestDto {
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  price: number;
}
