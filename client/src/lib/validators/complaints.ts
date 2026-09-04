import { z } from "zod";

export const createComplaintSchema = z.object({
  judul: z.string().min(1, "Judul wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  lokasi: z.string().min(1, "Detail lokasi wajib diisi"),
  kecamatan: z.string().optional(),
  kelurahan: z.string().optional(),
  tanggal_kejadian: z.string().optional(),
  prioritas: z.enum(["rendah", "sedang", "darurat"]),
  is_anonim: z.boolean(),
  isi: z.string().min(1, "Isi pengaduan wajib diisi"),
  foto_bukti: z.union([z.instanceof(File), z.string(), z.undefined()]).optional(),
});


export type CreateComplaintValues = z.infer<typeof createComplaintSchema>;
