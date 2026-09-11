export type Identity = {
  kodeMK: string;
  namaMK: string;
  rumpunMK: string;
  bobotSKS: string;
  semester: string;
  tanggalPenyusunan: string;
  pengembangRPS: string;
  koordinatorMK: string;
  kaprodi: string;
  universitas: string;
  fakultas: string;
  prodi: string;
  logoDataUrl: string;
};

export type Coded = {
  id: string;
  kode: string;
  deskripsi: string;
};

export type WeekRow = {
  id: string;
  minggu: string;
  subCpmk: string;
  bahanKajian: string;
  bentukMetode: string;
  estimasiWaktu: string;
  pengalamanBelajar: string;
  media: string;
  indikator: string;
  teknikKriteria: string;
  bobot: string;
  pustaka: string;
};

export type TaskRow = {
  id: string;
  minggu: string;
  namaTugas: string;
  kemampuan: string;
  bentuk: string;
  luaran: string;
  batasWaktu: string;
};

export type ElementRow = {
  id: string;
  elemen: string;
  rencana: string;
  persentase: string;
};

export type AssessmentVariant = {
  id: string;
  judul: string;
  rows: ElementRow[];
};

export type AchievementRow = {
  id: string;
  minggu: string;
  cpl: string;
  cpmk: string;
  indikator: string;
  bentuk: string;
  bobot: string;
  nilai: string;
  ketercapaian: string;
};

export type GradeScaleRow = {
  id: string;
  rentang: string;
  kategori: string;
};

export type RubricSubIndicator = {
  id: string;
  deskripsi: string;
  rentang: string;
};

export type RubricRow = {
  id: string;
  aspek: string;
  definisi: string;
  indikator: string;
  subIndikator: RubricSubIndicator[];
};

export type Pustaka = {
  utama: string[];
  pendukung: string[];
  penelitian: string[];
  pkm: string[];
};

export type Matrix = Record<string, boolean>;

export type RpsData = {
  identity: Identity;
  cpl: Coded[];
  cpmk: Coded[];
  subCpmk: Coded[];
  cplCpmk: Matrix;
  subCpmkCpmk: Matrix;
  metodePenilaian: string[];
  metodeCpmk: Matrix;
  deskripsi: string;
  bahanKajian: string[];
  pustaka: Pustaka;
  dosenPengampu: string;
  prasyarat: string;
  weeks: WeekRow[];
  tasks: TaskRow[];
  variants: AssessmentVariant[];
  variantNotes: string[];
  achievements: AchievementRow[];
  gradeScale: GradeScaleRow[];
  rubricTitle: string;
  rubric: RubricRow[];
  rubricNotes: string[];
};

export const matrixKey = (row: string, col: string) => `${row}||${col}`;

export const uid = () => Math.random().toString(36).slice(2, 10);
