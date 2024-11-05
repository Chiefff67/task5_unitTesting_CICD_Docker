import mongoose from "mongoose";
import { IBook } from "../types/book";

const bookSchema = new mongoose.Schema<IBook>({
  judul: {
    type: String,
    required: true,
    description: "Judul buku",
  },
  isbn: {
    type: String,
    unique: true,
    sparse: true,
    description: "Nomor ISBN buku",
  },
  penulis: {
    type: String,
    required: true,
    description: "Nama penulis buku",
  },
  tahunTerbit: {
    type: Number,
    required: true,
    description: "Tahun buku diterbitkan",
  },
  penerbit: {
    type: String,
    description: "Nama penerbit buku",
  },
  kategori: {
    type: String,
    description: "Kategori/genre buku",
  },
  deskripsi: {
    type: String,
    description: "Deskripsi singkat tentang buku",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

bookSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

bookSchema.index({}, { sparse: true, unique: false });

bookSchema.index(
  { isbn: 1 },
  {
    unique: true,
    sparse: true,
    partialFilterExpression: { isbn: { $exists: true } },
  }
);

export default mongoose.model<IBook>("Book", bookSchema);
