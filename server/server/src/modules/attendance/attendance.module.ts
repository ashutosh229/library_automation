import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceService } from '../attendance/services/attendance.services';
import { Attendance, AttendanceSchema } from './entities/attendance.schema';
import { NFCService } from 'src/hardware/nfc/nfc.service';
import { AttendanceController } from '../attendance/controllers/attendance.controllers';
// import { TransactionService } from 'src/modules/transactions/services/transactions.service';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendance.name, schema: AttendanceSchema },
    ]),
    TransactionsModule,
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, NFCService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
