import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from '../entities/books.schema';
import { CreateBookDto } from '../dto/createBook.dto';
import { UpdateBookDto } from '../dto/updateBook.dto';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    const existingBook = await this.bookModel
      .findByIdAndUpdate(id, updateBookDto, { new: true })
      .exec();
    if (!existingBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return existingBook;
  }

  async remove(id: string): Promise<Book> {
    const deletedBook = await this.bookModel.findByIdAndDelete(id).exec();
    if (!deletedBook) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return deletedBook;
  }
}
