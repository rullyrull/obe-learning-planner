import type {
  AchievementRow,
  Coded,
  Matrix,
  RpsData,
  TaskRow,
  WeekRow,
} from "./types";
import { matrixKey, uid } from "./types";

const coded = (kode: string, deskripsi: string): Coded => ({ id: uid(), kode, deskripsi });

const cpl: Coded[] = [
  coded(
    "CPL-04",
    "Mampu menerapkan pemikiran logis, kritis, sistematis, inovatif dan nilai humaniora dalam mengambil keputusan secara tepat dalam konteks penyelesaian masalah di bidang keahliannya, berdasarkan hasil analisis informasi dan data serta mampu memelihara dan mengembangkan jaringan kerja dengan pembimbing, kolega, sejawat baik di dalam maupun di luar lembaganya.",
  ),
  coded(
    "CPL-05",
    "Mampu mengombinasikan informasi yang bersumber dari internal maupun eksternal bisnis dalam merumuskan keputusan strategis dengan dukungan teknologi guna mencapai visi dan keberlangsungan organisasi.",
  ),
  coded(
    "CPL-06",
    "Mampu bertindak bijaksana dalam pengambilan keputusan manajerial dengan memerhatikan etika bisnis dan tanggung jawab sosial guna mencapai visi dan keberlangsungan organisasi.",
  ),
  coded(
    "CPL-07",
    "Mampu menyelesaikan masalah teknis maupun strategis berdasarkan analisis data yang relevan, budaya organisasi, dan pemanfaatan teknologi guna mencapai visi dan keberlangsungan organisasi.",
  ),
  coded(
    "CPL-08",
    "Mampu mengelola bisnis yang adaptif, sustainable, dan memiliki nilai tambah bagi bisnis, sosial, dan lingkungan.",
  ),
];

const cpmk: Coded[] = [
  coded(
    "CPMK-01",
    "Menjelaskan konsep, tujuan, dan pengguna analisis laporan keuangan dalam pengambilan keputusan bisnis.",
  ),
  coded(
    "CPMK-02",
    "Mengolah dan menilai kinerja keuangan perusahaan menggunakan teknik analisis laporan keuangan.",
  ),
  coded(
    "CPMK-03",
    "Menginterpretasikan hasil analisis laporan keuangan untuk menilai kinerja dan kondisi bisnis.",
  ),
  coded(
    "CPMK-04",
    "Menggunakan data laporan keuangan untuk menyusun rekomendasi keputusan bisnis.",
  ),
  coded("CPMK-05", "Menyusun laporan analisis kinerja keuangan perusahaan secara sistematis."),
];

const subCpmk: Coded[] = [
  coded(
    "Sub CPMK-01",
    "Menjelaskan konsep analisis laporan keuangan, tujuan, dan perannya dalam pengambilan keputusan bisnis.",
  ),
  coded(
    "Sub CPMK-02",
    "Menjelaskan struktur laporan keuangan dan karakteristik informasi keuangan yang relevan bagi analisis bisnis.",
  ),
  coded(
    "Sub CPMK-03",
    "Menerapkan teknik analisis horizontal dan vertikal untuk mengevaluasi perubahan dan struktur laporan keuangan.",
  ),
  coded(
    "Sub CPMK-04",
    "Menghitung dan menjelaskan rasio likuiditas dan solvabilitas untuk menilai kondisi keuangan perusahaan.",
  ),
  coded(
    "Sub CPMK-05",
    "Menghitung dan menjelaskan rasio profitabilitas dan aktivitas untuk menilai kinerja operasional perusahaan.",
  ),
  coded(
    "Sub CPMK-06",
    "Menganalisis tren kinerja keuangan perusahaan menggunakan data laporan keuangan beberapa periode.",
  ),
  coded(
    "Sub CPMK-07",
    "Menginterpretasikan hasil analisis laporan keuangan untuk menilai kondisi dan risiko bisnis perusahaan.",
  ),
  coded(
    "Sub CPMK-08",
    "Menyusun laporan analisis kinerja keuangan perusahaan sebagai dasar rekomendasi keputusan bisnis.",
  ),
];

const buildMatrix = (map: Record<string, string[]>): Matrix => {
  const out: Matrix = {};
  for (const [row, cols] of Object.entries(map)) {
    for (const col of cols) out[matrixKey(row, col)] = true;
  }
  return out;
};

const cplCpmk = buildMatrix({
  "CPL-04": ["CPMK-01", "CPMK-02", "CPMK-03", "CPMK-04", "CPMK-05"],
  "CPL-05": ["CPMK-01", "CPMK-02", "CPMK-03", "CPMK-04", "CPMK-05"],
  "CPL-06": ["CPMK-01", "CPMK-03", "CPMK-04", "CPMK-05"],
  "CPL-07": ["CPMK-01", "CPMK-02", "CPMK-03", "CPMK-04", "CPMK-05"],
  "CPL-08": ["CPMK-02", "CPMK-03", "CPMK-04", "CPMK-05"],
});

