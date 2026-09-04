import api from "@/lib/api";
import axios from "axios";
import type {
 Pengaduan,
 PengaduanDetail,
 PengaduanWithPelapor,
 PaginatedResponse,
 UserStats,
} from "@/types";

interface CreatePengaduanPayload {
  judul: string;
  isi: string;
  kategori: string;
  lokasi: string;
  kecamatan?: string;
  kelurahan?: string;
  tanggal_kejadian?: string;
  prioritas?: string;
  is_anonim?: boolean;
  foto_bukti?: File;
}

function buildComplaintFormData(payload: CreatePengaduanPayload): FormData {
  const fd = new FormData();
  const fields: [string, string | undefined][] = [
    ["judul", payload.judul], ["isi", payload.isi], ["kategori", payload.kategori],
    ["lokasi", payload.lokasi], ["kecamatan", payload.kecamatan], ["kelurahan", payload.kelurahan],
    ["tanggal_kejadian", payload.tanggal_kejadian], ["prioritas", payload.prioritas],
    ["is_anonim", payload.is_anonim ? "1" : undefined],
  ];
  fields.forEach(([k, v]) => v && fd.append(k, v));
  if (payload.foto_bukti) fd.append("foto_bukti", payload.foto_bukti);
  return fd;
}

export const createPengaduanService = async (payload: CreatePengaduanPayload) => {
  try {
    const response = await api.post("/complaints", buildComplaintFormData(payload), {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;

 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || "Gagal membuat pengaduan.");
 }
 throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};

export const getMyPengaduanService = async (
 page = 1,
 limit = 10
): Promise<PaginatedResponse<Pengaduan>> => {
 try {
 const response = await api.get<PaginatedResponse<Pengaduan>>(
 `/complaints/mine?page=${page}&limit=${limit}`
 );
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(
 error.response.data.error || "Gagal mengambil riwayat pengaduan."
 );
 }
 throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};

export interface ComplaintFilterParams {
  page?: number;
  limit?: number;
  status?: string;
  kecamatan?: string;
  q?: string;
}

export interface PaginatedComplaintsResponse extends PaginatedResponse<PengaduanWithPelapor> {
  available_kecamatan?: string[];
}

export const getAllPengaduanService = async (
  params: ComplaintFilterParams = {}
): Promise<PaginatedComplaintsResponse> => {
  const { page = 1, limit = 10, status, kecamatan, q } = params;
  const sp = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (status && status !== "all") sp.append("status", status);
  if (kecamatan && kecamatan !== "all") sp.append("kecamatan", kecamatan);
  if (q?.trim()) sp.append("q", q.trim());

  try {
    const response = await api.get<PaginatedComplaintsResponse>(`/complaints?${sp.toString()}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error || "Gagal mengambil semua pengaduan.");
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const getComplaintDetailService = async (id: string): Promise<PengaduanDetail> => {
  try {
    const response = await api.get<PengaduanDetail>(`/complaints?id=${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error || "Gagal mengambil detail pengaduan.");
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const updateStatusPengaduanService = async (id: string, status: string) => {
  try {
    const response = await api.patch(`/complaints?id=${id}`, { status });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error || "Gagal memperbarui status pengaduan.");
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const searchPengaduanService = async (
  query: string
): Promise<PengaduanWithPelapor[]> => {
  try {
    const response = await api.get<PengaduanWithPelapor[]>(`/complaints?q=${query}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Gagal mencari pengaduan.");
    }
    throw new Error("Terjadi kesalahan tidak dikenal saat mencari pengaduan.");
 }
};

export const getMyStatsService = async (): Promise<UserStats> => {
 try {
    const response = await api.get<UserStats>("/complaints/stats-mine");
    return response.data;
 } catch (error) {
    if (axios.isAxiosError(error) && error.response) throw new Error(error.response.data.error || "Gagal mengambil statistik pengaduan.");
    throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};
