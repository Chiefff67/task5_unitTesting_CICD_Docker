import Book from "../models/Book";
import { IBook } from "../types/book";

export class BookService {
  async createBook(bookData: Partial<IBook>) {
    const book = new Book(bookData);
    return await book.save();
  }

  async getAllBooks() {
    return await Book.find();
  }

  async getBookById(id: string) {
    const book = await Book.findById(id);
    if (!book) throw new Error("Buku Tidak Ditemukan!");
    return book;
  }

  async updateBook(id: string, bookData: Partial<IBook>) {
    const book = await Book.findByIdAndUpdate(id, bookData, {
      new: true,
    });
    if (!book) throw new Error("Buku Tidak Ditemukan!");
    return book;
  }

  async deleteBook(id: string) {
    const book = await Book.findByIdAndDelete(id);
    if (!book) throw new Error("Buku Tidak Ditemukan!");
    return book;
  }
}

export default new BookService();