const subCpmkCpmk = buildMatrix({
  "Sub CPMK-01": ["CPMK-01"],
  "Sub CPMK-02": ["CPMK-01"],
  "Sub CPMK-03": ["CPMK-02"],
  "Sub CPMK-04": ["CPMK-02", "CPMK-03"],
  "Sub CPMK-05": ["CPMK-02", "CPMK-03"],
  "Sub CPMK-06": ["CPMK-02", "CPMK-03"],
  "Sub CPMK-07": ["CPMK-03", "CPMK-04"],
  "Sub CPMK-08": ["CPMK-04", "CPMK-05"],
});

export const METODE_PENILAIAN = [
  "Tugas",
  "Aktivitas Partisipatif/ Case Method (CBR, CJR)",
  "Kuis",
  "Hasil Project/Team Based Project (Projek, Mini Riset dan RI)",
  "UTS",
  "UAS",
];

const metodeCpmk = buildMatrix({
  Tugas: ["CPMK-01", "CPMK-02", "CPMK-03", "CPMK-04"],
  Kuis: ["CPMK-01", "CPMK-02"],
  "Hasil Project/Team Based Project (Projek, Mini Riset dan RI)": ["CPMK-04", "CPMK-05"],
  UTS: ["CPMK-02"],
  UAS: ["CPMK-03", "CPMK-04"],
});

type WeekSeed = [
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
  string,
];

