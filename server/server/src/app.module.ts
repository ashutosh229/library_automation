import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './modules/users/users.module';
import { BooksModule } from './modules/books/books.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AppController } from './app.controller'; // Import AppController
import { AppService } from './app.service'; // Import AppService

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URL),
    UsersModule,
    BooksModule,
    TransactionsModule,
    AttendanceModule,
  ],
  controllers: [AppController], // Add AppController
  providers: [AppService], // Add AppService
})
export class AppModule {}
