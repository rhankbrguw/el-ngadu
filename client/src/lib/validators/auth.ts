import { z } from "zod";
import { AUTH_MESSAGES } from "../constants/auth";

export const loginSchema = z.object({
 username: z
 .string()
 .min(1, { message: AUTH_MESSAGES.USERNAME_REQUIRED })
 .max(50, { message: "Username terlalu panjang." }),
 password: z
 .string()
 .min(1, { message: AUTH_MESSAGES.PASSWORD_REQUIRED })
 .min(6, { message: "Password minimal 6 karakter." }),
});

export const otpSchema = z.object({
 otpCode: z
 .string()
 .length(6, { message: "Kode OTP harus persis 6 digit." })
 .regex(/^\d+$/, { message: "Kode OTP hanya boleh berisi angka." }),
});

export const registerSchema = z.object({
 nik: z
 .string()
 .min(1, { message: "NIK wajib diisi" })
 .regex(/^\d{16}$/, { message: "NIK harus berupa 16 digit angka" }),
 nama: z
 .string()
 .min(3, { message: "Nama lengkap minimal 3 karakter" })
 .max(100, { message: "Nama lengkap maksimal 100 karakter" })
 .regex(/^[a-zA-Z\s]+$/, {
 message: "Nama lengkap hanya boleh mengandung huruf dan spasi",
 }),
 username: z
 .string()
 .min(5, { message: "Username minimal 5 karakter" })
 .max(20, { message: "Username maksimal 20 karakter" })
 .regex(/^[a-zA-Z0-9._]+$/, {
 message:
 "Username hanya boleh mengandung huruf, angka, titik, dan underscore",
 }),
 email: z
 .string()
 .email("Format email tidak valid")
 .regex(
 /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i,
 "Gunakan provider resmi (gmail, yahoo, outlook, hotmail, icloud)"
 ),
 password: z
 .string()
 .min(8, { message: "Password minimal 8 karakter" })
 .max(32, { message: "Password maksimal 32 karakter" })
 .regex(/^(?=.*[a-zA-Z])(?=.*\d).+$/, {
 message: "Password harus mengandung kombinasi huruf dan angka",
 }),
 telp: z
 .string()
 .regex(/^62\d{8,15}$/, {
 message: "Nomor telepon tidak valid (minimal 10 digit angka asli).",
 }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
