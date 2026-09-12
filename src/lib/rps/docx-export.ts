import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  PageOrientation,
  Paragraph,
  ShadingType,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
} from "docx";
import type { RpsData } from "./types";
import { matrixKey } from "./types";
import {
  BENTUK_METODE_GROUPS,
  MEDIA_GROUPS,
  PENILAIAN_GROUPS,
  resolveChecklist,
} from "./checklist";
import type { ChecklistGroup } from "./checklist";
import unblLogo from "@/assets/unbl-logo.png.asset.json";

const FONT = "Times New Roman";
const LANDSCAPE_WIDTH = 13958;
const PORTRAIT_WIDTH = 9906;
void PORTRAIT_WIDTH;
// Lebar konten halaman yang sedang dibangun (portrait untuk bagian A/B/C/D,
// landscape hanya untuk tabel rencana mingguan seperti template UNBL).
let currentWidth = LANDSCAPE_WIDTH;

const border = { style: BorderStyle.SINGLE, size: 6, color: "000000" };
const borders = { top: border, bottom: border, left: border, right: border };

type CellOpts = {
  bold?: boolean;
  width?: number;
  span?: number;
  rowSpan?: number;
  align?: (typeof AlignmentType)[keyof typeof AlignmentType];
  shade?: boolean;
  size?: number;
  margins?: number;
};

const lines = (text: string, opts: CellOpts) =>
  String(text ?? "")
    .split("\n")
    .map(
      (line) =>
        new Paragraph({
          alignment: opts.align ?? AlignmentType.LEFT,
          spacing: { before: 0, after: 0, line: 180 },
          children: [
            new TextRun({ text: line, bold: opts.bold ?? false, font: FONT, size: opts.size ?? 18 }),
          ],
        }),
    );

const cell = (text: string, opts: CellOpts = {}) =>
  new TableCell({
    borders,
    ...(opts.span ? { columnSpan: opts.span } : {}),
    ...(opts.rowSpan ? { rowSpan: opts.rowSpan } : {}),

    verticalAlign: VerticalAlign.CENTER,
    margins: {
      top: opts.margins ?? 24,
      bottom: opts.margins ?? 24,
      left: opts.margins ?? 48,
      right: opts.margins ?? 48,
    },
    ...(opts.width ? { width: { size: opts.width, type: WidthType.DXA } } : {}),
    ...(opts.shade
      ? { shading: { fill: "E2F0D9", type: ShadingType.CLEAR, color: "auto" } }
      : {}),
    children: lines(text, opts),
  });

const head = (text: string, opts: CellOpts = {}) =>
  cell(text, { ...opts, bold: true, shade: true });

/**
 * Sel daftar centang berkotak seperti template UNBL: setiap opsi berada pada
 * baris berkotak dengan kolom kecil di kiri untuk tanda centang.
 */
const checklistCell = (groups: ChecklistGroup[], text: string, innerWidth: number) => {
  const checkW = 300;
  const labelW = Math.max(600, innerWidth - checkW);
  const miniPara = (t: string, bold = false, align: CellOpts["align"] = AlignmentType.LEFT) =>
    new Paragraph({
      alignment: align,
      spacing: { before: 0, after: 0 },
      children: [new TextRun({ text: t, bold, font: FONT, size: 15 })],
    });
  const rows: TableRow[] = [];
  for (const g of resolveChecklist(groups, text)) {
    if (g.title) {
      rows.push(
        new TableRow({
          children: [
            new TableCell({
              borders,
              columnSpan: 2,
              margins: { top: 20, bottom: 20, left: 40, right: 40 },
              children: [miniPara(g.title, true, AlignmentType.CENTER)],
            }),
          ],
        }),
      );
    }
    for (const opt of g.options) {
      rows.push(
        new TableRow({
          cantSplit: true,
          children: [
            new TableCell({
              borders,
              width: { size: checkW, type: WidthType.DXA },
              margins: { top: 20, bottom: 20, left: 20, right: 20 },
              children: [miniPara(opt.checked ? "\u2713" : "", false, AlignmentType.CENTER)],
            }),
            new TableCell({
              borders,
              width: { size: labelW, type: WidthType.DXA },
              margins: { top: 20, bottom: 20, left: 40, right: 40 },
              children: [miniPara(opt.label)],
            }),
          ],
        }),
      );
    }
  }
  return new TableCell({
    borders,
    verticalAlign: VerticalAlign.TOP,
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    children: [
      new Table({
        width: { size: checkW + labelW, type: WidthType.DXA },
        columnWidths: [checkW, labelW],
        rows,
      }),
    ],
  });
};

