import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  readonly bookId: string;

  @IsString()
  @IsNotEmpty()
  readonly title: string;

  @IsString()
  @IsNotEmpty()
  readonly author: string;

  @IsString()
  @IsNotEmpty()
  readonly publisher: string;

  @IsString()
  @IsNotEmpty()
  readonly ISBN: string;

  @IsNumber()
  @IsNotEmpty()
  readonly publicationYear: number;

  @IsString()
  @IsNotEmpty()
  readonly language: string;

  @IsString()
  @IsNotEmpty()
  readonly edition: string;

  @IsString()
  @IsNotEmpty()
  readonly location: string;

  @IsArray()
  @IsOptional()
  readonly transactions?: string[];
}
