import api from "@/lib/api";
import axios from "axios";

interface CreateResponsePayload {
  id_pengaduan: string;
  isi_tanggapan: string;
}

export const createResponseService = async (
  payload: CreateResponsePayload
) => {
  try {
    const response = await api.post("/responses", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Gagal mengirim tanggapan.");
    }
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};
