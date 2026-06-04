import { z } from "zod";

const passwordValidation = new RegExp(/^(?=.*[a-zA-Z])(?=.*\d).+$/);

const emailProviderRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i;
const emailErrorMessage = "Gunakan provider resmi (gmail, yahoo, outlook, hotmail, icloud)";
export const emailValidator = z.string().email("Format email tidak valid").regex(emailProviderRegex, emailErrorMessage);

export const phoneValidator = z
 .string()
 .regex(/^62\d{8,15}$/, { message: "Nomor telepon tidak valid (minimal 10 digit angka asli)." });

export const ChangePasswordSchema = z
 .object({
 old_password: z.string().min(1, { message: "Password lama wajib diisi." }),
 new_password: z
 .string()
 .min(8, { message: "Password baru minimal 8 karakter." })
 .regex(passwordValidation, {
 message: "Password harus mengandung huruf dan angka.",
 }),
 confirm_password: z.string(),
 })
 .refine((data) => data.new_password === data.confirm_password, {
 message: "Konfirmasi password tidak cocok.",
 path: ["confirm_password"],
 });

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;

export const MasyarakatEditSchema = z.object({
 nama: z.string().min(3, { message: "Nama lengkap minimal 3 karakter." }),
 username: z.string().min(5, { message: "Username minimal 5 karakter." }),
 email: emailValidator,
 telp: phoneValidator,
});

export type MasyarakatEditPayload = z.infer<typeof MasyarakatEditSchema>;

export const ProfileEditSchema = z.object({
 nama: z
 .string()
 .min(3, { message: "Nama lengkap minimal 3 karakter." })
 .optional(),
 nama_petugas: z
 .string()
 .min(3, { message: "Nama petugas minimal 3 karakter." })
 .optional(),
 username: z.string().min(5, { message: "Username minimal 5 karakter." }),
 email: emailValidator,
 telp: phoneValidator,
});

export type ProfileEditPayload = z.infer<typeof ProfileEditSchema>;
