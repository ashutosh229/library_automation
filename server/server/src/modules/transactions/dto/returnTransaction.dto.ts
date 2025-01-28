import { IsString, IsNotEmpty, IsDateString } from 'class-validator';

export class ReturnTransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly studentId: string;

  @IsString()
  @IsNotEmpty()
  readonly bookId: string;

  @IsDateString()
  @IsNotEmpty()
  readonly returnDate: Date;
}