const table = (rows: TableRow[], columnWidths: number[], stretch = true) => {
  const sum = columnWidths.reduce((a, b) => a + b, 0) || 1;
  const scaled = stretch
    ? columnWidths.map((w) => Math.max(400, Math.floor((w / sum) * currentWidth)))
    : columnWidths;
  return new Table({
    width: { size: scaled.reduce((a, b) => a + b, 0), type: WidthType.DXA },
    columnWidths: scaled,
    rows,
  });
};

const para = (
  text: string,
  opts: { bold?: boolean; size?: number; align?: CellOpts["align"]; spacing?: number } = {},
) =>
  new Paragraph({
    alignment: opts.align ?? AlignmentType.LEFT,
    spacing: { before: opts.spacing ?? 80, after: opts.spacing ?? 80 },
    children: [
      new TextRun({ text, bold: opts.bold ?? false, font: FONT, size: opts.size ?? 20 }),
    ],
  });

const spacer = () => new Paragraph({ children: [new TextRun({ text: "", font: FONT })] });
const pageBreak = () => new Paragraph({ children: [new PageBreak()] });

const dataUrlToBytes = (dataUrl: string): { data: Uint8Array; type: "png" | "jpg" } | null => {
  const match = /^data:image\/(png|jpe?g);base64,(.+)$/i.exec(dataUrl.trim());
  if (!match || !match[1] || !match[2]) return null;
  const binary = atob(match[2]);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return { data: bytes, type: match[1].toLowerCase().startsWith("png") ? "png" : "jpg" };
};

const logoParagraph = (data: RpsData, size: number) => {
  const img = dataUrlToBytes(data.identity.logoDataUrl || "");
  if (!img) return null;
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [
      new ImageRun({
        type: img.type,
        data: img.data,
        transformation: { width: size, height: size },
        altText: { title: "Logo", description: "Logo institusi", name: "logo" },
      }),
    ],
  });
};

/**
 * Kop institusi seperti template: satu tabel bergaris dengan logo di kolom kiri
 * (menyatu 3 baris) dan tiga baris nama fakultas/prodi/universitas di kanan.
 */
const kop = (data: RpsData): Array<Paragraph | Table> => {
  const logo = logoParagraph(data, 64);
  const logoW = 1200;
  const textW = Math.max(2000, currentWidth - logoW);
  const line = (t: string) =>
    new TableCell({
      borders,
      width: { size: textW, type: WidthType.DXA },
      verticalAlign: VerticalAlign.CENTER,
      margins: { top: 30, bottom: 30, left: 100, right: 60 },
      children: [
        new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [new TextRun({ text: t, bold: true, font: FONT, size: 21 })],
        }),
      ],
    });
  const logoCell = new TableCell({
    borders,
    rowSpan: 3,
    width: { size: logoW, type: WidthType.DXA },
    verticalAlign: VerticalAlign.CENTER,
    margins: { top: 40, bottom: 40, left: 40, right: 40 },
    children: [logo ?? new Paragraph({ children: [new TextRun({ text: "", font: FONT })] })],
  });
  return [
    new Table({
      width: { size: logoW + textW, type: WidthType.DXA },
      columnWidths: [logoW, textW],
      rows: [
        new TableRow({ children: [logoCell, line(data.identity.fakultas)] }),
        new TableRow({ children: [line(data.identity.prodi)] }),
        new TableRow({ children: [line(data.identity.universitas)] }),
      ],
    }),
  ];
};

const check = (on: boolean) => (on ? "\u2713" : "");

