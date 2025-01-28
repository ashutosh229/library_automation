import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  readonly studentId: string;

  @IsString()
  @IsNotEmpty()
  readonly bookId: string;

  @IsDateString()
  @IsNotEmpty()
  readonly issueDate: Date;

  @IsDateString()
  @IsNotEmpty()
  readonly returnDate?: Date;

  @IsDateString()
  @IsOptional()
  readonly dueDate: Date;

  @IsString()
  @IsNotEmpty()
  readonly status: string;

  @IsOptional()
  readonly fineImposed?: number;

  @IsOptional()
  readonly fineStatus?: string;
}
