import { PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './createBook.dto';

export class UpdateBookDto extends PartialType(CreateBookDto) {}