function sectionACore(data: RpsData) {
  currentWidth = LANDSCAPE_WIDTH;
  const { identity } = data;
  const w = LANDSCAPE_WIDTH;
  const six = Array.from({ length: 6 }, () => Math.floor(w / 6));
  const children: Array<Paragraph | Table> = [...kop(data)];

  children.push(
    pageBreak(),
    table(
      [
        new TableRow({
          children: [head("A. RENCANA PEMBELAJARAN SEMESTER", { span: 6, width: w })],
        }),
        new TableRow({
          children: [
            head("Kode MK"),
            head("Nama Mata Kuliah (MK)"),
            head("Rumpun MK"),
            head("Bobot (SKS)"),
            head("Semester"),
            head("Tanggal Penyusunan"),
          ],
        }),
        new TableRow({
          children: [
            cell(identity.kodeMK, { align: AlignmentType.CENTER }),
            cell(identity.namaMK),
            cell(identity.rumpunMK, { align: AlignmentType.CENTER }),
            cell(identity.bobotSKS, { align: AlignmentType.CENTER }),
            cell(identity.semester, { align: AlignmentType.CENTER }),
            cell(identity.tanggalPenyusunan, { align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            head("Otorisasi"),
            head("Pengembang RPS", { span: 2 }),
            head("Koordinator MK"),
            head("Ketua Program Studi", { span: 2 }),
          ],
        }),
        new TableRow({
          children: [
            cell(""),
            cell(identity.pengembangRPS, { span: 2, align: AlignmentType.CENTER }),
            cell(identity.koordinatorMK, { align: AlignmentType.CENTER }),
            cell(identity.kaprodi, { span: 2, align: AlignmentType.CENTER }),
          ],
        }),
        new TableRow({
          children: [
            head("Capaian Pembelajaran Lulusan (CPL) Prodi yang Dibebankan Pada MK"),
            head("CPL yang dibebankan pada MK :", { span: 5 }),
          ],
        }),
        ...data.cpl.map(
          (c) =>
            new TableRow({
              children: [cell(c.kode, { bold: true }), cell(c.deskripsi, { span: 5 })],
            }),
        ),
        new TableRow({
          children: [
            head("Capaian Pembelajaran Mata Kuliah (CPMK)"),
            head(
              "CPL dijabarkan pada CPMK berikut, yaitu setelah menyelesaikan pembelajaran mata kuliah.",
              { span: 5 },
            ),
          ],
        }),
        ...data.cpmk.map(
          (c) =>
            new TableRow({
              children: [cell(c.kode, { bold: true }), cell(c.deskripsi, { span: 5 })],
            }),
        ),
      ],
      six,
    ),
  );

  const matrixWidths = (label: number) => {
    const rest = Math.floor((LANDSCAPE_WIDTH - label) / Math.max(data.cpmk.length, 1));
    return [label, ...data.cpmk.map(() => rest)];
  };

  const matrixTable = (title: string, rows: Array<{ kode: string }>, src: RpsData["cplCpmk"]) =>
    table(
      [
        new TableRow({
          children: [head(title), ...data.cpmk.map((c) => head(c.kode, { align: AlignmentType.CENTER }))],
        }),
        ...rows.map(
          (r) =>
            new TableRow({
              children: [
                cell(r.kode, { bold: true }),
                ...data.cpmk.map((c) =>
                  cell(check(!!src[matrixKey(r.kode, c.kode)]), {
                    align: AlignmentType.CENTER,
                  }),
                ),
              ],
            }),
        ),
      ],
      matrixWidths(3200),
    );

  children.push(matrixTable("Pemetaan CPL dengan CPMK", data.cpl, data.cplCpmk));

  children.push(
    table(
      [
        new TableRow({
          children: [
            head("Sub-CPMK — Kemampuan Akhir Tiap Tahapan Belajar MK", { span: 2 }),
          ],
        }),
        ...data.subCpmk.map(
          (s) =>
            new TableRow({
              children: [cell(s.kode, { bold: true }), cell(s.deskripsi)],
            }),
        ),
      ],
      [2200, LANDSCAPE_WIDTH - 2200],
    ),
    matrixTable("Korelasi CPMK terhadap Sub-CPMK", data.subCpmk, data.subCpmkCpmk),
    table(
      [
        new TableRow({
          children: [
            head("Metode Penilaian dan Kaitannya dengan CPMK"),
            ...data.cpmk.map((c) => head(c.kode, { align: AlignmentType.CENTER })),
          ],
        }),
        ...data.metodePenilaian.map(
          (m) =>
            new TableRow({
              children: [
                cell(m),
                ...data.cpmk.map((c) =>
                  cell(check(!!data.metodeCpmk[matrixKey(m, c.kode)]), {
                    align: AlignmentType.CENTER,
                  }),
                ),
              ],
            }),
        ),
      ],
      matrixWidths(3600),
    ),
  );

  const pustakaText = (
    [
      ["Utama (U):", data.pustaka.utama, "U"],
      ["Pendukung (P):", data.pustaka.pendukung, "P"],
      ["Pengintegrasian Hasil Penelitian (R):", data.pustaka.penelitian, "R"],
      ["Pengintegrasian Hasil Pengabdian Kepada Masyarakat (C):", data.pustaka.pkm, "C"],
    ] as Array<[string, string[], string]>
  )
    .map(([label, items, prefix]) =>
      [label, ...items.filter((i) => i.trim()).map((i, idx) => `${prefix}${idx + 1}. ${i}`)].join(
        "\n",
      ),
    )
    .join("\n");

  children.push(
    table(
      [
        new TableRow({
          children: [head("Deskripsi Singkat Mata Kuliah"), cell(data.deskripsi)],
        }),
        new TableRow({
          children: [
            head("Bahan Kajian / Materi Pembelajaran"),
            cell(data.bahanKajian.map((b, i) => `${i + 1}. ${b}`).join("\n")),
          ],
        }),
        new TableRow({ children: [head("Pustaka"), cell(pustakaText)] }),
        new TableRow({ children: [head("Dosen Pengampu"), cell(data.dosenPengampu)] }),
        new TableRow({ children: [head("Mata Kuliah Prasyarat"), cell(data.prasyarat)] }),
      ],
      [2800, LANDSCAPE_WIDTH - 2800],
    ),
  );

  return children;
}

function weeklySection(data: RpsData) {
  currentWidth = LANDSCAPE_WIDTH;
  const widths = [800, 1750, 1250, 1550, 900, 1300, 1150, 1350, 600, 1650, 1158];
  const sum = widths.reduce((a, b) => a + b, 0);
  const dxa = (i: number) => Math.floor(((widths[i] ?? 0) / sum) * LANDSCAPE_WIDTH);
  const headerRows = (): TableRow[] => [
    new TableRow({
      tableHeader: true,
      children: [
        head("Minggu Ke-", { align: AlignmentType.CENTER, size: 16, rowSpan: 2 }),
        head("Sub-CPMK (Kemampuan Akhir yang Direncanakan)", {
          size: 16,
          align: AlignmentType.CENTER,
          rowSpan: 2,
        }),
        head("Bahan Kajian", { size: 16, align: AlignmentType.CENTER, rowSpan: 2 }),
        head("Bentuk dan Metode Pembelajaran", {
          size: 16,
          align: AlignmentType.CENTER,
          rowSpan: 2,
        }),
        head("Estimasi Waktu Pembelajaran (mnt/mg/smt)", {
          size: 16,
          align: AlignmentType.CENTER,
          rowSpan: 2,
        }),
        head("Pengalaman Belajar Mahasiswa", {
          size: 16,
          align: AlignmentType.CENTER,
          rowSpan: 2,
        }),
        head("Media Pembelajaran", { size: 16, align: AlignmentType.CENTER, rowSpan: 2 }),
        head("Penilaian", { size: 16, align: AlignmentType.CENTER, span: 3 }),
        head("Pustaka", { size: 16, align: AlignmentType.CENTER, rowSpan: 2 }),
      ],
    }),
    new TableRow({
      tableHeader: true,
      children: [
        head("Indikator", { size: 16, align: AlignmentType.CENTER }),
        head("Bobot", { size: 16, align: AlignmentType.CENTER }),
        head("Teknik & Kriteria", { size: 16, align: AlignmentType.CENTER }),
      ],
    }),
  ];
  const weekRows = data.weeks.map(
      (w) =>
        new TableRow({
          cantSplit: false,
          children: [
            cell(w.minggu, { align: AlignmentType.CENTER, size: 16 }),
            cell(w.subCpmk, { size: 16 }),
            cell(w.bahanKajian, { size: 16 }),
            checklistCell(BENTUK_METODE_GROUPS, w.bentukMetode, dxa(3) - 120),
            cell(w.estimasiWaktu, { align: AlignmentType.CENTER, size: 16 }),
            cell(w.pengalamanBelajar, { size: 16 }),
            checklistCell(MEDIA_GROUPS, w.media, dxa(6) - 120),
            cell(w.indikator, { size: 16 }),
            cell(w.bobot ? `${w.bobot}%` : "", { align: AlignmentType.CENTER, size: 16 }),
            checklistCell(PENILAIAN_GROUPS, w.teknikKriteria, dxa(9) - 120),
            cell(w.pustaka, { size: 16 }),
          ],
        }),
    );
  const total = data.weeks.reduce((s, w) => s + (parseFloat(w.bobot) || 0), 0);
  const totalRow =
    new TableRow({
      children: [
        cell("Total Bobot", { span: 8, bold: true, align: AlignmentType.RIGHT, size: 16 }),
        cell(`${total}%`, { bold: true, align: AlignmentType.CENTER, size: 16 }),
        cell("", { span: 2, size: 16 }),
      ],
    });
  const titleRow = () =>
    new TableRow({
      children: [
        head("A. RENCANA PEMBELAJARAN SEMESTER", {
          span: 11,
          align: AlignmentType.CENTER,
          size: 22,
        }),
      ],
    });
  const firstRows = [titleRow(), ...headerRows(), ...weekRows.slice(0, 15)];
  const lastRows = [...headerRows(), ...weekRows.slice(15), totalRow];
  return [...kop(data), table(firstRows, widths), pageBreak(), table(lastRows, widths)];
}

function tasksSection(data: RpsData) {
  currentWidth = LANDSCAPE_WIDTH;
  const widths = [1150, 2400, 2850, 3400, 2350, 1808];
  const titleAndHeader = (includeTitle: boolean) => [
    ...(includeTitle
      ? [
        new TableRow({
          children: [
            head("B. RENCANA TUGAS MAHASISWA", {
              span: 6,
              align: AlignmentType.CENTER,
              size: 20,
            }),
          ],
        }),
      ]
      : []),
    new TableRow({
          tableHeader: true,
          children: [
            head("Minggu ke-", { align: AlignmentType.CENTER, size: 16 }),
            head("Nama Tugas dan Evaluasi", { size: 16 }),
            head("Kemampuan yang Diukur (Sub-CPMK)", { size: 16 }),
            head("Bentuk Penugasan / Cara Pengerjaan", { size: 16 }),
            head("Luaran Tugas yang Dihasilkan", { size: 16 }),
            head("Batas Waktu", { size: 16 }),
          ],
    }),
  ];
  const taskRows = data.tasks.map(
          (t) =>
            new TableRow({
              children: [
                cell(t.minggu, { align: AlignmentType.CENTER, size: 16 }),
                cell(t.namaTugas, { size: 16 }),
                cell(t.kemampuan, { size: 16 }),
                cell(t.bentuk, { size: 16 }),
                cell(t.luaran, { size: 16 }),
                cell(t.batasWaktu, { size: 16 }),
              ],
            }),
        );
  return [
    table([...titleAndHeader(true), ...taskRows.slice(0, 8)], widths),
    pageBreak(),
    table([...titleAndHeader(false), ...taskRows.slice(8)], widths),
  ];
}

function finalAssessmentSection(data: RpsData) {
  currentWidth = LANDSCAPE_WIDTH;
  const children: Array<Paragraph | Table> = [
    table(
      [
        new TableRow({
          children: [head("C. PENILAIAN AKHIR", { align: AlignmentType.CENTER, size: 20 })],
        }),
      ],
      [LANDSCAPE_WIDTH],
    ),
    para("1. Persentase penilaian mata kuliah mahasiswa mengacu pada CPMK sebagai berikut:"),
  ];

  for (const v of data.variants) {
    const total = v.rows.reduce((s, r) => s + (parseFloat(r.persentase) || 0), 0);
    children.push(
      para(v.judul),
      table(
        [
          new TableRow({
            children: [
              head("No.", { align: AlignmentType.CENTER }),
              head("Elemen Penilaian"),
              head("Rencana Penilaian"),
              head("Persentase", { align: AlignmentType.CENTER }),
            ],
          }),
          ...v.rows.map(
            (r, i) =>
              new TableRow({
                children: [
                  cell(String(i + 1), { align: AlignmentType.CENTER }),
                  cell(r.elemen),
                  cell(r.rencana),
                  cell(r.persentase, { align: AlignmentType.CENTER }),
                ],
              }),
          ),
          new TableRow({
            children: [
              cell("Total Nilai", { span: 3, bold: true }),
              cell(String(total), { bold: true, align: AlignmentType.CENTER }),
            ],
          }),
        ],
        [700, 3400, 3400, 1526],
      ),
      spacer(),
    );
  }

  for (const note of data.variantNotes) children.push(para(note, { size: 18 }));

  const totalAch = data.achievements.reduce((s, a) => s + (parseFloat(a.bobot) || 0), 0);
  children.push(
    pageBreak(),
    para("2. Ketercapaian CPL pada CPMK:"),
    table(
      [
        new TableRow({
          tableHeader: true,
          children: [
            head("Minggu", { align: AlignmentType.CENTER, size: 16 }),
            head("CPL", { size: 16 }),
            head("CPMK", { size: 16 }),
            head("Indikator Penilaian", { size: 16 }),
            head("Bentuk Penilaian", { size: 16 }),
            head("Bobot Nilai (%)", { align: AlignmentType.CENTER, size: 16 }),
            head("Nilai Mahasiswa", { size: 16 }),
            head("Ketercapaian CPL pada CPMK", { size: 16 }),
          ],
        }),
        ...data.achievements.map(
          (a) =>
            new TableRow({
              children: [
                cell(a.minggu, { align: AlignmentType.CENTER, size: 16 }),
                cell(a.cpl, { size: 16 }),
                cell(a.cpmk, { size: 16 }),
                cell(a.indikator, { size: 16 }),
                cell(a.bentuk, { size: 16 }),
                cell(a.bobot, { align: AlignmentType.CENTER, size: 16 }),
                cell(a.nilai, { size: 16 }),
                cell(a.ketercapaian, { align: AlignmentType.CENTER, size: 16 }),
              ],
            }),
        ),
        new TableRow({
          children: [
            cell("Total", { span: 5, bold: true, align: AlignmentType.RIGHT, size: 16 }),
            cell(String(totalAch), { bold: true, align: AlignmentType.CENTER, size: 16 }),
            cell("", { size: 16 }),
            cell("", { size: 16 }),
          ],
        }),
      ],
      [700, 900, 900, 2400, 1300, 800, 900, 1126],
    ),
    spacer(),
    para("Nilai Mata Kuliah (NM)", { bold: true }),
    table(
      [
        new TableRow({
          children: [
            head("Rentang", { align: AlignmentType.CENTER }),
            head("Kategori", { align: AlignmentType.CENTER }),
          ],
        }),
        ...data.gradeScale.map(
          (g) =>
            new TableRow({
              children: [
                cell(g.rentang, { align: AlignmentType.CENTER }),
                cell(g.kategori, { align: AlignmentType.CENTER }),
              ],
            }),
        ),
      ],
      [2500, 2500],
      false,
    ),
  );

  return children;
}

function rubricSection(data: RpsData) {
  currentWidth = LANDSCAPE_WIDTH;
  const rows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: [
        head("No.", { align: AlignmentType.CENTER, size: 16 }),
        head("Aspek", { size: 16 }),
        head("Definisi", { size: 16 }),
        head("Indikator", { size: 16 }),
        head("Sub-Indikator", { size: 16 }),
        head("Rentang Nilai", { align: AlignmentType.CENTER, size: 16 }),
      ],
    }),
  ];
  data.rubric.forEach((r, i) => {
    r.subIndikator.forEach((s, j) => {
      rows.push(
        new TableRow({
          children:
            j === 0
              ? [
                  cell(String(i + 1), {
                    align: AlignmentType.CENTER,
                    rowSpan: r.subIndikator.length,
                    size: 16,
                  }),
                  cell(r.aspek, { rowSpan: r.subIndikator.length, size: 16 }),
                  cell(r.definisi, { rowSpan: r.subIndikator.length, size: 16 }),
                  cell(r.indikator, { rowSpan: r.subIndikator.length, size: 16 }),
                  cell(s.deskripsi, { size: 16 }),
                  cell(s.rentang, { align: AlignmentType.CENTER, size: 16 }),
                ]
              : [
                  cell(s.deskripsi, { size: 16 }),
                  cell(s.rentang, { align: AlignmentType.CENTER, size: 16 }),
                ],
        }),
      );
    });
  });

  const attitudeRows = [
    ["Etika Berkomunikasi", "Berkata sopan dan santun."],
    ["", "Tidak menyela pembicaraan."],
    ["", "Mengucapkan terima kasih setelah menerima bantuan orang lain."],
    ["", "Bersikap ramah dan menghargai pendapat orang lain."],
    ["Kejujuran", "Tidak menyontek dan tidak melakukan plagiarisme."],
    ["", "Mengakui kesalahan atau kekurangan yang dimiliki."],
    ["", "Menyusun laporan berdasarkan data dan sumber yang valid."],
    ["Tanggung Jawab", "Melaksanakan tugas sesuai ketentuan dan tepat waktu."],
    ["", "Menerima risiko dan konsekuensi dari tindakan yang dilakukan."],
    ["", "Tidak menyalahkan pihak lain tanpa bukti yang akurat."],
    ["", "Menggunakan fasilitas pembelajaran dengan baik dan mengembalikannya sesuai ketentuan."],
  ];
  const attitude = table(
    [
      new TableRow({
        tableHeader: true,
        children: [
          head("No.", { align: AlignmentType.CENTER, size: 16 }),
          head("Aspek", { align: AlignmentType.CENTER, size: 16 }),
          head("Definisi", { align: AlignmentType.CENTER, size: 16 }),
          head("Indikator", { align: AlignmentType.CENTER, size: 16 }),
          head("Sub-Indikator", { align: AlignmentType.CENTER, size: 16 }),
          ...["5", "4", "3", "2", "1"].map((n) => head(n, { align: AlignmentType.CENTER, size: 16 })),
        ],
      }),
      ...attitudeRows.map(
        ([indicator, description], index) =>
          new TableRow({
            children: [
              ...(index === 0
                ? [
                    cell("4", { rowSpan: attitudeRows.length, align: AlignmentType.CENTER, size: 16 }),
                    cell("Sikap", { rowSpan: attitudeRows.length, bold: true, size: 16 }),
                    cell("Meliputi nilai sikap mahasiswa dalam berinteraksi dengan dosen, rekan mahasiswa, dan lingkungan kampus.", { rowSpan: attitudeRows.length, size: 16 }),
                  ]
                : []),
              cell(indicator ?? "", { size: 16, align: AlignmentType.CENTER }),
              cell(description ?? "", { size: 16 }),
              ...[0, 1, 2, 3, 4].map(() => cell("", { size: 16 })),
            ],
          }),
      ),
    ],
    [650, 1300, 1900, 1550, 4500, 700, 700, 700, 700, 700],
  );

  const projectRows = [
    ["Perencanaan Proyek", "Kemampuan mahasiswa merancang analisis laporan keuangan perusahaan secara sistematis", "Kejelasan tujuan analisis, ruang lingkup, dan sistematika analisis", "Tujuan sangat jelas, relevan dengan CPMK, dan perencanaan analisis sangat sistematis"],
    ["Berpikir Kritis dan Analitis", "Kemampuan mahasiswa menganalisis laporan keuangan menggunakan data dan metode analisis yang tepat", "Analisis berbasis data laporan keuangan dan metode analisis rasio", "Analisis sangat mendalam, logis, sistematis, dan berbasis data yang akurat"],
    ["Ketepatan Analisis Laporan Keuangan", "Ketepatan mahasiswa dalam melakukan perhitungan dan analisis laporan keuangan", "Akurasi perhitungan rasio dan analisis laporan keuangan", "Perhitungan dan analisis sangat tepat tanpa kesalahan"],
    ["Kualitas Rekomendasi Keputusan", "Kemampuan mahasiswa memberikan rekomendasi keputusan bisnis berdasarkan hasil analisis laporan keuangan", "Relevansi dan kelayakan rekomendasi bisnis", "Rekomendasi sangat aplikatif, realistis, dan berbasis data"],
    ["Kolaborasi Tim dan Presentasi", "Kemampuan mahasiswa bekerja sama dalam tim serta menyajikan hasil analisis secara jelas", "Koordinasi tim dan kualitas presentasi hasil proyek", "Kolaborasi tim sangat baik dan presentasi sangat jelas serta sistematis"],
  ];
  const projectScores = ["81–100", "61–80", "41–60", "0–40"];
  const projectTableRows: TableRow[] = [
    new TableRow({
      tableHeader: true,
      children: ["No.", "Aspek", "Definisi", "Indikator", "Rubrik", "Skor"].map((v) =>
        head(v, { align: AlignmentType.CENTER, size: 16 }),
      ),
    }),
  ];
  projectRows.forEach((r, i) => {
    projectScores.forEach((score, j) => {
      const rubric = j === 0 ? r[3] : j === 1 ? "Cukup baik namun belum mendalam" : j === 2 ? "Masih kurang konsisten" : "Tidak menunjukkan kemampuan yang dinilai";
      projectTableRows.push(
        new TableRow({
          children: [
            ...(j === 0
              ? [
                  cell(String(i + 1), { rowSpan: 4, align: AlignmentType.CENTER, size: 16 }),
                  cell(r[0] ?? "", { rowSpan: 4, bold: true, size: 16 }),
                  cell(r[1] ?? "", { rowSpan: 4, size: 16 }),
                  cell(r[2] ?? "", { rowSpan: 4, size: 16 }),
                ]
              : []),
            cell(rubric ?? "", { size: 16 }),
            cell(score, { align: AlignmentType.CENTER, size: 16 }),
          ],
        }),
      );
    });
  });

  return [
    table(
      [new TableRow({ children: [head("D. PENILAIAN TUGAS", { align: AlignmentType.CENTER, size: 20 })] })],
      [LANDSCAPE_WIDTH],
    ),
    table(
      [new TableRow({ children: [head(data.rubricTitle, { align: AlignmentType.CENTER, size: 20 })] })],
      [LANDSCAPE_WIDTH],
    ),
    table(rows, [650, 1350, 1700, 1600, 7600, 1058]),
    pageBreak(),
    attitude,
    pageBreak(),
    table(
      [
        new TableRow({
          children: [
            head("INSTRUMEN DAN RUBRIK PENILAIAN TUGAS AKTIVITAS PARTISIPATIF DAN HASIL PROYEK", {
              align: AlignmentType.CENTER,
              size: 20,
            }),
          ],
        }),
      ],
      [LANDSCAPE_WIDTH],
    ),
    table(projectTableRows, [650, 1350, 1700, 1600, 7600, 1058]),
    spacer(),
    para("Keterangan :", { bold: true }),
    ...data.rubricNotes.map((n) => para(n, { size: 18, spacing: 20 })),
  ];
}

