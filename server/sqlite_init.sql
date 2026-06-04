CREATE TABLE IF NOT EXISTS masyarakat (
  nik CHAR(16) PRIMARY KEY,
  nama VARCHAR(35) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telp VARCHAR(13) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS petugas (
  id_petugas INTEGER PRIMARY KEY AUTOINCREMENT,
  nama_petugas VARCHAR(35) NOT NULL,
  username VARCHAR(25) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  telp VARCHAR(13) NOT NULL,
  level VARCHAR(20) NOT NULL CHECK(level IN ('admin', 'petugas')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pengaduan (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nik_masyarakat CHAR(16) NOT NULL,
  judul VARCHAR(255) NOT NULL,
  isi TEXT NOT NULL,
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
  is_read BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin (Password: password123)
INSERT INTO petugas (nama_petugas, username, password, telp, level) 
VALUES ('Super Admin', 'admin', '$2y$12$zn6jUMecjOMiO8V8dFyPU.Ob45icHuaerruK4wHjLuG3WnTHu750a', '08123456789', 'admin');
