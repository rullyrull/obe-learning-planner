import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  namaMK: z.string().min(1),
  kodeMK: z.string().optional().default(""),
  sks: z.string().optional().default(""),
  semester: z.string().optional().default(""),
  prodi: z.string().optional().default(""),
  fakultas: z.string().optional().default(""),
  universitas: z.string().optional().default(""),
  catatan: z.string().optional().default(""),
  referensiNama: z.string().optional().default(""),
  referensi: z.string().max(30000).optional().default(""),
});

export type AiRpsDraft = {
  deskripsi: string;
  cpl: { kode: string; deskripsi: string }[];
  cpmk: { kode: string; deskripsi: string; cplKode: string[] }[];
  subCpmk: { kode: string; deskripsi: string; cpmkKode: string }[];
  bahanKajian: string[];
  pustaka: {
    utama: string[];
    pendukung: string[];
  };
  weeks: {
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
  }[];
  tasks: {
    minggu: string;
    namaTugas: string;
    kemampuan: string;
    bentuk: string;
    luaran: string;
    batasWaktu: string;
  }[];
};

const SYSTEM = `Anda adalah pakar kurikulum perguruan tinggi Indonesia yang menyusun RPS
(Rencana Pembelajaran Semester) berbasis OBE sesuai panduan Kemendikbud.
Jawab HANYA dengan JSON valid (tanpa markdown, tanpa penjelasan) mengikuti bentuk:
{
 "deskripsi": string,
 "cpl": [{"kode":"CPL-01","deskripsi":string}],
 "cpmk": [{"kode":"CPMK-01","deskripsi":string,"cplKode":["CPL-01"]}],
 "subCpmk": [{"kode":"Sub CPMK-01","deskripsi":string,"cpmkKode":"CPMK-01"}],
 "bahanKajian": [string],
 "pustaka": {"utama":[string],"pendukung":[string]},
 "weeks": [{"minggu":"1","subCpmk":string,"bahanKajian":string,"bentukMetode":string,
   "estimasiWaktu":"170","pengalamanBelajar":string,"media":string,"indikator":string,
   "teknikKriteria":string,"bobot":string,"pustaka":string}],
 "tasks": [{"minggu":string,"namaTugas":string,"kemampuan":string,"bentuk":string,
   "luaran":string,"batasWaktu":string}]
}
Aturan: 4-6 CPL, 4-6 CPMK, 8-10 Sub-CPMK, 8-12 bahan kajian, tepat 16 baris weeks
(minggu 1..16, minggu 8 = Ujian Tengah Semester, minggu 16 = Ujian Akhir Semester),
total bobot weeks = 100, 6-10 tasks. Semua teks dalam bahasa Indonesia akademik.`;

function extractJson(text: string): unknown {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("Model tidak mengembalikan JSON.");
  return JSON.parse(cleaned.slice(start, end + 1));
}

export const generateRpsDraft = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }): Promise<AiRpsDraft> => {
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) throw new Error("Kunci AI belum tersedia.");

    const prompt = `Susun isi RPS untuk mata kuliah berikut:
Nama MK: ${data.namaMK}
Kode MK: ${data.kodeMK || "-"}
Bobot SKS: ${data.sks || "-"}
Semester: ${data.semester || "-"}
Program Studi: ${data.prodi || "-"}
Fakultas: ${data.fakultas || "-"}
Universitas: ${data.universitas || "-"}
Catatan tambahan: ${data.catatan || "-"}${
      data.referensi
        ? `

Gunakan kutipan Buku Kurikulum Program Studi berikut sebagai acuan utama${
            data.referensiNama ? ` (sumber: ${data.referensiNama})` : ""
          }. Selaraskan rumusan CPL, CPMK, Sub-CPMK, bahan kajian, dan pustaka dengan isi dokumen ini; jangan mengarang CPL yang tidak sejalan dengannya:
"""
${data.referensi}
"""`
        : ""
    }`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        stream: true,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const body = await res.text().catch(() => "");
      if (res.status === 429) throw new Error("AI sedang sibuk. Coba lagi sebentar.");
      if (res.status === 402)
        throw new Error("Kredit AI habis. Tambahkan kredit pada workspace Lovable.");
      if (res.status === 403)
        throw new Error("Penggunaan AI diblokir oleh pengaturan workspace.");
      throw new Error(`Gagal memanggil AI (${res.status}). ${body.slice(0, 200)}`);
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const parsed = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[];
          };
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) text += delta;
        } catch {
          /* partial frame */
        }
      }
    }

    const json = extractJson(text) as AiRpsDraft;
    return {
      deskripsi: json.deskripsi ?? "",
      cpl: json.cpl ?? [],
      cpmk: json.cpmk ?? [],
      subCpmk: json.subCpmk ?? [],
      bahanKajian: json.bahanKajian ?? [],
      pustaka: {
        utama: json.pustaka?.utama ?? [],
        pendukung: json.pustaka?.pendukung ?? [],
      },
      weeks: json.weeks ?? [],
      tasks: json.tasks ?? [],
    };
  });
