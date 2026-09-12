/**
 * String constants used in authentication forms.
 */
export const AUTH_STRINGS = {
 REGISTER_TITLE: "Buat Akun Baru",
 REGISTER_DESC: "Daftar untuk mulai membuat pengaduan.",
 NIK_LABEL: "NIK",
 NIK_PLACEHOLDER: "16 digit NIK",
 NAME_LABEL: "Nama Lengkap",
 NAME_PLACEHOLDER: "Nama sesuai KTP",
 USERNAME_LABEL: "Username",
 USERNAME_PLACEHOLDER: "Buat username unik",
 EMAIL_PLACEHOLDER: "nama@rhankbrguw.xyz",
 PASSWORD_LABEL: "Password",
 PASSWORD_PLACEHOLDER: "Minimal 8 karakter",
 TELP_LABEL: "Nomor Telepon",
 TELP_PLACEHOLDER: "081234567890",
 BTN_PROCESSING: "Memproses...",
 BTN_REGISTER: "Daftar",
 ALREADY_HAVE_ACCOUNT: "Sudah punya akun? ",
 LOGIN_LINK: "Masuk di sini",
 SUCCESS_TITLE: "Registrasi Berhasil!",
 SUCCESS_DESC: "Akun Anda telah berhasil diverifikasi. Mengalihkan ke dashboard...",
 CONTINUE_TO_DASHBOARD: "Masuk ke Dashboard",
 OTP_SENT_LABEL: "Kode OTP telah dikirim ke email Anda.",
 BTN_VERIFYING: "Memverifikasi...",
 BTN_VERIFY_OTP: "Verifikasi OTP",
} as const;

export const AUTH_MESSAGES = {
  USERNAME_REQUIRED: "Username tidak boleh kosong.",
  PASSWORD_REQUIRED: "Password tidak boleh kosong.",
  NIK_REQUIRED: "NIK wajib diisi 16 digit angka.",
  NAME_REQUIRED: "Nama lengkap wajib diisi.",
  NAME_INVALID: "Nama hanya boleh mengandung huruf, spasi, tanda petik, dan tanda hubung.",
  USERNAME_INVALID: "Username hanya boleh mengandung huruf, angka, titik, dan garis bawah (3-20 karakter).",
  EMAIL_INVALID: "Format email tidak valid.",
  EMAIL_PROVIDER_INVALID: "Gunakan provider resmi (gmail, yahoo, outlook, hotmail, icloud).",
  PHONE_INVALID: "Nomor telepon tidak valid (minimal 10-15 digit angka).",
  PASSWORD_INVALID: "Password harus minimal 8 karakter dengan kombinasi huruf dan angka.",
  OTP_INVALID: "Kode OTP harus persis 6 digit angka.",
} as const;
