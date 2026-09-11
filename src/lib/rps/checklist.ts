/**
 * Daftar opsi centang persis seperti template RPS UNBL.
 * Kolom "Bentuk dan Metode Pembelajaran", "Media Pembelajaran", dan
 * "Teknik & Kriteria" pada template berupa daftar kotak centang, bukan teks
 * bebas. Modul ini memetakan teks bebas yang tersimpan pada data mingguan ke
 * daftar centang tersebut agar pratinjau, PDF, dan Word tampil identik.
 */

export type ChecklistOption = { label: string; keywords: string[] };
export type ChecklistGroup = { title: string; options: ChecklistOption[] };
export type ResolvedGroup = { title: string; options: Array<{ label: string; checked: boolean }> };

const o = (label: string, ...keywords: string[]): ChecklistOption => ({
  label,
  keywords: [label, ...keywords],
});

export const BENTUK_METODE_GROUPS: ChecklistGroup[] = [
  {
    title: "Bentuk",
    options: [o("Daring", "online", "e-learning penuh"), o("Luring", "offline", "tatap muka")],
  },
  {
    title: "Metode",
    options: [
      o("Presentasi", "presentation"),
      o("Diskusi", "discussion", "diskusi kelompok"),
      o("Kolaboratif", "collaborative"),
      o("Kooperatif", "cooperative"),
      o("Berbasis Proyek", "project based", "team based project", "proyek"),
      o("Berbasis Masalah", "problem based", "pbl"),
      o("Studi Kasus", "case method", "case study", "studi kasus"),
      o("Lainnya", "lainnya", "dll"),
    ],
  },
];

export const MEDIA_GROUPS: ChecklistGroup[] = [
  {
    title: "",
    options: [
      o("PPT", "power point", "slide", "powerpoint"),
      o("Video", "youtube"),
      o("FGD", "focus group"),
      o("Modul", "handout", "buku ajar"),
      o("Zoom", "google meet", "meet"),
      o("e-learning", "lms", "elearning"),
      o("Lainnya", "lainnya", "dll"),
    ],
  },
];

export const PENILAIAN_GROUPS: ChecklistGroup[] = [
  {
    title: "Teknik Penilaian",
    options: [
      o("Observasi", "pengamatan"),
      o("Tes Lisan", "tes lisan"),
      o("Unjuk Kerja", "unjuk kerja", "kinerja praktik"),
      o("Tes Tertulis", "tes tertulis", "ujian tertulis", "kuis"),
      o("dll", "dll"),
    ],
  },
  {
    title: "Kriteria",
    options: [
      o("Rubrik", "rubric"),
      o("Portofolio", "portfolio"),
      o("lainnya", "lainnya"),
    ],
  },
  {
    title: "Penugasan",
    options: [
      o("Diskusi", "diskusi"),
      o("Latihan Soal", "latihan soal"),
      o("lainnya", "lainnya"),
    ],
  },
];

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ");

/** Tandai opsi yang cocok dengan teks bebas pada satu sel. */
export function resolveChecklist(groups: ChecklistGroup[], text: string): ResolvedGroup[] {
  const hay = norm(text || "");
  return groups.map((g) => ({
    title: g.title,
    options: g.options.map((opt) => ({
      label: opt.label,
      checked: opt.keywords.some((k) => hay.includes(norm(k))),
    })),
  }));
}

/** Versi teks (untuk ekspor Word) dengan penanda centang di depan opsi. */
export function checklistToLines(groups: ChecklistGroup[], text: string): string {
  return resolveChecklist(groups, text)
    .flatMap((g) => [
      ...(g.title ? [g.title] : []),
      ...g.options.map((opt) => `${opt.checked ? "\u2713 " : "\u00A0\u00A0 "}${opt.label}`),
    ])
    .join("\n");
}