const weekSeeds: WeekSeed[] = [
  [
    "Sub CPMK-01: Menjelaskan konsep analisis laporan keuangan, tujuan, dan perannya dalam pengambilan keputusan bisnis.",
    "Konsep laporan keuangan, tujuan analisis, pengguna laporan keuangan",
    "Bentuk: Luring\nMetode: Diskusi, Ceramah interaktif",
    "170",
    "Diskusi kasus penggunaan laporan keuangan.",
    "PPT, Video, e-learning",
    "Menjelaskan fungsi laporan keuangan.",
    "Teknik: Observasi, Tes Lisan\nKriteria: Ketepatan penjelasan konsep.",
    "3",
    "Utama: U1, U2\nPendukung: P2",
  ],
  [
    "Sub CPMK-01: Menjelaskan tujuan analisis laporan keuangan bagi pengguna laporan.",
    "Peran laporan keuangan bagi manajemen, investor, dan kreditor",
    "Bentuk: Luring\nMetode: Diskusi, Penugasan",
    "170",
    "Analisis studi kasus perusahaan digital.",
    "PPT, Modul, e-learning",
    "Ketepatan menjelaskan peran laporan keuangan bagi tiap pengguna.",
    "Teknik: Penilaian tugas\nKriteria: Kelengkapan dan ketajaman analisis.",
    "3",
    "Utama: U1\nPendukung: P1",
  ],
  [
    "Sub CPMK-02: Mengidentifikasi komponen laporan keuangan.",
    "Komponen laporan keuangan: neraca, laba rugi, arus kas, perubahan ekuitas",
    "Bentuk: Luring\nMetode: Ceramah, Latihan soal",
    "170",
    "Latihan mengidentifikasi pos-pos laporan keuangan.",
    "PPT, Modul, e-learning",
    "Ketepatan mengidentifikasi komponen laporan keuangan.",
    "Teknik: Kuis\nKriteria: Ketepatan jawaban.",
    "3",
    "Utama: U1, U2",
  ],
  [
    "Sub CPMK-02: Menjelaskan karakteristik informasi keuangan yang relevan.",
    "Karakteristik kualitatif informasi keuangan",
    "Bentuk: Luring\nMetode: Diskusi, Penugasan",
    "170",
    "Telaah laporan tahunan perusahaan terbuka.",
    "PPT, Modul, e-learning",
    "Ketepatan menjelaskan karakteristik informasi keuangan yang relevan.",
    "Teknik: Kuis, Penilaian tugas\nKriteria: Ketepatan dan kelengkapan.",
    "3",
    "Utama: U2\nPendukung: P1",
  ],
  [
    "Sub CPMK-03: Menerapkan teknik analisis horizontal laporan keuangan.",
    "Teknik analisis laporan keuangan dan analisis horizontal",
    "Bentuk: Luring\nMetode: Praktik, Latihan soal",
    "170",
    "Menghitung perubahan antar periode laporan keuangan.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan perhitungan analisis horizontal.",
    "Teknik: Unjuk kerja\nKriteria: Akurasi perhitungan dan interpretasi.",
    "3",
    "Utama: U1\nPendukung: P2",
  ],
  [
    "Sub CPMK-03: Menerapkan analisis vertikal (common size) secara tepat.",
    "Analisis vertikal / common size statement",
    "Bentuk: Luring\nMetode: Praktik, Diskusi",
    "170",
    "Menyusun laporan common size perusahaan.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan penyusunan laporan common size.",
    "Teknik: Unjuk kerja\nKriteria: Akurasi dan kerapian penyajian.",
    "3",
    "Utama: U1, U2",
  ],
  [
    "Sub CPMK-04: Menghitung dan menjelaskan rasio likuiditas dan solvabilitas.",
    "Rasio keuangan: likuiditas dan solvabilitas",
    "Bentuk: Luring\nMetode: Praktik, Latihan soal",
    "170",
    "Menghitung rasio likuiditas dan solvabilitas perusahaan.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan perhitungan dan penjelasan makna rasio.",
    "Teknik: Kuis, Penilaian tugas\nKriteria: Akurasi perhitungan dan ketepatan interpretasi.",
    "4",
    "Utama: U1\nPendukung: P2",
  ],
  [
    "Sub CPMK-01 s.d. Sub CPMK-04: Ujian Tengah Semester.",
    "Materi minggu 1–7",
    "Bentuk: Luring\nMetode: Ujian tertulis berbasis studi kasus",
    "170",
    "Evaluasi tengah semester.",
    "Lembar ujian",
    "Ketepatan jawaban dan kelengkapan analisis.",
    "Teknik: Tes tertulis\nKriteria: Ketepatan jawaban.",
    "20",
    "Utama: U1, U2\nPendukung: P1, P2",
  ],
  [
    "Sub CPMK-05: Menghitung rasio profitabilitas secara tepat.",
    "Rasio profitabilitas",
    "Bentuk: Luring\nMetode: Praktik, Diskusi",
    "170",
    "Menghitung dan menafsirkan rasio profitabilitas.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan perhitungan rasio profitabilitas.",
    "Teknik: Unjuk kerja\nKriteria: Akurasi perhitungan.",
    "5",
    "Utama: U1\nPendukung: P2",
  ],
  [
    "Sub CPMK-05: Menghitung rasio aktivitas dan menjelaskan maknanya.",
    "Rasio aktivitas dan efisiensi operasional",
    "Bentuk: Luring\nMetode: Praktik, Penugasan",
    "170",
    "Menghitung rasio aktivitas dan menyusun laporan singkat.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan perhitungan dan interpretasi rasio aktivitas.",
    "Teknik: Penilaian tugas\nKriteria: Akurasi dan kejelasan interpretasi.",
    "5",
    "Utama: U1, U2",
  ],
  [
    "Sub CPMK-06: Menganalisis tren kinerja keuangan perusahaan.",
    "Analisis tren beberapa periode",
    "Bentuk: Luring\nMetode: Praktik, Diskusi",
    "170",
    "Membandingkan laporan keuangan minimal tiga periode.",
    "PPT, Spreadsheet, e-learning",
    "Ketepatan analisis tren kinerja keuangan.",
    "Teknik: Penilaian tugas\nKriteria: Ketajaman analisis tren.",
    "5",
    "Utama: U1\nPengintegrasian Hasil Penelitian: R1",
  ],
  [
    "Sub CPMK-06: Menjelaskan hasil analisis tren laporan keuangan.",
    "Interpretasi hasil analisis tren",
    "Bentuk: Luring\nMetode: Diskusi, Latihan soal",
    "170",
    "Presentasi singkat hasil analisis tren.",
    "PPT, e-learning",
    "Ketepatan penjelasan hasil analisis tren.",
    "Teknik: Kuis\nKriteria: Ketepatan jawaban.",
    "5",
    "Utama: U2\nPengintegrasian Hasil Penelitian: R2",
  ],
  [
    "Sub CPMK-07: Menginterpretasikan rasio keuangan untuk menilai kondisi bisnis.",
    "Interpretasi rasio keuangan dan evaluasi bisnis",
    "Bentuk: Luring\nMetode: Case method, Diskusi",
    "170",
    "Diskusi kasus kondisi keuangan perusahaan.",
    "PPT, Studi kasus, e-learning",
    "Ketepatan interpretasi rasio terhadap kondisi bisnis.",
    "Teknik: Penilaian tugas\nKriteria: Ketajaman interpretasi.",
    "5",
    "Utama: U1\nPendukung: P2\nPengintegrasian Hasil Penelitian: R1",
  ],
  [
    "Sub CPMK-07: Mengevaluasi kondisi dan risiko bisnis berdasarkan analisis laporan keuangan.",
    "Evaluasi bisnis dan identifikasi risiko",
    "Bentuk: Luring\nMetode: Case method, Diskusi kelompok",
    "170",
    "Mengidentifikasi risiko bisnis dari hasil analisis rasio.",
    "PPT, Studi kasus, e-learning",
    "Ketepatan evaluasi kondisi dan risiko bisnis.",
    "Teknik: Observasi diskusi\nKriteria: Kualitas argumentasi.",
    "5",
    "Utama: U2\nPendukung: P1\nHasil PkM: C1",
  ],
  [
    "Sub CPMK-08: Menyusun laporan analisis keuangan dan rekomendasi keputusan bisnis.",
    "Laporan analisis keuangan dan rekomendasi bisnis",
    "Bentuk: Luring\nMetode: Team based project, Presentasi",
    "170",
    "Menyusun dan mempresentasikan laporan analisis kelompok.",
    "PPT, Spreadsheet, e-learning",
    "Kelengkapan laporan dan ketepatan rekomendasi.",
    "Teknik: Penilaian proyek dan presentasi\nKriteria: Sistematika, akurasi, dan kualitas rekomendasi.",
    "8",
    "Utama: U1, U2\nPendukung: P1, P2\nHasil PkM: C1, C2",
  ],
  [
    "Sub CPMK-01 s.d. Sub CPMK-08: Ujian Akhir Semester.",
    "Materi minggu 1–15",
    "Bentuk: Luring\nMetode: Ujian tertulis komprehensif",
    "170",
    "Evaluasi akhir.",
    "Lembar ujian",
    "Ketepatan jawaban.",
    "Teknik: Tes tertulis\nKriteria: Ketepatan jawaban.",
    "20",
    "Utama: U1, U2\nPendukung: P1, P2\nPengintegrasian Hasil Penelitian: R1, R2\nHasil PkM: C1, C2",
  ],
];

