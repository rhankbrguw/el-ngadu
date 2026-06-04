import api from "@/lib/api";
import axios from "axios";
import type { Petugas, PaginatedResponse } from "@/types";
import type { PetugasPayload } from "@/lib/validators";

export const getPetugasService = async (
  page = 1,
  limit = 10
): Promise<PaginatedResponse<Petugas>> => {
  try {
    const response = await api.get<PaginatedResponse<Petugas>>(
      `/officers?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Gagal mengambil data petugas."
      );
    }
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const createPetugasService = async (payload: PetugasPayload) => {
  try {
    const response = await api.post("/officers", payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Gagal membuat akun petugas."
      );
    }
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const updatePetugasService = async (
  id: number,
  payload: PetugasPayload
) => {
  try {
    const response = await api.patch(`/officers?id=${id}`, payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Gagal memperbarui akun petugas."
      );
    }
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const deletePetugasService = async (id: number) => {
  try {
    const response = await api.delete(`/officers?id=${id}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(
        error.response.data.error || "Gagal menghapus akun petugas."
      );
    }
    throw new Error("Terjadi kesalahan tidak dikenal.");
  }
};

export const searchPetugasService = async (
  query: string
): Promise<Petugas[]> => {
  try {
    const response = await api.get<Petugas[]>(`/officers/search?q=${query}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error || "Gagal mencari petugas.");
    }
    throw new Error("Terjadi kesalahan tidak dikenal saat mencari petugas.");
  }
};
