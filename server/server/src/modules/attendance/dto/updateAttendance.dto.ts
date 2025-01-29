import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './createAttendance.dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
