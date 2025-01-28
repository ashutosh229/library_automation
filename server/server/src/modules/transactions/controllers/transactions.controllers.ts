import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Logger,
} from '@nestjs/common';
import { TransactionService } from '../services/transaction.service';
import { CreateTransactionDto } from '../dto/createTransaction.dto';
import { UpdateTransactionDto } from '../dto/updateTransaction.dto';
import { ReturnTransactionDto } from '../dto/returnTransaction.dto';
import { Transaction } from '../entities/transactions.schema'; // Import the Transaction type

@Controller('api/transactions')
export class TransactionController {
  private readonly logger = new Logger(TransactionController.name);

  constructor(private readonly transactionsService: TransactionService) {}

  @Post('/return')
  async returnBook(@Body() returnTransactionDto: ReturnTransactionDto) {
    this.logger.log('Returning a book');
    this.logger.debug(`Return data: ${JSON.stringify(returnTransactionDto)}`);
    try {
      const transaction = await this.transactionsService.returnBook(
        returnTransactionDto.studentId,
        returnTransactionDto.bookId,
        returnTransactionDto.returnDate,
      );
      this.logger.log('Book returned successfully');
      return transaction;
    } catch (error) {
      this.logger.error('Error returning book', error.stack);
      throw error;
    }
  }

  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    this.logger.log('Creating a new transaction');
    this.logger.debug(
      `Transaction data: ${JSON.stringify(createTransactionDto)}`,
    );
    try {
      const transaction =
        await this.transactionsService.create(createTransactionDto);
      const transactionId = transaction['_id'].toString();
      this.logger.log(
        `Transaction created successfully with ID: ${transactionId}`,
      );
      return transaction;
    } catch (error) {
      this.logger.error('Error creating transaction', error.stack);
      throw error;
    }
  }

  @Get()
  async findAll() {
    this.logger.log('Fetching all transactions');
    try {
      const transactions = await this.transactionsService.findAll();
      this.logger.log(`Fetched ${transactions.length} transactions`);
      return transactions;
    } catch (error) {
      this.logger.error('Error fetching transactions', error.stack);
      throw error;
    }
  }

  @Get('data/:id')
  async findOne(@Param('id') id: string) {
    this.logger.log(`Fetching transaction with ID: ${id}`);
    try {
      const transaction = await this.transactionsService.findOne(id);
      this.logger.log(`Transaction fetched successfully with ID: ${id}`);
      return transaction;
    } catch (error) {
      this.logger.error(
        `Error fetching transaction with ID: ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  @Put('data/:id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDto: UpdateTransactionDto,
  ) {
    this.logger.log(`Updating transaction with ID: ${id}`);
    this.logger.debug(`Update data: ${JSON.stringify(updateTransactionDto)}`);
    try {
      const transaction = await this.transactionsService.update(
        id,
        updateTransactionDto,
      );
      this.logger.log(`Transaction updated successfully with ID: ${id}`);
      return transaction;
    } catch (error) {
      this.logger.error(
        `Error updating transaction with ID: ${id}`,
        error.stack,
      );
      throw error;
    }
  }

  @Delete('data/:id')
  async remove(@Param('id') id: string) {
    this.logger.log(`Removing transaction with ID: ${id}`);
    try {
      const transaction = await this.transactionsService.remove(id);
      this.logger.log(`Transaction removed successfully with ID: ${id}`);
      return transaction;
    } catch (error) {
      this.logger.error(
        `Error removing transaction with ID: ${id}`,
        error.stack,
      );
      throw error;
    }
  }
}
