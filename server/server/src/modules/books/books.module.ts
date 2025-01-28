import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './entities/books.schema';
import { BooksService } from './services/books.service';
import { BooksController } from './controllers/books.controllers';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
  ],
  controllers: [BooksController],
  providers: [BooksService],
})
export class BooksModule {}
