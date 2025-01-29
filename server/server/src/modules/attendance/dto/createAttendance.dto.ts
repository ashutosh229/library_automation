import { IsEnum, IsNotEmpty } from 'class-validator';
import { Purpose } from '../../../common/types/types';

export class CreateAttendanceDto {
  @IsNotEmpty()
  studentId: string;

  @IsEnum(Purpose)
  purpose: Purpose;

  @IsNotEmpty()
  entryTime: Date;

  exitTime?: Date;
}
