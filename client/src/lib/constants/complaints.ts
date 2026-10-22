export const PENGADUAN_STRINGS = {
 FORM_TITLE: "Buat Pengaduan Baru",
 FORM_DESCRIPTION:
 "Isi formulir di bawah ini dengan jelas dan lengkap untuk melaporkan kejadian.",
 SECTION_PRIMARY: "Informasi Pengaduan",
 SECTION_LOCATION: "Lokasi Kejadian",
 SECTION_META: "Waktu & Urgensi",
 SECTION_EVIDENCE: "Bukti Pendukung",
 LABEL_JUDUL: "Judul Pengaduan",
 PLACEHOLDER_JUDUL: "Cth: Jalan Berlubang di Jl. Sudirman",
 LABEL_KATEGORI: "Kategori Laporan",
 PLACEHOLDER_KATEGORI: "Pilih kategori",
 LABEL_LOKASI: "Lokasi Kejadian",
 PLACEHOLDER_LOKASI: "Cth: Jl. Sudirman Km 12",
 LABEL_PROVINSI: "Provinsi",
 PLACEHOLDER_PROVINSI: "Pilih provinsi",
 LABEL_KOTA: "Kabupaten / Kota",
 PLACEHOLDER_KOTA: "Pilih kota/kabupaten",
 LABEL_KECAMATAN: "Kecamatan",
 PLACEHOLDER_KECAMATAN: "Pilih kecamatan",
 LABEL_KELURAHAN: "Kelurahan / Desa",
 PLACEHOLDER_KELURAHAN: "Pilih kelurahan/desa",
 LABEL_DETAIL_LOKASI: "Detail Alamat / Patokan",
 PLACEHOLDER_DETAIL_LOKASI: "Cth: Depan Toko Berkah No. 12, RT 03/05",
 LABEL_TANGGAL_KEJADIAN: "Tanggal Kejadian",
 LABEL_PRIORITAS: "Tingkat Urgensi",
 LABEL_ANONIM: "Laporkan Sebagai Anonim",
 DESC_ANONIM: "Nama dan identitas Anda disamarkan untuk privasi",
 LABEL_TOGGLE_MANUAL: "Gunakan input manual wilayah",
 LABEL_ISI: "Detail Laporan",
 PLACEHOLDER_ISI: "Ceritakan kronologi atau detail masalahnya di sini...",
 LABEL_FOTO: "Foto Bukti (Opsional)",
 INFO_FOTO: "Maksimal ukuran file 5MB. Format: JPG, PNG.",
 BTN_SUBMIT: "Kirim Pengaduan",
 BTN_SUBMIT_LOADING: "Mengirim...",
 SUCCESS_CREATED: "Pengaduan berhasil dibuat!",
 ERROR_ONLY_MASYARAKAT: "Hanya masyarakat yang dapat membuat pengaduan.",
 FILTER_SEARCH_PLACEHOLDER: "Cari judul, lokasi, atau pelapor...",
 FILTER_ALL_STATUS: "Semua Status",
 FILTER_ALL_KECAMATAN: "Semua Wilayah",
 FILTER_RESET: "Reset",
};

export const KATEGORI_PENGADUAN = [
 "Infrastruktur",
 "Pelayanan Publik",
 "Kesehatan",
 "Keamanan & Ketertiban",
 "Lingkungan",
 "Lainnya"
];

export const PRIORITAS_PENGADUAN = [
  { value: "rendah", label: "Rendah" },
  { value: "sedang", label: "Sedang" },
  { value: "darurat", label: "Darurat" },
] as const;

export const CANNED_RESPONSES = [
  "Laporan telah diverifikasi dan diteruskan ke unit teknis lapangan terkait.",
  "Tim petugas lapangan sedang menuju lokasi untuk pemeriksaan dan penanganan.",
  "Tindak lanjut perbaikan telah selesai dilaksanakan dan kondisi telah normal kembali.",
  "Laporan memerlukan koordinasi lanjutan dengan dinas terkait.",
] as const;

export const COMPLAINT_TRACKING_STRINGS = {
  TITLE: "Lacak Status Pengaduan",
  SUBTITLE: "Periksa progres penanganan laporan Anda secara langsung tanpa perlu masuk ke akun.",
  INPUT_LABEL: "Nomor Tiket / ID Laporan",
  INPUT_PLACEHOLDER: "Cth: 14 atau #14",
  BTN_TRACK: "Lacak Laporan",
  BTN_TRACKING: "Melacak...",
  EMPTY_ERROR: "Silakan masukkan ID laporan yang valid.",
  NOT_FOUND: "Pengaduan dengan ID tersebut tidak ditemukan.",
  RESULT_TITLE: "Informasi Laporan",
  REPORTER_MASKED: "Pelapor",
  DATE_SUBMITTED: "Waktu Diajukan",
  CATEGORY: "Kategori",
  PRIORITY: "Tingkat Urgensi",
  LOCATION: "Wilayah Kejadian",
  OFFICER_REPLY: "Tanggapan Petugas",
  NO_REPLY_YET: "Petugas sedang meninjau dan mempersiapkan tindak lanjut.",
  BTN_DOWNLOAD_RECEIPT: "Unduh Tanda Terima (PDF)",
  RECEIPT_TITLE: "TANDA TERIMA PENGADUAN MASYARAKAT",
  RECEIPT_SUBTITLE: "SISTEM LAYANAN ASPIRASI DAN PENGADUAN EL-NGADU",
  RECEIPT_FOOTER: "Dokumen ini diterbitkan otomatis oleh Sistem Layanan El-Ngadu dan sah sebagai bukti pelaporan.",
} as const;

