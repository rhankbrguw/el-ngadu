<?php
namespace Core;

class Messages {
    // Auth Messages
    const AUTH_LOGIN_SUCCESS = 'Login berhasil.';
    const AUTH_LOGIN_FAILED = 'Username atau password salah.';
    const AUTH_USER_NOT_FOUND = 'Akun tidak ditemukan.';
    const AUTH_MISSING_CREDENTIALS = 'Username dan password wajib diisi.';
    const AUTH_LOGOUT_SUCCESS = 'Logout berhasil.';
    const AUTH_UNAUTHORIZED = 'Sesi tidak valid atau telah berakhir.';
    const AUTH_CHANGE_PASSWORD_SUCCESS = 'Password berhasil diubah.';
    
    // Database Messages
    const DB_CONNECTION_FAILED = 'Koneksi database gagal.';
    const DB_QUERY_FAILED = 'Gagal mengeksekusi query.';
    
    // Generic
    const SUCCESS = 'Berhasil.';
    const ERROR_SERVER = 'Terjadi kesalahan pada server.';
    const ERROR_METHOD_NOT_ALLOWED = 'Metode tidak diizinkan.';
    const ERROR_NOT_FOUND = 'Endpoint atau data tidak ditemukan.';
    const ERROR_VALIDATION = 'Validasi gagal.';


    const ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_TINDAKA = 'Anda harus login untuk melakukan tindakan ini.';
    const ERR_PASSWORD_LAMA_DAN_BARU_WAJIB_DIISI = 'Password lama dan baru wajib diisi.';
    const ERR_PASSWORD_BARU_HARUS_MINIMAL_8_KARAKTER = 'Password baru harus minimal 8 karakter.';
    const ERR_ANDA_HARUS_LOGIN_UNTUK_MENGAKSES_SUMBER = 'Anda harus login untuk mengakses sumber daya ini.';
    const ERR_DATA_PENGGUNA_TIDAK_DITEMUKAN = 'Data pengguna tidak ditemukan.';
    const ERR_USERNAME_DAN_PASSWORD_WAJIB_DIISI = 'Username dan password wajib diisi.';
    const ERR_AKUN_TIDAK_DITEMUKAN = 'akun tidak ditemukan.';
    const ERR_TIPE_PENGGUNA_TIDAK_VALID = 'Tipe pengguna tidak valid.';
    const ERR_TIDAK_ADA_DATA_YANG_DIKIRIM_UNTUK_DIPERB = 'Tidak ada data yang dikirim untuk diperbarui.';
    const ERR_PENGGUNA_TIDAK_DITEMUKAN_ATAU_DATA_TIDAK = 'Pengguna tidak ditemukan atau data tidak berubah.';
    const ERR_USERNAME_SUDAH_DIGUNAKAN = 'Username sudah digunakan.';
    const ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEM = 'Akses ditolak. Hanya admin yang dapat membuat laporan.';
    const ERR_AKSES_DITOLAK = 'Akses ditolak.';
    const ERR_NIK_MASYARAKAT_WAJIB_ADA_DI_URL = 'NIK masyarakat wajib ada di URL.';
    const ERR_AKUN_MASYARAKAT_TIDAK_DITEMUKAN = 'Akun masyarakat tidak ditemukan.';
    const ERR_SEMUA_FIELD_WAJIB_DIISI = 'Semua field wajib diisi.';
    const ERR_NIK_ATAU_USERNAME_SUDAH_TERDAFTAR = 'NIK atau Username sudah terdaftar.';
    const ERR_QUERY_PENCARIAN_Q_DIBUTUHKAN = 'Query pencarian "q" dibutuhkan.';
    const ERR_MASYARAKAT_TIDAK_DITEMUKAN_ATAU_DATA_TID = 'Masyarakat tidak ditemukan atau data tidak berubah.';
    const ERR_AKSES_DITOLAK_ANDA_HARUS_LOGIN_SEBAGAI_M = 'Akses ditolak. Anda harus login sebagai masyarakat untuk melihat riwayat pengaduan.';
    const ERR_INPUT_TIDAK_VALID_JUDUL_DAN_ISI_WAJIB_DI = 'Input tidak valid. Judul dan isi wajib diisi.';
    const ERR_ID_PENGADUAN_WAJIB_DISEDIAKAN = 'ID pengaduan wajib disediakan';
    const ERR_PENGADUAN_TIDAK_DITEMUKAN = 'Pengaduan tidak ditemukan.';
    const ERR_ID_PENGADUAN_TIDAK_DISEDIAKAN = 'ID pengaduan tidak disediakan.';
    const ERR_ANDA_HARUS_LOGIN_UNTUK_MELAKUKAN_PENCARI = 'Anda harus login untuk melakukan pencarian.';
    const ERR_AKSES_DITOLAK_HANYA_PETUGAS_ATAU_ADMIN_Y = 'Akses ditolak. Hanya petugas atau admin yang dapat mengubah status.';
    const ERR_ID_PENGADUAN_WAJIB_ADA_DI_URL = 'ID Pengaduan wajib ada di URL.';
    const ERR_INPUT_TIDAK_VALID_STATUS_TIDAK_BOLEH_KOS = 'Input tidak valid. Status tidak boleh kosong.';
    const ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_DAPAT_MEL = 'Akses ditolak. Hanya admin yang dapat melakukan tindakan ini.';
    const ERR_INPUT_TIDAK_VALID_SEMUA_FIELD_WAJIB_DIIS = 'Input tidak valid. Semua field wajib diisi dan level harus "admin" atau "petugas".';
    const ERR_USERNAME_SUDAH_TERDAFTAR = 'Username sudah terdaftar.';
    const ERR_ID_PETUGAS_WAJIB_DISEDIAKAN = 'ID petugas wajib disediakan';
    const ERR_ADMIN_TIDAK_DAPAT_MENGHAPUS_AKUNNYA_SEND = 'Admin tidak dapat menghapus akunnya sendiri.';
    const ERR_PETUGAS_TIDAK_DITEMUKAN = 'Petugas tidak ditemukan';
    const ERR_PETUGAS_TIDAK_DITEMUKAN_ATAU_DATA_TIDAK = 'Petugas tidak ditemukan atau data tidak berubah';
    const ERR_AKSES_DITOLAK_HANYA_ADMIN_YANG_BISA_MENG = 'Akses ditolak. Hanya admin yang bisa mengakses statistik ini.';
    const ERR_INPUT_TIDAK_VALID = 'Input tidak valid.';
}
