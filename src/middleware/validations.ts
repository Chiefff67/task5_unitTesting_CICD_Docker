import { Request, Response, NextFunction } from "express";
import { IBook } from "../types/book";

export const validateBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { judul, penulis, tahunTerbit, isbn }: IBook = req.body;
    const errors: string[] = [];

    // Validasi judul
    if (!judul || judul.trim().length === 0) {
      errors.push("Judul buku harus diisi");
    }

    // Validasi penulis
    if (!penulis || penulis.trim().length === 0) {
      errors.push("Nama penulis harus diisi");
    }

    // Validasi tahun terbit
    const currentYear = new Date().getFullYear();
    if (
      !tahunTerbit ||
      isNaN(tahunTerbit) ||
      tahunTerbit < 1000 ||
      tahunTerbit > currentYear
    ) {
      errors.push(`Tahun terbit harus antara tahun 1000 dan ${currentYear}`);
    }

    // Validasi ISBN (opsional, tapi harus valid jika diisi)
    if (isbn !== undefined && isbn !== null && isbn !== "") {
      if (!/^(?:\d{10}|\d{13})$/.test(isbn)) {
        errors.push("ISBN harus 10 atau 13 digit angka");
      }
    }

    // Validasi tambahan untuk field opsional
    if (
      req.body.penerbit !== undefined &&
      req.body.penerbit.trim().length === 0
    ) {
      errors.push("Nama penerbit tidak boleh kosong jika diisi");
    }

    if (
      req.body.kategori !== undefined &&
      req.body.kategori.trim().length === 0
    ) {
      errors.push("Kategori tidak boleh kosong jika diisi");
    }

    if (
      req.body.deskripsi !== undefined &&
      req.body.deskripsi.trim().length === 0
    ) {
      errors.push("Deskripsi tidak boleh kosong jika diisi");
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat validasi",
    });
  }
};

// Custom type untuk memperjelas request body
export interface BookRequest extends Request {
  body: IBook;
}

// Validation untuk update (partial data)
export const validatePartialBook = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { judul, penulis, tahunTerbit, isbn }: Partial<IBook> = req.body;
    const errors: string[] = [];

    // Validasi judul jika ada
    if (judul !== undefined) {
      if (judul.trim().length === 0) {
        errors.push("Judul buku tidak boleh kosong");
      }
    }

    // Validasi penulis jika ada
    if (penulis !== undefined) {
      if (penulis.trim().length === 0) {
        errors.push("Nama penulis tidak boleh kosong");
      }
    }

    // Validasi tahun terbit jika ada
    if (tahunTerbit !== undefined) {
      const currentYear = new Date().getFullYear();
      if (
        isNaN(tahunTerbit) ||
        tahunTerbit < 1000 ||
        tahunTerbit > currentYear
      ) {
        errors.push(`Tahun terbit harus antara tahun 1000 dan ${currentYear}`);
      }
    }

    // Validasi ISBN jika ada
    if (isbn !== undefined && isbn !== null && isbn !== "") {
      if (!/^(?:\d{10}|\d{13})$/.test(isbn)) {
        errors.push("ISBN harus 10 atau 13 digit angka");
      }
    }

    // Validasi field opsional jika ada
    if (
      req.body.penerbit !== undefined &&
      req.body.penerbit.trim().length === 0
    ) {
      errors.push("Nama penerbit tidak boleh kosong jika diisi");
    }

    if (
      req.body.kategori !== undefined &&
      req.body.kategori.trim().length === 0
    ) {
      errors.push("Kategori tidak boleh kosong jika diisi");
    }

    if (
      req.body.deskripsi !== undefined &&
      req.body.deskripsi.trim().length === 0
    ) {
      errors.push("Deskripsi tidak boleh kosong jika diisi");
    }

    if (errors.length > 0) {
      res.status(400).json({
        success: false,
        errors,
      });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Terjadi kesalahan saat validasi",
    });
  }
};

// Validator untuk memastikan ID MongoDB valid
export const validateMongoId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = req.params.id;
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    res.status(400).json({
      success: false,
      error: "ID buku tidak valid",
    });
    return;
  }
  next();
};

export default {
  validateBook,
  validatePartialBook,
  validateMongoId,
};
