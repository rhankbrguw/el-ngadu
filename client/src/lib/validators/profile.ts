import { z } from "zod";
import { emailValidator, phoneValidator, nameValidator, usernameValidator, PASSWORD_REGEX } from "./auth";

export const ChangePasswordSchema = z
  .object({
    old_password: z.string().min(1, { message: "Password lama wajib diisi." }),
    new_password: z
      .string()
      .min(8, { message: "Password baru minimal 8 karakter." })
      .regex(PASSWORD_REGEX, { message: "Password harus mengandung kombinasi huruf dan angka." }),
    confirm_password: z.string(),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirm_password"],
  });

export type ChangePasswordPayload = z.infer<typeof ChangePasswordSchema>;

export const MasyarakatEditSchema = z.object({
  nama: nameValidator,
  username: usernameValidator,
  email: emailValidator,
  telp: phoneValidator,
});

export type MasyarakatEditPayload = z.infer<typeof MasyarakatEditSchema>;

export const ProfileEditSchema = z.object({
  nama: nameValidator.optional(),
  nama_petugas: nameValidator.optional(),
  username: usernameValidator,
  email: emailValidator,
  telp: phoneValidator,
});

export type ProfileEditPayload = z.infer<typeof ProfileEditSchema>;

export const PetugasSchema = z.object({
  nama_petugas: nameValidator,
  username: usernameValidator,
  email: emailValidator,
  password: z
    .string()
    .min(8, { message: "Password minimal 8 karakter." })
    .regex(PASSWORD_REGEX, { message: "Password harus mengandung huruf dan angka." })
    .optional()
    .or(z.literal("")),
  telp: phoneValidator,
  level: z.enum(["admin", "petugas"], { required_error: "Level wajib dipilih." }),
});

export type PetugasPayload = z.infer<typeof PetugasSchema>;
