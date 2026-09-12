# OBE Learning Planner

Buat aplikasi pembuat Rencana Pembelajaran Semester (RPS) berbasis OBE (Outcome-Based Education) dengan format keluaran yang identik dengan dokumen terlampir (SBSD25214_Analisa Laporan Keuangan.pdf). 

Fitur utama:
1. Formulir bertahap (wizard/tab) untuk mengisi:
   - Identitas Mata Kuliah & Otorisasi (Kode MK, Nama MK, Rumpun MK, Bobot SKS, Semester, Tanggal Penyusunan, Dosen Pengembang, Koordinator MK, Kaprodi, Universitas/Fakultas/Prodi + Upload Logo).
   - Capaian Pembelajaran: CPL Prodi, CPMK, matriks pemetaan CPL x CPMK (centang matriks), serta Sub-CPMK.
   - Metode Penilaian & Kaitannya dengan CPMK (Tugas, Case Method, Kuis, Team-Based Project, UTS, UAS).
   - Deskripsi MK, Bahan Kajian/Materi Pembelajaran, Daftar Pustaka (Utama & Pendukung), Dosen Pengampu & MK Prasyarat.
   - Rencana Pembelajaran Mingguan (Minggu 1-16): Sub-CPMK, Bahan Kajian, Bentuk/Metode Pembelajaran (PB, PT, BM), Estimasi Waktu, Pengalaman Belajar, Media, Penilaian (Kriteria & Indikator, Bobot %), Pustaka.
   - Bagian B: Rencana Tugas Mahasiswa (Minggu ke-, Nama Tugas, Sub-CPMK, Bentuk/Cara Pengerjaan, Luaran, Batas Waktu).
   - Bagian C & D: Penilaian Akhir (Tabel persentase CPL/CPMK, Skala Nilai A-E) dan Instrumen Rubrik Penilaian Tugas (skala 1-5 / kriteria).
2. Tampilan Pratinjau Dokumen Cetak (Live Print Preview):
   - Layout rapi dengan kop institusi/universitas, tabel garis border resmi, format halaman per bagian A, B, C, D seperti dokumen referensi.
3. Fitur Ekspor:
   - Ekspor ke Word (.docx) menggunakan library docx dengan formatting tabel dan heading yang rapi persis seperti dokumen asli.
   - Ekspor/Cetak ke PDF dengan format layout A4 siap cetak.
4. Muat Data Contoh (Preset):
   - Berikan tombol 'Muat Contoh RPS' berisi data lengkap dari file contoh (Analisis Laporan Keuangan - Universitas Borneo Lestari) agar pengguna dapat langsung melihat pratinjau dan menguji ekspor PDF serta Word.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/a6a99fe9-8dc5-4ac9-b29c-b11c01857d50).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
