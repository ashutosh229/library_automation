import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Attendance {
  @Prop({ required: true })
  studentId: string;

  @Prop({ required: true })
  purpose: string;

  @Prop({ required: true })
  entryTime: Date;

  @Prop()
  exitTime: Date;
}

export type AttendanceDocument = Attendance & Document;

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);
