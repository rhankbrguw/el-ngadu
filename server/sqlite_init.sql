CREATE TABLE IF NOT EXISTS masyarakat (
  nik CHAR(16) PRIMARY KEY,
  nama VARCHAR(35) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  telp VARCHAR(20) NOT NULL,
  otp_code VARCHAR(10),
  otp_expires_at TIMESTAMP,
  reset_token VARCHAR(100),
  reset_expires_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS petugas (
  id_petugas INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_petugas VARCHAR(35) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(100),
  telp VARCHAR(20) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK(level IN ('admin', 'petugas')),
  otp_code VARCHAR(10),
  otp_expires_at TIMESTAMP,
  reset_token VARCHAR(100),
  reset_expires_at TIMESTAMP,
  is_verified BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengaduan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nik_masyarakat CHAR(16) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
  kategori VARCHAR(50),
  lokasi VARCHAR(255),
  foto_bukti VARCHAR(255),
  status VARCHAR(20) NOT NULL DEFAULT 'diajukan',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (nik_masyarakat) REFERENCES masyarakat(nik) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tanggapan (
  id_tanggapan INTEGER PRIMARY KEY AUTOINCREMENT,
  id_pengaduan INTEGER NOT NULL,
  isi_tanggapan TEXT NOT NULL,
  id_petugas INTEGER NOT NULL,
  tgl_tanggapan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pengaduan) REFERENCES pengaduan(id) ON DELETE CASCADE,
  FOREIGN KEY (id_petugas) REFERENCES petugas(id_petugas) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id VARCHAR(16) NOT NULL, 
  user_type VARCHAR(20) NOT NULL,
  title VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  link_url VARCHAR(255),
  is_read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
