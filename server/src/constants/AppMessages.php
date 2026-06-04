<?php

namespace Constants;

class AppMessages {
    public const ERR_VALIDATION_FAILED = 'Validasi gagal, mohon periksa kembali data Anda.';
    public const ERR_UNAUTHORIZED = 'Akses ditolak, Anda harus login.';
    public const ERR_FORBIDDEN = 'Anda tidak memiliki izin untuk melakukan aksi ini.';
    public const ERR_FILE_FORMAT = 'Format file tidak didukung. Hanya JPG, PNG, dan PDF yang diperbolehkan.';
    public const ERR_DB_SAVE = 'Gagal menyimpan data ke database.';
    
    public const SUCCESS_COMPLAINT_CREATED = 'Pengaduan berhasil dibuat.';
    public const SUCCESS_COMPLAINT_UPDATED = 'Pengaduan berhasil diperbarui.';
    public const SUCCESS_COMPLAINT_DELETED = 'Pengaduan berhasil dihapus.';
    
    // Notification & Email Constants
    public const NOTIF_COMPLAINT_NEW = 'Pengaduan baru "%s" kategori %s telah dibuat oleh %s.';
    public const EMAIL_TITLE_COMPLAINT_NEW = 'Pengaduan Baru Masuk';
    public const EMAIL_SUBJECT_COMPLAINT_NEW = 'Pengaduan Baru Masuk: %s';
    public const EMAIL_CONTENT_COMPLAINT_NEW = '<p>Halo <strong>Petugas/Admin</strong>,</p><p>Terdapat pengaduan masyarakat baru yang perlu ditinjau.</p><ul><li><strong>Judul:</strong> %s</li><li><strong>Kategori:</strong> %s</li><li><strong>Pelapor:</strong> %s</li></ul><p>Silakan segera proses dan tanggapi laporan ini melalui dashboard.</p>';
    public const EMAIL_BTN_VIEW_COMPLAINT = 'Lihat Pengaduan';

    public const NOTIF_COMPLAINT_STATUS_UPDATED = "Status laporan Anda #%d telah diubah menjadi '%s'.";
    public const EMAIL_TITLE_COMPLAINT_STATUS = 'Status Pengaduan Diperbarui';
    public const EMAIL_SUBJECT_COMPLAINT_STATUS = 'Status Pengaduan: %s';
    public const EMAIL_CONTENT_COMPLAINT_STATUS = '<p>Halo <strong>%s</strong>,</p><p>Status laporan pengaduan Anda dengan judul <strong>"%s"</strong> telah diperbarui menjadi <strong>%s</strong>.</p><p>Terima kasih telah menggunakan layanan El-Ngadu.</p>';

    public const ERR_DB_SAVE_RESPONSE = 'Gagal menyimpan tanggapan';
    public const NOTIF_RESPONSE_NEW = 'Petugas telah menanggapi laporan Anda #%d.';
    public const EMAIL_TITLE_RESPONSE_NEW = 'Tanggapan Baru dari Petugas';
    public const EMAIL_SUBJECT_RESPONSE_NEW = 'Tanggapan Laporan Anda';
    public const EMAIL_CONTENT_RESPONSE_NEW = '<p>Halo <strong>%s</strong>,</p><p>Laporan pengaduan Anda dengan judul <strong>"%s"</strong> baru saja mendapat tanggapan dari petugas.</p><p>Tanggapan: <br><i>"%s"</i></p><p>Terima kasih telah menggunakan layanan El-Ngadu.</p>';
    public const EMAIL_BTN_VIEW_RESPONSE = 'Lihat Tanggapan';

    public const NOTIF_WELCOME_MSG = 'Selamat datang di El-Ngadu! Akun Anda telah berhasil diverifikasi.';
    public const EMAIL_TITLE_WELCOME = 'Selamat Datang di El-Ngadu';
    public const EMAIL_SUBJECT_WELCOME = 'Akun Diverifikasi - El-Ngadu';
    public const EMAIL_CONTENT_WELCOME = '<p>Halo <strong>%s</strong>,</p><p>Selamat datang di aplikasi El-Ngadu. Akun Anda telah berhasil diverifikasi dan sekarang siap digunakan.</p>';
    
    public const NOTIF_WELCOME_OFFICER = 'Selamat datang! Akun Anda telah dibuat.';
    public const EMAIL_TITLE_WELCOME_OFFICER = 'Selamat Datang di El-Ngadu';
    public const EMAIL_SUBJECT_WELCOME_OFFICER = 'Akun Petugas Anda Telah Dibuat';
    public const EMAIL_CONTENT_WELCOME_OFFICER = '<p>Halo <strong>%s</strong>,</p><p>Akun petugas Anda telah berhasil dibuat. Berikut detail login Anda:</p><ul><li><strong>Username:</strong> %s</li><li><strong>Peran:</strong> %s</li></ul><p>Silakan login untuk mengakses dashboard.</p>';
    public const EMAIL_BTN_LOGIN = 'Login ke Dashboard';

    // Added for codebase wide string extraction rule
    public const ERR_ADMIN_DELETE_SELF = 'Admin tidak dapat menghapus akunnya sendiri';
    public const ERR_ID_REQUIRED = 'ID Petugas wajib disediakan';
    public const ERR_QUERY_REQUIRED = 'Query pencarian q dibutuhkan';
    public const ERR_NO_DATA_UPDATE = 'Tidak ada data yang dikirim untuk diperbarui';
    public const ERR_INVALID_CREDENTIALS = 'Kredensial tidak valid.';
    public const ERR_ACCOUNT_NOT_FOUND = 'Akun tidak ditemukan.';
    public const ERR_INVALID_OTP = 'Kode OTP salah atau sudah kedaluwarsa.';
    public const ERR_EMAIL_NOT_SET = 'Email belum diatur untuk akun ini. Tidak dapat mengirim OTP.';
    
    public const EMAIL_TITLE_OTP = 'Kode OTP Login Anda';
    public const EMAIL_SUBJECT_OTP = 'Kode OTP Login El-Ngadu';
    public const EMAIL_CONTENT_OTP = '<p>Halo <strong>%s</strong>,</p><p>Seseorang mencoba masuk ke akun Anda. Berikut adalah kode OTP Anda:</p><div style="text-align: center; margin: 30px 0;"><span style="background-color: #0f172a; color: #eab308; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 5px; display: inline-block;">%s</span></div><p>Kode ini hanya berlaku selama <strong>5 menit</strong>. Jangan berikan kode ini kepada siapapun.</p>';
}
