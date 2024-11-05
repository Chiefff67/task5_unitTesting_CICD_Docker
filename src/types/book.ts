export interface IBook {
  judul: string;
  isbn?: string;
  penulis: string;
  tahunTerbit: number;
  penerbit?: string;
  kategori?: string;
  deskripsi?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
