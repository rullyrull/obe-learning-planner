# Aplikasi Pembuat RPS Berbasis OBE

Aplikasi web untuk menyusun Rencana Pembelajaran Semester (RPS) dengan format keluaran identik dokumen contoh (Analisis Laporan Keuangan – Universitas Borneo Lestari), lengkap dengan pratinjau cetak, ekspor Word, dan cetak PDF.

## Alur pengguna

1. Buka aplikasi → langsung tersedia tombol **Muat Contoh RPS** yang mengisi seluruh formulir dengan data mata kuliah Analisis Laporan Keuangan.
2. Isi/ubah data melalui formulir bertahap (tab): Identitas → Capaian Pembelajaran → Penilaian → Deskripsi & Pustaka → Rencana Mingguan → Rencana Tugas → Penilaian Akhir → Rubrik.
3. Panel pratinjau menampilkan dokumen A4 secara langsung setiap kali data berubah.
4. Ekspor: tombol **Unduh Word (.docx)** dan **Cetak / Simpan PDF**.

## Bagian formulir

**1. Identitas & Otorisasi**
Kode MK, Nama MK, Rumpun MK, Bobot SKS, Semester, Tanggal Penyusunan, Pengembang RPS, Koordinator MK, Ketua Program Studi, nama Universitas/Fakultas/Prodi, dan unggah logo institusi.

**2. Capaian Pembelajaran**
Daftar CPL (kode + deskripsi), daftar CPMK, matriks centang CPL × CPMK, daftar Sub-CPMK, dan matriks centang Sub-CPMK × CPMK.

**3. Metode Penilaian**
Baris tetap (Tugas, Aktivitas Partisipatif/Case Method, Kuis, Team Based Project, UTS, UAS) dengan centang per CPMK.

**4. Deskripsi & Pustaka**
Deskripsi singkat MK, daftar Bahan Kajian bernomor, Pustaka Utama (U), Pendukung (P), Hasil Penelitian (R), Hasil PkM (C), Dosen Pengampu, MK Prasyarat.

**5. Rencana Mingguan (1–16)**
Per minggu: Sub-CPMK, Bahan Kajian, Bentuk & Metode Pembelajaran (dengan penanda PB/PT/BM, daring/luring), Estimasi Waktu (menit), Pengalaman Belajar, Media Pembelajaran, Indikator, Teknik & Kriteria Penilaian, Bobot %, Pustaka. Total bobot ditampilkan agar mudah dicek 100%.

**6. Bagian B – Rencana Tugas Mahasiswa**
Baris dinamis: Minggu ke-, Nama Tugas & Evaluasi, Kemampuan yang Diukur, Bentuk/Cara Pengerjaan, Luaran, Batas Waktu.

**7. Bagian C – Penilaian Akhir**
Tabel persentase elemen penilaian (tiga varian a/b/c seperti dokumen asli), tabel ketercapaian CPL–CPMK per minggu (Minggu, CPL, CPMK, Indikator, Bentuk, Bobot, Nilai, Ketercapaian) dengan total otomatis, dan skala Nilai Mata Kuliah A–E yang dapat diedit.

**8. Bagian D – Rubrik Penilaian Tugas**
Rubrik non-project: No, Aspek, Definisi, Indikator, Sub-Indikator, Skala 1–5 dengan rentang nilai. Termasuk keterangan skala 1–5 (0–20 … 81–100).

## Pratinjau cetak

- Halaman judul: judul RPS, logo, nama MK + SKS, prodi/fakultas/universitas.
- Kop institusi berulang di tiap bagian, tabel bergaris penuh, ukuran A4.
- Bagian A (identitas + capaian + penilaian + pustaka) portrait; tabel rencana mingguan landscape agar 9 kolom terbaca, seperti dokumen asli.
- Bagian B, C, D masing-masing dimulai di halaman baru.

## Ekspor

- **Word**: dibangun dengan library `docx` — heading, tabel bergaris, lebar kolom tetap, bagian landscape untuk rencana mingguan, logo disisipkan bila diunggah.
- **PDF**: cetak browser dengan CSS `@page` A4 (mingguan landscape), hanya area pratinjau yang tercetak.

## Data contoh

Preset lengkap dari dokumen contoh: 5 CPL, 5 CPMK, 8 Sub-CPMK beserta kedua matriks, deskripsi MK, 10 bahan kajian, seluruh pustaka U/P/R/C, 16 baris rencana mingguan, 10 baris rencana tugas, tiga tabel persentase, 16 baris ketercapaian CPL–CPMK, skala nilai A–E, dan rubrik penilaian.

## Catatan teknis

- Satu state RPS terpusat (React context + tipe TypeScript), disimpan otomatis ke penyimpanan browser agar tidak hilang saat refresh.
- Halaman utama `/` dengan tata letak dua panel: formulir (tab) di kiri, pratinjau di kanan; pada layar kecil berubah menjadi tab Formulir/Pratinjau.
- `docx` ditambahkan sebagai dependensi; ekspor berjalan sepenuhnya di sisi klien (tanpa backend).
- Logo diunggah dan dibaca sebagai data URL agar bisa dipakai di pratinjau, PDF, dan Word.
- Desain: nuansa akademik netral (biru tua/abu), tipografi serif untuk dokumen dan sans untuk antarmuka.
