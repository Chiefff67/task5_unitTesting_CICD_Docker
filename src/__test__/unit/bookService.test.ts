import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { BookService } from "../../service/bookService";
import Book from "../../models/Book";
import { IBook } from "../../types/book";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

describe("BookService", () => {
  let bookService: BookService;

  const mockBook: IBook = {
    judul: "Test Book",
    penulis: "Test Author",
    tahunTerbit: 2024,
    isbn: "1234567890",
    penerbit: "Test Publisher",
    kategori: "Test Category",
    deskripsi: "Test Description",
  };

  beforeEach(() => {
    bookService = new BookService();
    jest.clearAllMocks();
  });

  describe("createBook", () => {
    it("should create a new book successfully", async () => {
      const saveMock = jest
        .spyOn(Book.prototype, "save")
        .mockResolvedValueOnce(mockBook as any);

      const result = await bookService.createBook(mockBook);

      expect(saveMock).toHaveBeenCalled();
      expect(result).toEqual(mockBook);
    });

    it("should create a book without optional fields", async () => {
      const minimalBook: Partial<IBook> = {
        judul: "Test Book",
        penulis: "Test Author",
        tahunTerbit: 2024,
      };

      jest
        .spyOn(Book.prototype, "save")
        .mockResolvedValueOnce(minimalBook as any);

      const result = await bookService.createBook(minimalBook);
      expect(result.judul).toBe(minimalBook.judul);
      expect(result.penulis).toBe(minimalBook.penulis);
      expect(result.tahunTerbit).toBe(minimalBook.tahunTerbit);
    });

    it("should throw error if required fields are missing", async () => {
      const invalidBook: Partial<IBook> = {
        judul: "Test Book",
      };

      jest
        .spyOn(Book.prototype, "save")
        .mockRejectedValueOnce(new Error("Validation error"));

      await expect(bookService.createBook(invalidBook)).rejects.toThrow(
        "Validation error"
      );
    });
  });

  describe("getAllBooks", () => {
    it("should return all books", async () => {
      const mockBooks: Partial<IBook>[] = [
        {
          judul: "Book 1",
          penulis: "Author 1",
          tahunTerbit: 2024,
        },
        {
          judul: "Book 2",
          penulis: "Author 2",
          tahunTerbit: 2023,
        },
      ];

      jest.spyOn(Book, "find").mockResolvedValueOnce(mockBooks as any);

      const result = await bookService.getAllBooks();
      expect(result).toEqual(mockBooks);
      expect(Book.find).toHaveBeenCalled();
    });
  });

  describe("getBookById", () => {
    it("should return book by id", async () => {
      jest.spyOn(Book, "findById").mockResolvedValueOnce(mockBook as any);

      const result = await bookService.getBookById("test-id");
      expect(result).toEqual(mockBook);
      expect(Book.findById).toHaveBeenCalledWith("test-id");
    });

    it("should throw error if book not found", async () => {
      jest.spyOn(Book, "findById").mockResolvedValueOnce(null);

      await expect(bookService.getBookById("non-existent-id")).rejects.toThrow(
        "Buku Tidak Ditemukan!"
      );
    });
  });

  describe("updateBook", () => {
    it("should update book successfully", async () => {
      const updateData: Partial<IBook> = {
        judul: "Updated Book",
        penulis: "Updated Author",
      };

      const mockUpdatedBook = {
        ...updateData,
        tahunTerbit: 2024,
        updatedAt: new Date(),
      };

      jest
        .spyOn(Book, "findByIdAndUpdate")
        .mockResolvedValueOnce(mockUpdatedBook as any);

      const result = await bookService.updateBook("test-id", updateData);
      expect(result).toEqual(mockUpdatedBook);
      expect(Book.findByIdAndUpdate).toHaveBeenCalledWith(
        "test-id",
        updateData,
        { new: true }
      );
    });

    it("should throw error if book to update not found", async () => {
      jest.spyOn(Book, "findByIdAndUpdate").mockResolvedValueOnce(null);

      await expect(
        bookService.updateBook("non-existent-id", {})
      ).rejects.toThrow("Buku Tidak Ditemukan!");
    });
  });

  describe("deleteBook", () => {
    it("should delete book successfully", async () => {
      jest
        .spyOn(Book, "findByIdAndDelete")
        .mockResolvedValueOnce(mockBook as any);

      const result = await bookService.deleteBook("test-id");
      expect(result).toEqual(mockBook);
      expect(Book.findByIdAndDelete).toHaveBeenCalledWith("test-id");
    });

    it("should throw error if book to delete not found", async () => {
      jest.spyOn(Book, "findByIdAndDelete").mockResolvedValueOnce(null);

      await expect(bookService.deleteBook("non-existent-id")).rejects.toThrow(
        "Buku Tidak Ditemukan!"
      );
    });
  });
});