const weeks: WeekRow[] = weekSeeds.map((seed, i) => ({
  id: uid(),
  minggu: String(i + 1),
  subCpmk: seed[0],
  bahanKajian: seed[1],
  bentukMetode: seed[2],
  estimasiWaktu: seed[3],
  pengalamanBelajar: seed[4],
  media: seed[5],
  indikator: seed[6],
  teknikKriteria: seed[7],
  bobot: seed[8],
  pustaka: seed[9],
}));

const taskSeeds: Array<Omit<TaskRow, "id">> = [
  {
    minggu: "2",
    namaTugas: "Tugas 1 – Analisis Peran Laporan Keuangan dalam Bisnis",
    kemampuan:
      "Menjelaskan konsep analisis laporan keuangan, tujuan, dan perannya dalam pengambilan keputusan bisnis (Sub-CPMK 1)",
    bentuk:
      "Tugas individu; mahasiswa menganalisis studi kasus perusahaan digital dan menjelaskan bagaimana laporan keuangan digunakan dalam pengambilan keputusan bisnis.",
    luaran: "Esai analitis (2–3 halaman)",
    batasWaktu: "Akhir minggu ke-2",
  },
  {
    minggu: "4",
    namaTugas: "Tugas 2 – Identifikasi dan Analisis Komponen Laporan Keuangan",
    kemampuan:
      "Menjelaskan struktur laporan keuangan dan karakteristik informasi keuangan yang relevan bagi analisis bisnis (Sub-CPMK 2)",
    bentuk:
      "Tugas individu; mahasiswa mengidentifikasi komponen laporan keuangan dari laporan tahunan perusahaan dan menjelaskan fungsi setiap komponen.",
    luaran: "Lembar kerja identifikasi laporan keuangan",
    batasWaktu: "Akhir minggu ke-4",
  },
  {
    minggu: "6",
    namaTugas: "Tugas 3 – Analisis Horizontal dan Vertikal",
    kemampuan:
      "Menerapkan teknik analisis horizontal dan vertikal untuk mengevaluasi perubahan dan struktur laporan keuangan (Sub-CPMK 3)",
    bentuk:
      "Tugas praktik individu; mahasiswa menghitung perubahan laporan keuangan antar periode dan menyusun laporan common size menggunakan data perusahaan.",
    luaran: "File analisis horizontal & vertikal (format tabel/Excel)",
    batasWaktu: "Akhir minggu ke-6",
  },
  {
    minggu: "7",
    namaTugas: "Tugas 4 – Perhitungan Rasio Likuiditas dan Solvabilitas",
    kemampuan:
      "Menghitung dan menjelaskan rasio likuiditas dan solvabilitas untuk menilai kondisi keuangan perusahaan (Sub-CPMK 4)",
    bentuk:
      "Tugas individu; mahasiswa menghitung rasio likuiditas dan solvabilitas dari laporan keuangan perusahaan dan menjelaskan maknanya.",
    luaran: "Laporan analisis rasio (2–3 halaman)",
    batasWaktu: "Akhir minggu ke-7",
  },
  {
    minggu: "8",
    namaTugas: "Ujian Tengah Semester",
    kemampuan: "Sub-CPMK 1–4",
    bentuk: "Ujian tertulis berbasis studi kasus analisis laporan keuangan.",
    luaran: "Lembar jawaban ujian",
    batasWaktu: "Sesuai jadwal UTS",
  },
  {
    minggu: "10",
    namaTugas: "Tugas 5 – Analisis Rasio Profitabilitas dan Aktivitas",
    kemampuan:
      "Menghitung dan menjelaskan rasio profitabilitas dan aktivitas untuk menilai kinerja operasional perusahaan (Sub-CPMK 5)",
    bentuk:
      "Tugas individu; mahasiswa menghitung rasio profitabilitas dan aktivitas dari laporan keuangan dan menginterpretasikan hasilnya.",
    luaran: "Laporan analisis rasio (2–3 halaman)",
    batasWaktu: "Akhir minggu ke-10",
  },
  {
    minggu: "12",
    namaTugas: "Tugas 6 – Analisis Tren Kinerja Keuangan",
    kemampuan:
      "Menganalisis tren kinerja keuangan perusahaan menggunakan data laporan keuangan beberapa periode (Sub-CPMK 6)",
    bentuk:
      "Tugas individu; mahasiswa membandingkan laporan keuangan minimal tiga periode untuk melihat tren kinerja perusahaan.",
    luaran: "Laporan analisis tren (2–3 halaman)",
    batasWaktu: "Akhir minggu ke-12",
  },
  {
    minggu: "14",
    namaTugas: "Tugas 7 – Interpretasi Kinerja dan Risiko Bisnis",
    kemampuan:
      "Menginterpretasikan hasil analisis laporan keuangan untuk menilai kondisi dan risiko bisnis perusahaan (Sub-CPMK 7)",
    bentuk:
      "Tugas individu; mahasiswa menganalisis kondisi keuangan perusahaan dan mengidentifikasi potensi risiko bisnis berdasarkan hasil analisis rasio.",
    luaran: "Laporan interpretasi kinerja keuangan (3–4 halaman)",
    batasWaktu: "Akhir minggu ke-14",
  },
  {
    minggu: "15",
    namaTugas: "Tugas 8 – Proyek Analisis Laporan Keuangan Perusahaan",
    kemampuan:
      "Menyusun laporan analisis kinerja keuangan perusahaan sebagai dasar rekomendasi keputusan bisnis (Sub-CPMK 8)",
    bentuk:
      "Tugas kelompok; mahasiswa menganalisis laporan keuangan perusahaan (minimal 3 tahun) dan menyusun rekomendasi keputusan bisnis.",
    luaran: "Laporan analisis komprehensif (4–6 halaman) + presentasi",
    batasWaktu: "Akhir minggu ke-15",
  },
  {
    minggu: "16",
    namaTugas: "Ujian Akhir Semester",
    kemampuan: "Sub-CPMK 1–8",
    bentuk: "Ujian tertulis komprehensif berbasis studi kasus analisis laporan keuangan.",
    luaran: "Lembar jawaban ujian",
    batasWaktu: "Sesuai jadwal UAS",
  },
];

