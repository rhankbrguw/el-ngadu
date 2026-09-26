import api from "@/lib/api";
import axios from "axios";
import type { Report } from "@/types";

export const getReportService = async (): Promise<Report[]> => {
 try {
 const response = await api.get<Report[]>("/reports/generate");
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(
 error.response.data.error || "Gagal mengambil data laporan."
 );
 }
 throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};
