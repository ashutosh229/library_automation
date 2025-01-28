import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDto } from './createTransaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {}