const achievementSeeds: Array<Omit<AchievementRow, "id" | "nilai" | "ketercapaian">> = [
  {
    minggu: "1",
    cpl: "CPL-04",
    cpmk: "CPMK-1",
    indikator:
      "Mahasiswa mampu menjelaskan konsep analisis laporan keuangan dan perannya dalam pengambilan keputusan bisnis",
    bentuk: "Partisipasi diskusi",
    bobot: "3",
  },
  {
    minggu: "2",
    cpl: "CPL-04",
    cpmk: "CPMK-1",
    indikator: "Mahasiswa mampu menjelaskan tujuan analisis laporan keuangan bagi pengguna laporan",
    bentuk: "Tugas individu",
    bobot: "3",
  },
  {
    minggu: "3",
    cpl: "CPL-04",
    cpmk: "CPMK-1",
    indikator: "Mahasiswa mampu mengidentifikasi komponen laporan keuangan secara tepat",
    bentuk: "Quiz",
    bobot: "3",
  },
  {
    minggu: "4",
    cpl: "CPL-04",
    cpmk: "CPMK-1",
    indikator: "Mahasiswa mampu menjelaskan karakteristik informasi keuangan yang relevan",
    bentuk: "Quiz",
    bobot: "3",
  },
  {
    minggu: "5",
    cpl: "CPL-07",
    cpmk: "CPMK-2",
    indikator: "Mahasiswa mampu menerapkan analisis horizontal laporan keuangan",
    bentuk: "Tugas praktik",
    bobot: "3",
  },
  {
    minggu: "6",
    cpl: "CPL-07",
    cpmk: "CPMK-2",
    indikator: "Mahasiswa mampu menerapkan analisis vertikal (common size) secara tepat",
    bentuk: "Tugas praktik",
    bobot: "3",
  },
  {
    minggu: "7",
    cpl: "CPL-07",
    cpmk: "CPMK-2",
    indikator: "Mahasiswa mampu menghitung rasio likuiditas dan solvabilitas secara benar",
    bentuk: "Quiz",
    bobot: "4",
  },
  {
    minggu: "8",
    cpl: "CPL-04, CPL-07",
    cpmk: "CPMK-1 & CPMK-2",
    indikator:
      "Mahasiswa mampu menjelaskan dan menerapkan konsep analisis laporan keuangan secara komprehensif",
    bentuk: "UTS (Ujian Tulis)",
    bobot: "20",
  },
  {
    minggu: "9",
    cpl: "CPL-07",
    cpmk: "CPMK-2",
    indikator: "Mahasiswa mampu menghitung rasio profitabilitas secara tepat",
    bentuk: "Tugas praktik",
    bobot: "5",
  },
  {
    minggu: "10",
    cpl: "CPL-07",
    cpmk: "CPMK-2",
    indikator: "Mahasiswa mampu menghitung rasio aktivitas dan menjelaskan maknanya",
    bentuk: "Tugas praktik",
    bobot: "5",
  },
  {
    minggu: "11",
    cpl: "CPL-07",
    cpmk: "CPMK-3",
    indikator: "Mahasiswa mampu menganalisis tren kinerja keuangan perusahaan",
    bentuk: "Tugas individu",
    bobot: "5",
  },
  {
    minggu: "12",
    cpl: "CPL-07",
    cpmk: "CPMK-3",
    indikator: "Mahasiswa mampu menjelaskan hasil analisis tren laporan keuangan",
    bentuk: "Quiz",
    bobot: "5",
  },
  {
    minggu: "13",
    cpl: "CPL-05",
    cpmk: "CPMK-4",
    indikator: "Mahasiswa mampu menginterpretasikan rasio keuangan untuk menilai kondisi bisnis",
    bentuk: "Tugas individu",
    bobot: "5",
  },
  {
    minggu: "14",
    cpl: "CPL-06",
    cpmk: "CPMK-4",
    indikator:
      "Mahasiswa mampu mengevaluasi kondisi dan risiko bisnis berdasarkan analisis laporan keuangan",
    bentuk: "Diskusi kasus",
    bobot: "5",
  },
  {
    minggu: "15",
    cpl: "CPL-05, CPL-07",
    cpmk: "CPMK-5",
    indikator:
      "Mahasiswa mampu menyusun laporan analisis laporan keuangan dan memberikan rekomendasi keputusan bisnis",
    bentuk: "Proyek / Presentasi",
    bobot: "8",
  },
  {
    minggu: "16",
    cpl: "CPL-04, CPL-05, CPL-07",
    cpmk: "CPMK-1–5",
    indikator: "Mahasiswa mampu menerapkan analisis laporan keuangan secara komprehensif",
    bentuk: "UAS (Ujian Tulis)",
    bobot: "20",
  },
];

