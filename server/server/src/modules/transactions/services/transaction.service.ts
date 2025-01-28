import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from '../entities/transactions.schema';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { Purpose } from 'src/common/types/types';

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction> {
    const transaction = await this.transactionModel.findById(id).exec();
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async update(
    id: string,
    updateTransactionDto: UpdateTransactionDto,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionModel
      .findByIdAndUpdate(id, updateTransactionDto, { new: true })
      .exec();
    if (!existingTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return existingTransaction;
  }

  async remove(id: string): Promise<Transaction> {
    const deletedTransaction = await this.transactionModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedTransaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return deletedTransaction;
  }

  async handleTransaction(studentId: string, purpose: Purpose) {
    if (purpose === Purpose.BookIssue || purpose === Purpose.Study) {
      await this.issueBook(studentId);
    } else if (purpose === Purpose.BookReturn) {
      // await this.returnBook(studentId);
    }
  }
  async returnBook(
    studentId: string,
    bookId: string,
    returnDate: Date,
  ): Promise<Transaction> {
    this.logger.log(
      `Returning book with ID: ${bookId} for student ID: ${studentId}`,
    );

    const transaction = await this.transactionModel
      .findOne({ studentId, bookId, returnDate: { $exists: false } })
      .exec();

    if (!transaction) {
      throw new NotFoundException(
        `No issued transaction found for student ID ${studentId} and book ID ${bookId}`,
      );
    }

    transaction.returnDate = returnDate;
    transaction.status = 'returned';
    const updatedTransaction = await transaction.save();

    this.logger.log(
      `Book returned successfully for student ID: ${studentId} and book ID: ${bookId}`,
    );
    return updatedTransaction;
  }

  private async issueBook(studentId: string) {
    this.logger.log(`Issuing book for student ID: ${studentId}`);
  }
}
