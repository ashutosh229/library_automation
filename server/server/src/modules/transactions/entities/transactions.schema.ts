import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TransactionDocument = Transaction & Document;

@Schema()
export class Transaction {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  bookId: string;

  @Prop({ required: true })
  issueDate: Date;

  @Prop()
  returnDate: Date;

  @Prop({ required: true })
  dueDate: Date;

  @Prop({ required: true })
  status: string;

  @Prop()
  fineImposed: number;

  @Prop()
  fineStatus: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