const elementRows = (rows: Array<[string, string]>) =>
  rows.map(([elemen, persentase]) => ({ id: uid(), elemen, rencana: "", persentase }));

export const presetRps = (): RpsData => ({
  identity: {
    kodeMK: "SBSD25214",
    namaMK: "Analisis Laporan Keuangan",
    rumpunMK: "Terapan",
    bobotSKS: "2",
    semester: "2",
    tanggalPenyusunan: "28 Februari 2026",
    pengembangRPS: "Reny Marliadi, M. Ak",
    koordinatorMK: "Reny Marliadi, M. Ak",
    kaprodi: "Ibrahim Rully Effendy, S. Kom., M. M",
    universitas: "UNIVERSITAS BORNEO LESTARI",
    fakultas: "FAKULTAS ILMU SOSIAL DAN HUMANIORA",
    prodi: "PROGRAM STUDI SARJANA BISNIS DIGITAL",
    logoDataUrl: "",
  },
  cpl,
  cpmk,
  subCpmk,
  cplCpmk,
  subCpmkCpmk,
  metodePenilaian: [...METODE_PENILAIAN],
  metodeCpmk,
  deskripsi:
    "Mata kuliah ini membahas konsep, metode, dan teknik dalam menganalisis laporan keuangan perusahaan sebagai dasar untuk menilai kinerja dan kondisi keuangan organisasi. Pembelajaran mencakup pemahaman struktur laporan keuangan, karakteristik informasi keuangan yang relevan, serta penerapan berbagai teknik analisis seperti analisis horizontal, analisis vertikal, analisis rasio keuangan, dan analisis tren. Melalui mata kuliah ini mahasiswa dilatih untuk mengolah dan menginterpretasikan data laporan keuangan guna mengevaluasi kinerja keuangan perusahaan. Mahasiswa juga belajar mengaitkan hasil analisis dengan kondisi bisnis dan lingkungan organisasi sehingga dapat digunakan sebagai dasar dalam pengambilan keputusan manajerial dan strategis.",
  bahanKajian: [
    "Peran laporan keuangan",
    "Komponen laporan keuangan",
    "Teknik analisis laporan keuangan",
    "Analisis horizontal",
    "Analisis vertikal",
    "Rasio keuangan",
    "Interpretasi rasio keuangan",
    "Analisis tren",
    "Evaluasi bisnis",
    "Laporan analisis keuangan",
  ],
  pustaka: {
    utama: [
      "Franklin, M., Graybeal, P., Cooper, D. 2026. Principles of Accounting Volume 1 Financial Accounting. Open Stax. https://openstax.org/details/books/principles-financial-accounting",
      "Hoyle, JB., Skender, CJ., Schaefer, T. Financial Accounting. Saylor Academy. https://resources.saylor.org/wwwresources/archived/site/textbooks/Financial%20Accounting.pdf",
    ],
    pendukung: [
      "Edwards, JD., Hermanson, RH., Maher, MW. Accounting Principles: A Business Perspective. Saylor Academy. https://resources.saylor.org/BUS/BUS103/Textbook/AccountingPrinciples.pdf",
      "Dahlquist, J., Knight, R. (2022). Principles of Finance. OpenStax. https://assets.openstax.org/oscms-prodcms/media/documents/PrinciplesofFinance-WEB.pdf",
    ],
    penelitian: [
      "Vitasari, A., Hasymi, L. F., Marliadi, R., Rahman, A. N., & Hastuti, E. (2025). Analysis of BLUD Financial Performance at Hospital X in South Kalimantan Province (KALSEL). Jurnal Akuntansi & Keuangan Unja, 10(01), 72–82. https://doi.org/10.22437/jaku.v10i01.46624",
      "Marliadi, R., Noor'adia, N., Maulana, RR., Hasymi, LF., Rahman, AN. (2024). Perbandingan Kinerja Keuangan Rumah Sakit Umum dan Khusus: (Studi Kasus Periode Sebelum dan Saat Pandemi Covid-19). AKUNTANSI 45, 5(2), 1108–1123. https://doi.org/10.30640/akuntansi45.v5i2.3845",
    ],
    pkm: [
      "Marliadi, R., Jamaludin, W. B., Nirwana, R., Jakiroh, J., Hilmi, R., & Mafazy, M. M. (2026). Optimalisasi Pelaporan Keuangan Sesuai SAK EMKM Bagi Pelaku Usaha Mikro. Amal Ilmiah: Jurnal Pengabdian Kepada Masyarakat, 7(1), 280–287. https://doi.org/10.36709/amalilmiah.v7i1.765",
      "Nirwana, R., Alfikri, R., Nadiar, R., Mutmainah, M., Marliadi, R. (2025). Literasi Akuntansi dan Inovasi Bisnis: Kunci Sukses Bisnis Gila Marketing dengan Dukungan Modal sebagai Pemediasi. Among Makarti, 18(2), 267-284. http://dx.doi.org/10.52353/ama.v18i2.911",
    ],
  },
  dosenPengampu: "Reny Marliadi, M. Ak",
  prasyarat: "-",
  weeks,
  tasks: taskSeeds.map((t) => ({ ...t, id: uid() })),
  variants: [
    {
      id: uid(),
      judul: "a. Pada CPMK terdapat Tugas Tanpa UTS dan UAS dalam bentuk tertulis",
      rows: elementRows([
        ["Aktivitas Partisipatif", "35"],
        ["Hasil Project", "35"],
        ["Tugas", "15"],
        ["Ujian Tengah Semester", "15"],
      ]),
    },
    {
      id: uid(),
      judul: "b. Pada CPMK tanpa Tugas Project dengan memuat UTS dan UAS bentuk tertulis",
      rows: elementRows([
        ["Aktivitas Partisipatif", "20"],
        ["Tugas", "35"],
        ["Kuis", "15"],
        ["Ujian Tengah Semester", "15"],
        ["Ujian Akhir Semester", "15"],
      ]),
    },
    {
      id: uid(),
      judul: "c. Pada CPMK terdapat Tugas dan Tugas Project sebagai UAS",
      rows: elementRows([
        ["Aktivitas Partisipatif", "35"],
        ["Hasil Project", "35"],
        ["Tugas", "15"],
        ["Ujian Tengah Semester", "15"],
      ]),
    },
  ],
  variantNotes: [
    "*Case Method atau mini riset dapat merupakan gabungan dari: TR, CBR, CJR, dan RI.",
    "*Team Based Project/Projek dapat merupakan gabungan dari: TR, CBR, CJR, RI, Projek dan MR.",
  ],
  achievements: achievementSeeds.map((a) => ({
    ...a,
    id: uid(),
    nilai: "",
    ketercapaian: "Tercapai / Tidak",
  })),
  gradeScale: ([
    ["80 – 100", "A"],
    ["75 - < 80", "B+"],
    ["70 - < 75", "B"],
    ["65 - < 70", "C+"],
    ["60 - < 65", "C"],
    ["55 - < 60", "D+"],
    ["50 - < 55", "D"],
    ["< 50", "E"],
  ] as const).map(([rentang, kategori]) => ({ id: uid(), rentang, kategori })),
  rubricTitle: "INSTRUMEN DAN RUBRIK PENILAIAN TUGAS NON PROJECT",
  rubric: [
    {
      id: uid(),
      aspek: "Pengetahuan (Penguasaan Konsep)",
      definisi: "Pemahaman mahasiswa terhadap konsep dasar laporan keuangan, tujuan analisis, dan jenis teknik analisis laporan keuangan.",
      indikator: "Mampu menjelaskan konsep analisis laporan keuangan secara lisan dan tertulis dengan tepat.",
      subIndikator: [
        { id: uid(), deskripsi: "Penjelasan sangat tepat, lengkap, sistematis, tanpa kesalahan konsep", rentang: "81–100" },
        { id: uid(), deskripsi: "Penjelasan tepat namun belum mendalam", rentang: "61–80" },
        { id: uid(), deskripsi: "Penjelasan terbatas dan terdapat kekeliruan minor", rentang: "41–60" },
        { id: uid(), deskripsi: "Tidak mampu menjelaskan konsep dengan benar", rentang: "0–40" },
      ],
    },
    {
      id: uid(),
      aspek: "Kemampuan Analisis",
      definisi: "Kemampuan mahasiswa dalam menganalisis laporan keuangan menggunakan metode analisis yang tepat.",
      indikator: "Mampu melakukan analisis horizontal, vertikal, dan rasio keuangan secara logis.",
      subIndikator: [
        { id: uid(), deskripsi: "Analisis sangat tepat, logis, sistematis, dan sesuai metode", rentang: "81–100" },
        { id: uid(), deskripsi: "Analisis cukup tepat namun kurang mendalam", rentang: "61–80" },
        { id: uid(), deskripsi: "Analisis kurang logis atau tidak konsisten", rentang: "41–60" },
        { id: uid(), deskripsi: "Analisis tidak sesuai dengan permasalahan", rentang: "0–40" },
      ],
    },
    {
      id: uid(),
      aspek: "Ketepatan Perhitungan",
      definisi: "Ketepatan mahasiswa dalam melakukan perhitungan analisis laporan keuangan.",
      indikator: "Mampu menghitung rasio keuangan dan analisis laporan dengan benar.",
      subIndikator: [
        { id: uid(), deskripsi: "Semua perhitungan sangat tepat tanpa kesalahan", rentang: "81–100" },
        { id: uid(), deskripsi: "Sebagian besar perhitungan tepat, terdapat kesalahan kecil", rentang: "61–80" },
        { id: uid(), deskripsi: "Beberapa kesalahan yang mempengaruhi hasil analisis", rentang: "41–60" },
        { id: uid(), deskripsi: "Perhitungan tidak tepat", rentang: "0–40" },
      ],
    },
    {
      id: uid(),
      aspek: "Kemampuan Interpretasi dan Kesimpulan",
      definisi: "Kemampuan mahasiswa dalam menginterpretasikan hasil analisis laporan keuangan.",
      indikator: "Mampu menarik kesimpulan berdasarkan hasil analisis data keuangan.",
      subIndikator: [
        { id: uid(), deskripsi: "Kesimpulan logis, relevan, dan berbasis data", rentang: "81–100" },
        { id: uid(), deskripsi: "Kesimpulan cukup relevan namun belum tajam", rentang: "61–80" },
        { id: uid(), deskripsi: "Kesimpulan masih umum dan kurang berbasis data", rentang: "41–60" },
        { id: uid(), deskripsi: "Tidak mampu menyusun kesimpulan", rentang: "0–40" },
      ],
    },
    {
      id: uid(),
      aspek: "Sistematika dan Kerapian Penyajian",
      definisi: "Struktur penulisan dan kejelasan penyajian tugas analisis laporan keuangan.",
      indikator: "Tugas disusun secara sistematis, jelas, dan mudah dipahami.",
      subIndikator: [
        { id: uid(), deskripsi: "Penyajian sangat sistematis, rapi, dan mudah dipahami", rentang: "81–100" },
        { id: uid(), deskripsi: "Cukup sistematis dan rapi", rentang: "61–80" },
        { id: uid(), deskripsi: "Kurang sistematis", rentang: "41–60" },
        { id: uid(), deskripsi: "Tidak sistematis dan sulit dipahami", rentang: "0–40" },
      ],
    },
  ],
  rubricNotes: [
    "Penilaian aspek Sikap sebagai berikut :",
    "Skala 1 : Rentang Nilai 0 – 20",
    "Skala 2 : Rentang Nilai 21 – 40",
    "Skala 3 : Rentang Nilai 41 – 60",
    "Skala 4 : Rentang Nilai 61 – 80",
    "Skala 5 : Rentang Nilai 81 – 100",
  ],
});
