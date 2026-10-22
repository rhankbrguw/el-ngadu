import api from "@/lib/api";
import axios from "axios";

export const forgotPasswordService = async (email: string) => {
 try {
 const response = await api.post("/auth/forgot-password", { email });
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || "Gagal mengirim link reset.");
 }
 throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};

export const resetPasswordService = async (password: string, token: string) => {
 try {
 const response = await api.post("/auth/reset-password", { password, token });
 return response.data;
 } catch (error) {
 if (axios.isAxiosError(error) && error.response) {
 throw new Error(error.response.data.error || "Gagal mengatur ulang kata sandi.");
 }
 throw new Error("Terjadi kesalahan tidak dikenal.");
 }
};
