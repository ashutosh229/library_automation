import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Book {
  @Prop({ required: true })
  title: string;
  @Prop({ required: true })
  author: string;
  @Prop({ required: true })
  ISBN: string;
  @Prop({ required: true })
  publicationYear: number;
  @Prop({ required: true })
  language: string;
  @Prop({ required: true })
  edition: string;
  @Prop({ required: true })
  location: string;
  @Prop({ required: true })
  barcode: string;
  @Prop({ required: true })
  genre: string;
}

export type BookDocument = Book & Document;
export const BookSchema = SchemaFactory.createForClass(Book);