const A4 = { width: 11906, height: 16838 };
const LANDSCAPE_A4 = { ...A4, orientation: PageOrientation.LANDSCAPE };
const MARGIN = { top: 1000, right: 1000, bottom: 1000, left: 1000 };

export async function buildRpsDocx(data: RpsData): Promise<Blob> {
  let effectiveData = data;
  if (!data.identity.logoDataUrl) {
    const response = await fetch(unblLogo.url);
    const blob = await response.blob();
    const logoDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result ?? ""));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
    effectiveData = { ...data, identity: { ...data.identity, logoDataUrl } };
  }
  const coverLogo = logoParagraph(effectiveData, 210);
  const coverYear = effectiveData.identity.tanggalPenyusunan.match(/\d{4}/)?.[0] ?? "";

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 20 } } } },
    sections: [
      {
        properties: { page: { size: A4, margin: MARGIN } },
        children: [
          para(`RPS Mata Kuliah ${effectiveData.identity.namaMK}`, { size: 24, spacing: 0 }),
          para("Semester Genap TA. 2025/2026", { size: 24, spacing: 0 }),
          ...Array.from({ length: 8 }, () => spacer()),
          para("RENCANA PEMBELAJARAN SEMESTER (RPS)", {
            bold: true,
            size: 28,
            align: AlignmentType.CENTER,
          }),
          ...Array.from({ length: 3 }, () => spacer()),
          ...(coverLogo ? [coverLogo] : []),
          spacer(),
          spacer(),
          para(`MATA KULIAH ${(effectiveData.identity.namaMK || "-").toUpperCase()}`, {
            bold: true,
            size: 32,
            align: AlignmentType.CENTER,
            spacing: 0,
          }),
          para(`(${effectiveData.identity.bobotSKS || "-"} SKS)`, {
            bold: true,
            size: 26,
            align: AlignmentType.CENTER,
            spacing: 0,
          }),
          ...Array.from({ length: 11 }, () => spacer()),
          para(effectiveData.identity.prodi, { bold: true, size: 26, align: AlignmentType.CENTER, spacing: 0 }),
          para(effectiveData.identity.fakultas, { bold: true, size: 26, align: AlignmentType.CENTER, spacing: 0 }),
          para(effectiveData.identity.universitas, { bold: true, size: 26, align: AlignmentType.CENTER, spacing: 0 }),
          spacer(),
          para(coverYear, { bold: true, size: 26, align: AlignmentType.CENTER, spacing: 0 }),
        ],
      },
      {
        properties: { page: { size: LANDSCAPE_A4, margin: MARGIN } },
        children: sectionACore(effectiveData),
      },
      {
        properties: {
          page: {
            size: { ...A4, orientation: PageOrientation.LANDSCAPE },
            margin: MARGIN,
          },
        },
        children: weeklySection(effectiveData),
      },
      {
        properties: { page: { size: LANDSCAPE_A4, margin: MARGIN } },
        children: tasksSection(effectiveData),
      },
      {
        properties: { page: { size: LANDSCAPE_A4, margin: MARGIN } },
        children: finalAssessmentSection(effectiveData),
      },
      {
        properties: { page: { size: LANDSCAPE_A4, margin: MARGIN } },
        children: rubricSection(effectiveData),
      },
    ],
  });

  return Packer.toBlob(doc);
}

export async function downloadRpsDocx(data: RpsData) {
  const blob = await buildRpsDocx(data);
  const name = `RPS_${data.identity.kodeMK || "MK"}_${data.identity.namaMK || "Mata Kuliah"}`
    .replace(/[^\w\-]+/g, "_")
    .slice(0, 80);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.docx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
