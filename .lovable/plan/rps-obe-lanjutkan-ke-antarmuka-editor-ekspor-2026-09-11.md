# RPS OBE — Lanjutkan ke Antarmuka Editor & Ekspor

Tujuan: menghubungkan model data, preset, pratinjau, dan ekspor docx yang sudah ada menjadi satu aplikasi lengkap yang bisa langsung dipakai.

## 1. Tata Letak Utama

- Ganti placeholder di `src/routes/index.tsx` dengan halaman utama.
- Layout dua panel: formulir di kiri, pratinjau A4 di kanan.
- Pada layar kecil: tab beralih Formulir / Pratinjau.
- Header atas berisi judul, tombol **Muat Contoh RPS**, **Reset**, **Unduh Word**, dan **Cetak/Simpan PDF**.
- Bungkus halaman dengan `RpsProvider` agar state tersedia.

## 2. Komponen Formulir Bertahap

Buat tab yang masing-masing mengedit satu bagian RPS:

1. **Identitas**: input teks untuk kode MK, nama MK, rumpun, SKS, semester, tanggal, pengembang, koordinator, kaprodi, universitas, fakultas, prodi; upload logo institusi.
2. **Capaian Pembelajaran**: daftar CPL, CPMK, Sub-CPMK (tambah/hapus/ubah kode & deskripsi); matriks centang CPL×CPMK dan Sub-CPMK×CPMK.
3. **Metode Penilaian**: baris tetap metode penilaian dengan centang per CPMK.
4. **Deskripsi & Pustaka**: textarea deskripsi; daftar dinamis bahan kajian; grup pustaka Utama/Pendukung/Penelitian/PkM; dosen pengampu & prasyarat.
5. **Rencana Mingguan**: tabel 16 minggu dengan kolom Sub-CPMK, Bahan Kajian, Bentuk/Metode, Estimasi Waktu, Pengalaman Belajar, Media, Indikator, Teknik & Kriteria, Bobot %, Pustaka; tampilkan total bobot agar mudah dicek 100%.
6. **Rencana Tugas**: tabel dinamis Minggu, Nama Tugas, Kemampuan, Bentuk, Luaran, Batas Waktu.
7. **Penilaian Akhir**: tiga varian persentase penilaian; tabel ketercapaian CPL–CPMK per minggu; skala nilai A–E.
8. **Rubrik**: rubrik penilaian tugas non-project dengan aspek, definisi, indikator, sub-indikator, rentang nilai 1–5.

Setiap tab menyimpan perubahan langsung ke state pusat sehingga pratinjau A4 di panel kanan otomatis terupdate.

## 3. Ekspor

- **Unduh Word (.docx)**: gunakan `downloadRpsDocx` dari `src/lib/rps/docx-export.ts`.
- **Cetak / Simpan PDF**: tombol memanggil `window.print()` dan CSS cetak `@page` A4 (portrait/landscape) yang sudah ada akan mengatur output.

## 4. Penyesuaian & Penyempurnaan

- Pastikan semua tombol dan input memiliki label yang jelas.
- Tambahkan helper teks di tempat yang membutuhkan penjelasan (misal bobot total harus 100%).
- Update metadata `head()` di `src/routes/index.tsx` dengan judul dan deskripsi aplikasi RPS.
- Pastikan build lolos typecheck tanpa error.

## 5. QA

- Muat contoh RPS, verifikasi pratinjau A4 terisi lengkap.
- Cek ekspor .docx dapat dibuka dan tabel terlihat rapi.
- Cek tampilan cetak/PDF menggunakan preview browser print-to-PDF.
- Uji responsif pada lebar layar kecil (tab Formulir/Pratinjau).
