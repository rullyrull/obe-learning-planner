import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { RpsData } from "./types";
import { uid } from "./types";
import { METODE_PENILAIAN, presetRps } from "./preset";

const STORAGE_KEY = "rps-obe-data-v1";

export const emptyRps = (): RpsData => ({
  identity: {
    kodeMK: "",
    namaMK: "",
    rumpunMK: "",
    bobotSKS: "",
    semester: "",
    tanggalPenyusunan: "",
    pengembangRPS: "",
    koordinatorMK: "",
    kaprodi: "",
    universitas: "UNIVERSITAS BORNEO LESTARI",
    fakultas: "FAKULTAS ILMU SOSIAL DAN HUMANIORA",
    prodi: "PROGRAM STUDI SARJANA BISNIS DIGITAL",
    logoDataUrl: "",
  },
  cpl: [{ id: uid(), kode: "CPL-01", deskripsi: "" }],
  cpmk: [{ id: uid(), kode: "CPMK-01", deskripsi: "" }],
  subCpmk: [{ id: uid(), kode: "Sub CPMK-01", deskripsi: "" }],
  cplCpmk: {},
  subCpmkCpmk: {},
  metodePenilaian: [...METODE_PENILAIAN],
  metodeCpmk: {},
  deskripsi: "",
  bahanKajian: [""],
  pustaka: { utama: [""], pendukung: [""], penelitian: [""], pkm: [""] },
  dosenPengampu: "",
  prasyarat: "",
  weeks: Array.from({ length: 16 }, (_, i) => ({
    id: uid(),
    minggu: String(i + 1),
    subCpmk: "",
    bahanKajian: "",
    bentukMetode: "",
    estimasiWaktu: "170",
    pengalamanBelajar: "",
    media: "",
    indikator: "",
    teknikKriteria: "",
    bobot: "",
    pustaka: "",
  })),
  tasks: [
    {
      id: uid(),
      minggu: "",
      namaTugas: "",
      kemampuan: "",
      bentuk: "",
      luaran: "",
      batasWaktu: "",
    },
  ],
  variants: [
    {
      id: uid(),
      judul: "a. Rencana penilaian mata kuliah",
      rows: [{ id: uid(), elemen: "", rencana: "", persentase: "" }],
    },
  ],
  variantNotes: [],
  achievements: Array.from({ length: 16 }, (_, i) => ({
    id: uid(),
    minggu: String(i + 1),
    cpl: "",
    cpmk: "",
    indikator: "",
    bentuk: "",
    bobot: "",
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
      aspek: "",
      definisi: "",
      indikator: "",
      subIndikator: [
        { id: uid(), deskripsi: "", rentang: "81–100" },
        { id: uid(), deskripsi: "", rentang: "61–80" },
        { id: uid(), deskripsi: "", rentang: "41–60" },
        { id: uid(), deskripsi: "", rentang: "21–40" },
        { id: uid(), deskripsi: "", rentang: "0–20" },
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

type Ctx = {
  data: RpsData;
  update: (patch: Partial<RpsData>) => void;
  set: (next: RpsData) => void;
  loadPreset: () => void;
  reset: () => void;
};

const RpsContext = createContext<Ctx | null>(null);

export function RpsProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<RpsData>(() => emptyRps());

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setData(JSON.parse(raw) as RpsData);
    } catch {
      /* ignore corrupt storage */
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* storage full or unavailable */
    }
  }, [data]);

  const update = useCallback((patch: Partial<RpsData>) => {
    setData((prev) => ({ ...prev, ...patch }));
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      data,
      update,
      set: setData,
      loadPreset: () => setData(presetRps()),
      reset: () => setData(emptyRps()),
    }),
    [data, update],
  );

  return <RpsContext.Provider value={value}>{children}</RpsContext.Provider>;
}

export function useRps() {
  const ctx = useContext(RpsContext);
  if (!ctx) throw new Error("useRps must be used inside RpsProvider");
  return ctx;
}
