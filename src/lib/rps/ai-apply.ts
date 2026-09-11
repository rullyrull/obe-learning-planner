import type { AiRpsDraft } from "./ai.functions";
import type { Matrix, RpsData, TaskRow, WeekRow } from "./types";
import { matrixKey, uid } from "./types";

type FormInfo = {
  namaMK: string;
  kodeMK: string;
  sks: string;
  semester: string;
  prodi: string;
  fakultas: string;
  universitas: string;
};

/** Merge an AI-generated draft into the current RPS state, keeping ids stable-ish. */
export function applyAiDraft(current: RpsData, draft: AiRpsDraft, info: FormInfo): RpsData {
  const cpl = draft.cpl.map((c) => ({ id: uid(), kode: c.kode, deskripsi: c.deskripsi }));
  const cpmk = draft.cpmk.map((c) => ({ id: uid(), kode: c.kode, deskripsi: c.deskripsi }));
  const subCpmk = draft.subCpmk.map((c) => ({
    id: uid(),
    kode: c.kode,
    deskripsi: c.deskripsi,
  }));

  const cplCpmk: Matrix = {};
  draft.cpmk.forEach((c) => {
    (c.cplKode ?? []).forEach((cplKode) => {
      cplCpmk[matrixKey(cplKode, c.kode)] = true;
    });
  });

  const subCpmkCpmk: Matrix = {};
  draft.subCpmk.forEach((s) => {
    if (s.cpmkKode) subCpmkCpmk[matrixKey(s.kode, s.cpmkKode)] = true;
  });

  const weeks: WeekRow[] = Array.from({ length: 16 }, (_, i) => {
    const src = draft.weeks[i];
    return {
      id: uid(),
      minggu: String(i + 1),
      subCpmk: src?.subCpmk ?? "",
      bahanKajian: src?.bahanKajian ?? "",
      bentukMetode: src?.bentukMetode ?? "",
      estimasiWaktu: src?.estimasiWaktu ?? "170",
      pengalamanBelajar: src?.pengalamanBelajar ?? "",
      media: src?.media ?? "",
      indikator: src?.indikator ?? "",
      teknikKriteria: src?.teknikKriteria ?? "",
      bobot: src?.bobot ?? "",
      pustaka: src?.pustaka ?? "",
    };
  });

  const tasks: TaskRow[] = (draft.tasks.length ? draft.tasks : [null]).map((t) => ({
    id: uid(),
    minggu: t?.minggu ?? "",
    namaTugas: t?.namaTugas ?? "",
    kemampuan: t?.kemampuan ?? "",
    bentuk: t?.bentuk ?? "",
    luaran: t?.luaran ?? "",
    batasWaktu: t?.batasWaktu ?? "",
  }));

  const achievements = weeks.map((w, i) => {
    const prev = current.achievements[i];
    return {
      id: uid(),
      minggu: w.minggu,
      cpl: prev?.cpl ?? "",
      cpmk: prev?.cpmk ?? "",
      indikator: w.indikator,
      bentuk: w.teknikKriteria,
      bobot: w.bobot,
      nilai: "",
      ketercapaian: "Tercapai / Tidak",
    };
  });

  return {
    ...current,
    identity: {
      ...current.identity,
      namaMK: info.namaMK || current.identity.namaMK,
      kodeMK: info.kodeMK || current.identity.kodeMK,
      bobotSKS: info.sks || current.identity.bobotSKS,
      semester: info.semester || current.identity.semester,
      prodi: info.prodi || current.identity.prodi,
      fakultas: info.fakultas || current.identity.fakultas,
      universitas: info.universitas || current.identity.universitas,
    },
    cpl: cpl.length ? cpl : current.cpl,
    cpmk: cpmk.length ? cpmk : current.cpmk,
    subCpmk: subCpmk.length ? subCpmk : current.subCpmk,
    cplCpmk,
    subCpmkCpmk,
    deskripsi: draft.deskripsi || current.deskripsi,
    bahanKajian: draft.bahanKajian.length ? draft.bahanKajian : current.bahanKajian,
    pustaka: {
      ...current.pustaka,
      utama: draft.pustaka.utama.length ? draft.pustaka.utama : current.pustaka.utama,
      pendukung: draft.pustaka.pendukung.length
        ? draft.pustaka.pendukung
        : current.pustaka.pendukung,
    },
    weeks,
    tasks,
    achievements,
  };
}
