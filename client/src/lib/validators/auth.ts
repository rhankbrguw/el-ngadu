import { z } from "zod";
import { AUTH_MESSAGES } from "../constants/auth";

export const EMAIL_PROVIDER_REGEX = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|yahoo\.co\.id|outlook\.com|hotmail\.com|icloud\.com|live\.com)$/i;
export const NAME_REGEX = /^[a-zA-Z\s'-]{3,100}$/;
export const USERNAME_REGEX = /^[a-zA-Z0-9_][a-zA-Z0-9._]{2,19}$/;
export const PHONE_REGEX = /^(08|628|\+628|62)\d{8,14}$/;
export const NIK_REGEX = /^\d{16}$/;
export const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,32}$/;

export const emailValidator = z
  .string()
  .min(1, { message: "Email wajib diisi." })
  .email(AUTH_MESSAGES.EMAIL_INVALID)
  .regex(EMAIL_PROVIDER_REGEX, AUTH_MESSAGES.EMAIL_PROVIDER_INVALID);

export const phoneValidator = z
  .string()
  .regex(PHONE_REGEX, { message: AUTH_MESSAGES.PHONE_INVALID });

export const nameValidator = z
  .string()
  .min(3, { message: AUTH_MESSAGES.NAME_REQUIRED })
  .max(100, { message: "Nama lengkap maksimal 100 karakter." })
  .regex(NAME_REGEX, { message: AUTH_MESSAGES.NAME_INVALID });

export const usernameValidator = z
  .string()
  .min(3, { message: AUTH_MESSAGES.USERNAME_REQUIRED })
  .max(20, { message: "Username maksimal 20 karakter." })
  .regex(USERNAME_REGEX, { message: AUTH_MESSAGES.USERNAME_INVALID });

export const nikValidator = z
  .string()
  .regex(NIK_REGEX, { message: AUTH_MESSAGES.NIK_REQUIRED });

export const loginSchema = z.object({
  username: z.string().min(1, { message: AUTH_MESSAGES.USERNAME_REQUIRED }),
  password: z.string().min(1, { message: AUTH_MESSAGES.PASSWORD_REQUIRED }),
});

export const otpSchema = z.object({
  otpCode: z.string().length(6, { message: AUTH_MESSAGES.OTP_INVALID }).regex(/^\d+$/, { message: AUTH_MESSAGES.OTP_INVALID }),
});

export const registerSchema = z.object({
  nik: nikValidator,
  nama: nameValidator,
  username: usernameValidator,
  email: emailValidator,
  password: z.string().regex(PASSWORD_REGEX, { message: AUTH_MESSAGES.PASSWORD_INVALID }),
  telp: phoneValidator,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type OtpFormValues = z.infer<typeof otpSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginPayload = LoginFormValues;
export type RegisterPayload = RegisterFormValues;
