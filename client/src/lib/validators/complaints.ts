import { z } from "zod";

export const createComplaintSchema = z.object({
 judul: z.string().min(1, "Judul wajib diisi"),
 kategori: z.string().min(1, "Kategori wajib dipilih"),
 lokasi: z.string().min(1, "Lokasi wajib diisi"),
 isi: z.string().min(1, "Isi pengaduan wajib diisi"),
 foto_bukti: z.any().optional(),
});

export type CreateComplaintValues = z.infer<typeof createComplaintSchema>;
