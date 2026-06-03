-- ============================================================
-- LAPOR.ID - Sistem Pengaduan Masyarakat
-- Database Initialization Script
-- ============================================================

CREATE DATABASE IF NOT EXISTS lapor_id CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE lapor_id;

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin') NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE: pengaduan
-- Kolom foto: menyimpan nama file yang diupload (nullable)
-- ============================================================
CREATE TABLE IF NOT EXISTS pengaduan (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  judul VARCHAR(500) NOT NULL,
  kategori ENUM('infrastruktur', 'lingkungan', 'keamanan', 'pelayanan_publik', 'sosial', 'lainnya') NOT NULL,
  isi TEXT NOT NULL,
  foto VARCHAR(500) NULL DEFAULT NULL,
  status ENUM('menunggu', 'diproses', 'selesai') NOT NULL DEFAULT 'menunggu',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SEED: Default Admin
-- Password: admin123 (bcrypt hash)
-- ============================================================
INSERT INTO users (username, password, role) VALUES
('admin', '$2b$10$89xbfj8fWPpKIHr6bPwwj.ngFaJEJPSrPgXFTdfprb9TdY1L8a6s2', 'admin');

-- ============================================================
-- SEED: Sample Pengaduan Data
-- ============================================================
INSERT INTO pengaduan (nama, email, judul, kategori, isi, foto, status) VALUES
('Budi Santoso', 'budi@email.com', 'Jalan Rusak di RT 05', 'infrastruktur', 'Jalan di wilayah RT 05 RW 02 Kelurahan Menteng sudah rusak parah selama 6 bulan. Banyak warga yang terpeleset dan kendaraan rusak akibat kondisi jalan yang berlubang. Mohon segera diperbaiki.', NULL, 'menunggu'),
('Siti Rahayu', 'siti@email.com', 'Sampah Menumpuk di TPS', 'lingkungan', 'Tempat pembuangan sampah sementara di Jl. Sudirman No. 12 sudah menumpuk selama 2 minggu dan tidak ada petugas yang mengangkut. Kondisi ini menimbulkan bau tidak sedap dan berpotensi menjadi sarang penyakit.', NULL, 'diproses'),
('Ahmad Fauzi', 'ahmad@email.com', 'Lampu Jalan Mati Sejak Sebulan', 'infrastruktur', 'Lampu penerangan jalan di Jl. Gatot Subroto sudah mati sejak sebulan lalu. Kondisi ini sangat membahayakan keselamatan warga terutama pada malam hari. Sudah dilaporkan ke RT namun belum ada tindakan.', NULL, 'selesai'),
('Dewi Lestari', 'dewi@email.com', 'Pungli di Pelayanan KTP', 'pelayanan_publik', 'Saya mengalami pungutan liar saat mengurus perpanjangan KTP di kelurahan. Petugas meminta uang tambahan di luar biaya resmi yang sudah ditetapkan. Mohon dilakukan penertiban terhadap oknum tersebut.', NULL, 'menunggu'),
('Rizky Pratama', 'rizky@email.com', 'Drainase Tersumbat Menyebabkan Banjir', 'lingkungan', 'Setiap hujan lebat, kawasan perumahan kami selalu banjir karena drainase tersumbat sampah. Sudah terjadi 3 kali dalam bulan ini. Ketinggian air bisa mencapai 50 cm dan merusak perabotan rumah warga.', NULL, 'diproses');
