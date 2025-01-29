import {
  Injectable,
  NotFoundException,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import {
  Attendance,
  AttendanceDocument,
} from '../attendance/entities/attendance.schema';
import { CreateAttendanceDto } from '../attendance/dto/createAttendance.dto';
import { UpdateAttendanceDto } from '../attendance/dto/updateAttendance.dto';
import { Purpose } from '../../common/types/types';
import { Subscription } from 'rxjs';
import { NFCService } from '../../hardware/nfc/nfc.service';
import { TransactionService } from 'src/modules/transactions/services/transaction.service';

@Injectable()
export class AttendanceService implements OnModuleInit, OnModuleDestroy {
  private nfcSubscription: Subscription;
  private readonly logger = new Logger(AttendanceService.name);
  private purpose: Purpose;
  public id_id: string;

  constructor(
    @InjectModel(Attendance.name)
    private attendanceModel: Model<AttendanceDocument>,
    private readonly nfcService: NFCService,
    private readonly transactionService: TransactionService,
  ) {
    this.logger.log('AttendanceService initialized');
  }

  async onModuleInit() {
    this.logger.log('onModuleInit - Setting up NFC listener...');
    this.nfcSubscription = this.nfcService
      .onCardDetected()
      .subscribe((cardUid) => {
        this.handleCardTap(cardUid, this.purpose);
      });

    this.nfcService.onCardRemoved().subscribe((readerName) => {
      this.logger.log(`Card removed from reader: ${readerName}`);
    });
  }
  async setPurpose(purpose: Purpose, o_id?: string) {
    var mongoose = require('mongoose');
    var _id: ObjectId = new mongoose.Types.ObjectId(o_id);
    this.purpose = purpose;
    if (_id) this.updateField(_id, { purpose });
  }

  async detectCard(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.nfcService.onCardDetected().subscribe({
        next: (cardUid: string) => {
          this.logger.log(`Card UID detected: ${cardUid}`);
          resolve(cardUid);
        },
        error: (err) => {
          this.logger.error('Error detecting card:', err);
          reject(err);
        },
      });
    });
  }

  async create(
    createAttendanceDto: CreateAttendanceDto,
  ): Promise<AttendanceDocument> {
    this.logger.log('Creating attendance...');
    const createdAttendance = new this.attendanceModel(createAttendanceDto);
    return createdAttendance.save();
  }

  async findAll(): Promise<Attendance[]> {
    this.logger.log('Finding all attendances...');
    return this.attendanceModel.find().exec();
  }

  async findOne(id: string): Promise<AttendanceDocument> {
    this.logger.log(`Finding attendance with ID ${id}...`);
    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return attendance;
  }
  async findLatest(studentId: string): Promise<AttendanceDocument | null> {
    this.logger.log(`Finding latest attendance for student ID ${studentId}...`);
    return this.attendanceModel
      .findOne({ studentId })
      .sort({ entryTime: -1 })
      .exec();
  }

  async update(
    id: string,
    updateAttendanceDto: UpdateAttendanceDto,
  ): Promise<Attendance> {
    this.logger.log(`Updating attendance with ID ${id}...`);
    const existingAttendance = await this.attendanceModel
      .findByIdAndUpdate(id, updateAttendanceDto, { new: true })
      .exec();
    if (!existingAttendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return existingAttendance;
  }
  // async updateField(
  //   id: ObjectId,
  //   updateData: Partial<UpdateAttendanceDto>,
  // ): Promise<Attendance> {
  //   this.logger.log(
  //     `Updating attendance fields for ID ${id} with data ${JSON.stringify(updateData)}...`,
  //   );
  //   const updatedAttendance = await this.attendanceModel
  //     .findByIdAndUpdate(id, { $set: updateData }, { new: true })
  //     .exec();
  //   if (!updatedAttendance) {
  //     this.logger.warn(`Attendance record with ID ${id} not found`);
  //     throw new NotFoundException(`Attendance record with ID ${id} not found`);
  //   }
  //   return updatedAttendance;
  // }

  async updateField(
    id: ObjectId,
    updateData: Partial<UpdateAttendanceDto>,
  ): Promise<Attendance> {
    this.logger.log(
      `Updating attendance fields for ID ${id} with data ${JSON.stringify(updateData)}...`,
    );

    const attendance = await this.attendanceModel.findById(id).exec();
    if (!attendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    if (
      updateData.purpose === 'cancel' ||
      updateData.purpose === 'book_return'
    ) {
      updateData.exitTime = attendance.entryTime;
    }

    const updatedAttendance = await this.attendanceModel
      .findByIdAndUpdate(id, { $set: updateData }, { new: true })
      .exec();
    if (!updatedAttendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return updatedAttendance;
  }
  async remove(id: string): Promise<Attendance> {
    this.logger.log(`Removing attendance with ID ${id}...`);
    const deletedAttendance = await this.attendanceModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedAttendance) {
      this.logger.warn(`Attendance record with ID ${id} not found`);
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return deletedAttendance;
  }

  async handleCardTap(cardUid: string, purpose: Purpose = Purpose.Study) {
    this.logger.log(`Handling card tap for card UID: ${cardUid}`);
    const existingAttendance = await this.attendanceModel
      .findOne({
        studentId: cardUid,
        exitTime: { $exists: false },
      })
      .exec();

    if (existingAttendance) {
      existingAttendance.exitTime = new Date();
      await existingAttendance.save();
      this.logger.log(`Exit time logged for card ID: ${cardUid}`);
    } else {
      let id_id: any = this.logAttendance(cardUid, purpose);
    }
  }

  public async logAttendance(
    cardUid: string,
    purpose: Purpose = Purpose.Study,
  ): Promise<{ id: string }> {
    this.logger.log(`Logging attendance for card UID: ${cardUid}`);
    const attendanceData: CreateAttendanceDto = {
      studentId: cardUid,
      purpose: purpose,
      entryTime: new Date(),
    };

    try {
      const createdAttendance = await this.create(attendanceData);
      this.logger.log(`Attendance logged successfully for card ID: ${cardUid}`);
      this.logger.log(
        `Created attendance record with ID ${createdAttendance._id}`,
      );
      this.id_id = createdAttendance._id.toString();

      if (
        purpose === Purpose.BookIssue ||
        purpose === Purpose.BookReturn ||
        purpose === Purpose.Study
      ) {
        this.transactionService.handleTransaction(cardUid, purpose);
      }
      return { id: createdAttendance._id.toString() };
    } catch (err) {
      this.logger.error(
        `Error logging attendance for card UID ${cardUid}: ${err.message}`,
      );
    }
  }

  public async getObjectID(cardUid: string): Promise<{ id: string }> {
    const attendance = await this.findLatest(cardUid);
    if (!attendance) {
      throw new NotFoundException(
        `Attendance record with student ID ${cardUid} not found`,
      );
    }
    return { id: attendance._id.toString() };
  }
  async onModuleDestroy() {
    if (this.nfcSubscription) {
      this.nfcSubscription.unsubscribe();
    }
  }
}
