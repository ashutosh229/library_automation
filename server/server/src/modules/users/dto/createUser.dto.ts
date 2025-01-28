import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsEnum,
  IsOptional,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  readonly instituteId: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsPhoneNumber(null)
  @IsNotEmpty()
  readonly phoneNumber: string;

  @IsString()
  @IsOptional()
  readonly department?: string;

  @IsString()
  @IsOptional()
  readonly gender?: string;

  @IsEnum(['student', 'faculty', 'staff', 'admin'])
  @IsNotEmpty()
  readonly role: string;

  @IsOptional()
  readonly transactions?: string[];

  @IsOptional()
  readonly attendance?: string[];
}
