export const PENGADUAN_STRINGS = {
 FORM_TITLE: "Buat Pengaduan Baru",
 FORM_DESCRIPTION:
 "Isi formulir di bawah ini dengan jelas dan lengkap untuk melaporkan kejadian.",
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
