import { Request, Response } from "express";
import bookService from "../service/bookService";

export const addBook = async (req: Request, res: Response) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getBookById = async (req: Request, res: Response) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateBook = async (req: Request, res: Response) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.json(book);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const deleteBook = async (req: Request, res: Response) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.json({ message: "Buku berhasil dihapus" });
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};
