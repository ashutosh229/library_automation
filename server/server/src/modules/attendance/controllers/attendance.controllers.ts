import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Logger,
} from '@nestjs/common';

import { AttendanceService } from '../services/attendance.services';
import { CreateAttendanceDto } from '../dto/createAttendance.dto';
import { UpdateAttendanceDto } from '../dto/updateAttendance.dto';
import { Purpose } from 'src/common/types/types';

@Controller('api/attendance')
export class AttendanceController {
  private readonly logger = new Logger(AttendanceController.name);

  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  async findAll() {
    this.logger.log('Finding all attendances...');
    const attendances = await this.attendanceService.findAll();
    this.logger.debug(`Found ${attendances.length} attendances.`);
    return attendances;
  }

  @Get('/data/:id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Finding attendance with ID ${id}...`);
    const attendance = await this.attendanceService.findOne(id);
    if (!attendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    this.logger.debug(
      `Found attendance with ID ${id}: ${JSON.stringify(attendance)}`,
    );
    return attendance;
  }
  @Get('scan-card')
  async scanCard(): Promise<{
    success: boolean;
    cardUid?: string;
    id?: string;
    error?: string;
    isExiting?: boolean;
  }> {
    this.logger.log('Scanning card...');
    try {
      const cardUid = await this.attendanceService.detectCard();
      this.logger.debug(`Card scanned successfully. Card UID: ${cardUid}`);

      const existingAttendance =
        await this.attendanceService.findLatest(cardUid);

      const isExiting: boolean =
        existingAttendance && !existingAttendance.exitTime;

      let idResponse = { id: '', isExiting: false };

      if (isExiting) {
        idResponse = { id: existingAttendance._id.toString(), isExiting: true };
      } else {
        let id = await this.attendanceService.getObjectID(cardUid);
        idResponse = { id: id.id, isExiting: false };
      }

      return {
        success: true,
        cardUid,
        id: idResponse.id,
        isExiting: idResponse.isExiting,
      };
    } catch (error) {
      this.logger.error(`Failed to scan card: ${error.message}`);
      this.scanCard();
      return { success: false, error: error.message };
    }
  }

  @Post()
  async create(@Body() createAttendanceDto: CreateAttendanceDto) {
    this.logger.log('Creating attendance...');
    const createdAttendance =
      await this.attendanceService.create(createAttendanceDto);
    this.logger.debug(
      `Attendance created successfully: ${JSON.stringify(createdAttendance)}`,
    );
    return createdAttendance;
  }

  @Post('/purpose')
  async createPurpose(@Body() purpose: { purpose: Purpose; cardUid: string }) {
    this.logger.log(`Setting purpose: ${purpose.purpose}...`);
    try {
      this.logger.log(`getting cardUid: ${purpose.cardUid}`);
      const idResponse = await this.attendanceService.getObjectID(
        purpose.cardUid,
      );
      this.logger.debug(
        `Card scanned successfully. Card _id: ${idResponse.id}`,
      );
      this.attendanceService.setPurpose(purpose.purpose, idResponse.id);
      this.logger.debug(`Purpose set successfully: ${purpose.purpose}`);
      return { message: 'Purpose set successfully', idResponse: idResponse };
    } catch (error) {
      this.logger.error(`Failed to set purpose: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @Put('data/:id')
  async update(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    this.logger.log(`Updating attendance with ID ${id}...`);
    const updatedAttendance = await this.attendanceService.update(
      id,
      updateAttendanceDto,
    );
    if (!updatedAttendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    this.logger.debug(
      `Attendance updated successfully: ${JSON.stringify(updatedAttendance)}`,
    );
    return updatedAttendance;
  }

  @Delete('data/:id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Removing attendance with ID ${id}...`);
    const deletedAttendance = await this.attendanceService.remove(id);
    if (!deletedAttendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    this.logger.debug(
      `Attendance removed successfully: ${JSON.stringify(deletedAttendance)}`,
    );
    return deletedAttendance;
  }
}
