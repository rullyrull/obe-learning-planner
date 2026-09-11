import { useCallback, useMemo, useState } from "react";
import {
  FileDown,
  Printer,
  RotateCcw,
  Sparkles,
  Plus,
  Trash2,
  FileEdit,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRps } from "@/lib/rps/store";
import type {
  AchievementRow,
  AssessmentVariant,
  Coded,
  ElementRow,
  Matrix,
  RubricRow,
  RubricSubIndicator,
  TaskRow,
  WeekRow,
} from "@/lib/rps/types";
import { matrixKey, uid } from "@/lib/rps/types";
import { RpsPreview } from "@/components/rps/RpsPreview";
import { downloadRpsDocx } from "@/lib/rps/docx-export";
import { AiGenerateDialog } from "@/components/rps/AiGenerateDialog";


const TAB_LIST = [
  { key: "identitas", label: "Identitas" },
  { key: "capaian", label: "Capaian" },
  { key: "metode", label: "Metode" },
  { key: "deskripsi", label: "Deskripsi" },
  { key: "mingguan", label: "Mingguan" },
  { key: "tugas", label: "Tugas" },
  { key: "penilaian", label: "Penilaian" },
  { key: "rubrik", label: "Rubrik" },
];

function classNames(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function RpsEditor() {
  const { data, update, loadPreset, reset } = useRps();
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const totalBobot = data.weeks.reduce((s, w) => s + (parseFloat(w.bobot) || 0), 0);

  const handleExportWord = useCallback(async () => {
    try {
      await downloadRpsDocx(data);
    } catch (e) {
      console.error(e);
      alert("Gagal mengekspor Word. Coba lagi.");
    }
  }, [data]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <div className="rps-print-app flex h-screen flex-col bg-muted/30">
      {/* Header */}
      <header className="rps-no-print border-b bg-background px-4 py-3 shadow-sm">
        <div className="mx-auto flex max-w-[1920px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground">
              <FileEdit className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold leading-tight sm:text-xl">
                Aplikasi Pembuat RPS
              </h1>
              <p className="truncate text-xs text-muted-foreground sm:text-sm">
                OBE · Pratinjau A4 · Ekspor Word & PDF
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <AiGenerateDialog />
            <Button variant="outline" size="sm" onClick={loadPreset}>
              <Sparkles className="mr-1.5 h-4 w-4" />
              Muat Contoh
            </Button>

            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="mr-1.5 h-4 w-4" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportWord}>
              <FileDown className="mr-1.5 h-4 w-4" />
              Unduh Word
            </Button>
            <Button size="sm" onClick={handlePrint}>
              <Printer className="mr-1.5 h-4 w-4" />
              Cetak PDF
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile toggle */}
      <div className="rps-no-print flex items-center justify-center border-b bg-background p-2 lg:hidden">
        <div className="inline-flex rounded-lg border bg-muted p-1">
          <button
            onClick={() => setMobileTab("form")}
            className={classNames(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              mobileTab === "form" && "bg-background shadow-sm",
            )}
          >
            Formulir
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={classNames(
              "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
              mobileTab === "preview" && "bg-background shadow-sm",
            )}
          >
            Pratinjau
          </button>
        </div>
      </div>

      {/* Main workspace */}
      <main className="rps-print-main flex flex-1 overflow-hidden">
        <section
          className={classNames(
            "rps-no-print flex w-full flex-col border-r bg-background lg:w-[55%] xl:w-[50%]",
            mobileTab === "preview" && "hidden lg:flex",
          )}
        >
          <div className="flex items-center justify-between border-b px-4 py-2">
            <span className="text-xs font-medium text-muted-foreground">
              Total bobot mingguan: {" "}
              <strong className={classNames(totalBobot === 100 ? "text-green-600" : "text-amber-600")}>
                {totalBobot}%
              </strong>
            </span>
            {totalBobot !== 100 && (
              <span className="flex items-center gap-1 text-xs text-amber-600">
                <AlertCircle className="h-3.5 w-3.5" />
                Sebaiknya total 100%
              </span>
            )}
          </div>
          <Tabs defaultValue="identitas" className="flex flex-1 flex-col overflow-hidden">
            <ScrollArea className="border-b">
              <TabsList className="h-auto w-max gap-1 rounded-none bg-transparent p-2">
                {TAB_LIST.map((t) => (
                  <TabsTrigger
                    key={t.key}
                    value={t.key}
                    className="rounded-md px-3 py-1.5 text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground sm:text-sm"
                  >
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
            <div className="flex-1 overflow-hidden">
              <TabsContent value="identitas" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <IdentityTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="capaian" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <CapaianTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="metode" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <MetodeTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="deskripsi" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <DeskripsiTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="mingguan" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <MingguanTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="tugas" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <TugasTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="penilaian" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <PenilaianTab />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="rubrik" className="m-0 h-full data-[state=inactive]:hidden">
                <ScrollArea className="h-full p-4">
                  <RubrikTab />
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </section>

        <section
          className={classNames(
            "rps-print-section hidden flex-1 overflow-auto bg-muted/50 p-4 lg:block",
            mobileTab === "preview" && "flex lg:flex",
          )}
        >
          <div className="rps-print-wrapper mx-auto w-min pb-8 pt-2">
            <RpsPreview data={data} />
          </div>
        </section>
      </main>
    </div>
  );
}

/* ============================================================
   Identity
   ============================================================ */

function IdentityTab() {
  const { data, update } = useRps();
  const { identity } = data;

  const setIdentity = useCallback(
    (patch: Partial<typeof identity>) => {
      update({ identity: { ...identity, ...patch } });
    },
    [identity, update],
  );

  const handleLogo = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onloadend = () => setIdentity({ logoDataUrl: reader.result as string });
      reader.readAsDataURL(file);
    },
    [setIdentity],
  );

  const fields = [
    { key: "kodeMK", label: "Kode MK" },
    { key: "namaMK", label: "Nama Mata Kuliah" },
    { key: "rumpunMK", label: "Rumpun MK" },
    { key: "bobotSKS", label: "Bobot (SKS)" },
    { key: "semester", label: "Semester" },
    { key: "tanggalPenyusunan", label: "Tanggal Penyusunan" },
    { key: "pengembangRPS", label: "Pengembang RPS" },
    { key: "koordinatorMK", label: "Koordinator MK" },
    { key: "kaprodi", label: "Ketua Program Studi" },
    { key: "universitas", label: "Universitas" },
    { key: "fakultas", label: "Fakultas" },
    { key: "prodi", label: "Program Studi" },
  ] as Array<{ key: keyof typeof identity; label: string }>;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <div key={f.key} className="space-y-1.5">
            <Label>{f.label}</Label>
            <Input
              value={identity[f.key]}
              onChange={(e) => setIdentity({ [f.key]: e.target.value } as Partial<typeof identity>)}
            />
          </div>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label>Logo Institusi</Label>
        <Input type="file" accept="image/*" onChange={handleLogo} />
        {identity.logoDataUrl && (
          <div className="mt-2 flex items-center gap-3">
            <img src={identity.logoDataUrl} alt="Logo" className="h-16 w-16 object-contain" />
            <Button variant="ghost" size="sm" onClick={() => setIdentity({ logoDataUrl: "" })}>
              Hapus logo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   Capaian
   ============================================================ */

function CodedListEditor({
  title,
  items,
  onChange,
  kodePlaceholder,
}: {
  title: string;
  items: Coded[];
  onChange: (items: Coded[]) => void;
  kodePlaceholder?: string;
}) {
  const add = () => onChange([...items, { id: uid(), kode: kodePlaceholder || "", deskripsi: "" }]);
  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));
  const updateItem = (id: string, patch: Partial<Coded>) =>
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-[120px_1fr_auto] gap-2">
              <Input
                value={item.kode}
                placeholder="Kode"
                onChange={(e) => updateItem(item.id, { kode: e.target.value })}
              />
              <Textarea
                value={item.deskripsi}
                placeholder="Deskripsi"
                rows={2}
                onChange={(e) => updateItem(item.id, { deskripsi: e.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="shrink-0"
                onClick={() => remove(item.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function MatrixEditor({
  rows,
  cols,
  value,
  onChange,
  rowLabel,
}: {
  rows: Array<{ id: string; kode: string }>;
  cols: Array<{ id: string; kode: string }>;
  value: Matrix;
  onChange: (m: Matrix) => void;
  rowLabel: string;
}) {
  const toggle = (rowKode: string, colKode: string) => {
    const key = matrixKey(rowKode, colKode);
    onChange({ ...value, [key]: !value[key] });
  };

  return (
    <Card>
      <CardContent className="overflow-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left">{rowLabel}</th>
              {cols.map((c) => (
                <th key={c.id} className="px-2 py-2 text-center text-xs">
                  {c.kode}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b last:border-b-0">
                <td className="px-3 py-2 font-medium">{r.kode}</td>
                {cols.map((c) => {
                  const checked = !!value[matrixKey(r.kode, c.kode)];
                  return (
                    <td key={c.id} className="px-2 py-2 text-center">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggle(r.kode, c.kode)}
                        aria-label={`${r.kode} - ${c.kode}`}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

function CapaianTab() {
  const { data, update } = useRps();

  return (
    <div className="space-y-5">
      <CodedListEditor
        title="Capaian Pembelajaran Lulusan (CPL)"
        items={data.cpl}
        onChange={(cpl) => update({ cpl })}
      />
      <CodedListEditor
        title="Capaian Pembelajaran Mata Kuliah (CPMK)"
        items={data.cpmk}
        onChange={(cpmk) => update({ cpmk })}
      />
      <CodedListEditor
        title="Sub-CPMK"
        items={data.subCpmk}
        onChange={(subCpmk) => update({ subCpmk })}
      />

      <MatrixEditor
        rowLabel="CPL"
        rows={data.cpl}
        cols={data.cpmk}
        value={data.cplCpmk}
        onChange={(cplCpmk) => update({ cplCpmk })}
      />
      <MatrixEditor
        rowLabel="Sub-CPMK"
        rows={data.subCpmk}
        cols={data.cpmk}
        value={data.subCpmkCpmk}
        onChange={(subCpmkCpmk) => update({ subCpmkCpmk })}
      />
    </div>
  );
}

/* ============================================================
   Metode Penilaian
   ============================================================ */

function MetodeTab() {
  const { data, update } = useRps();

  return (
    <Card>
      <CardContent className="overflow-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-3 py-2 text-left">Metode Penilaian</th>
              {data.cpmk.map((c) => (
                <th key={c.id} className="px-2 py-2 text-center text-xs">
                  {c.kode}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.metodePenilaian.map((m) => (
              <tr key={m} className="border-b last:border-b-0">
                <td className="px-3 py-2">{m}</td>
                {data.cpmk.map((c) => {
                  const checked = !!data.metodeCpmk[matrixKey(m, c.kode)];
                  return (
                    <td key={c.id} className="px-2 py-2 text-center">
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() =>
                          update({
                            metodeCpmk: {
                              ...data.metodeCpmk,
                              [matrixKey(m, c.kode)]: !checked,
                            },
                          })
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}

/* ============================================================
   Deskripsi & Pustaka
   ============================================================ */

function StringListEditor({
  title,
  items,
  onChange,
  placeholder,
}: {
  title: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
}) {
  const updateItem = (idx: number, val: string) => {
    const next = [...items];
    next[idx] = val;
    onChange(next);
  };
  const add = () => onChange([...items, ""]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));

  return (
    <Card>
      <CardContent className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{title}</h3>
          <Button type="button" variant="outline" size="sm" onClick={add}>
            <Plus className="mr-1 h-4 w-4" />
            Tambah
          </Button>
        </div>
        {items.map((item, idx) => (
          <div key={idx} className="flex gap-2">
            <Textarea
              value={item}
              placeholder={placeholder}
              rows={1}
              onChange={(e) => updateItem(idx, e.target.value)}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => remove(idx)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DeskripsiTab() {
  const { data, update } = useRps();

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Deskripsi Singkat Mata Kuliah</Label>
        <Textarea
          value={data.deskripsi}
          rows={5}
          onChange={(e) => update({ deskripsi: e.target.value })}
        />
      </div>

      <StringListEditor
        title="Bahan Kajian / Materi Pembelajaran"
        items={data.bahanKajian}
        onChange={(bahanKajian) => update({ bahanKajian })}
        placeholder="Masukkan bahan kajian"
      />

      <StringListEditor
        title="Pustaka Utama (U)"
        items={data.pustaka.utama}
        onChange={(utama) => update({ pustaka: { ...data.pustaka, utama } })}
        placeholder="Masukkan pustaka utama"
      />
      <StringListEditor
        title="Pustaka Pendukung (P)"
        items={data.pustaka.pendukung}
        onChange={(pendukung) => update({ pustaka: { ...data.pustaka, pendukung } })}
        placeholder="Masukkan pustaka pendukung"
      />
      <StringListEditor
        title="Pengintegrasian Hasil Penelitian (R)"
        items={data.pustaka.penelitian}
        onChange={(penelitian) => update({ pustaka: { ...data.pustaka, penelitian } })}
        placeholder="Masukkan hasil penelitian"
      />
      <StringListEditor
        title="Pengintegrasian Hasil Pengabdian Kepada Masyarakat (C)"
        items={data.pustaka.pkm}
        onChange={(pkm) => update({ pustaka: { ...data.pustaka, pkm } })}
        placeholder="Masukkan hasil PkM"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Dosen Pengampu</Label>
          <Input value={data.dosenPengampu} onChange={(e) => update({ dosenPengampu: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Mata Kuliah Prasyarat</Label>
          <Input value={data.prasyarat} onChange={(e) => update({ prasyarat: e.target.value })} />
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   Rencana Mingguan
   ============================================================ */

function MingguanTab() {
  const { data, update } = useRps();
  const total = data.weeks.reduce((s, w) => s + (parseFloat(w.bobot) || 0), 0);

  const updateWeek = (id: string, patch: Partial<WeekRow>) => {
    update({
      weeks: data.weeks.map((w) => (w.id === id ? { ...w, ...patch } : w)),
    });
  };

  const columns: Array<{ key: keyof WeekRow; label: string; width?: string }> = [
    { key: "subCpmk", label: "Sub-CPMK", width: "min-w-[240px]" },
    { key: "bahanKajian", label: "Bahan Kajian", width: "min-w-[160px]" },
    { key: "bentukMetode", label: "Bentuk & Metode", width: "min-w-[160px]" },
    { key: "estimasiWaktu", label: "Estimasi Waktu", width: "min-w-[100px]" },
    { key: "pengalamanBelajar", label: "Pengalaman Belajar", width: "min-w-[160px]" },
    { key: "media", label: "Media", width: "min-w-[120px]" },
    { key: "indikator", label: "Indikator", width: "min-w-[160px]" },
    { key: "teknikKriteria", label: "Teknik & Kriteria", width: "min-w-[160px]" },
    { key: "bobot", label: "Bobot %", width: "min-w-[80px]" },
    { key: "pustaka", label: "Pustaka", width: "min-w-[120px]" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Total bobot: {" "}
          <span className={total === 100 ? "text-green-600" : "text-amber-600"}>{total}%</span>
        </span>
      </div>
      <Card>
        <CardContent className="overflow-auto p-0">
          <table className="w-full min-w-[900px] text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="px-2 py-2 text-left">Mg</th>
                {columns.map((c) => (
                  <th key={String(c.key)} className={classNames("px-2 py-2 text-left", c.width)}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.weeks.map((w) => (
                <tr key={w.id} className="border-b last:border-b-0">
                  <td className="px-2 py-1.5 align-top font-medium">{w.minggu}</td>
                  {columns.map((c) => (
                    <td key={String(c.key)} className={classNames("px-1 py-1 align-top", c.width)}>
                      {c.key === "bobot" || c.key === "estimasiWaktu" ? (
                        <Input
                          value={w[c.key]}
                          onChange={(e) => updateWeek(w.id, { [c.key]: e.target.value } as Partial<WeekRow>)}
                          className="h-8 text-xs"
                        />
                      ) : (
                        <Textarea
                          value={w[c.key]}
                          onChange={(e) => updateWeek(w.id, { [c.key]: e.target.value } as Partial<WeekRow>)}
                          rows={2}
                          className="min-h-[40px] resize-y text-xs"
                        />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Rencana Tugas
   ============================================================ */

function TugasTab() {
  const { data, update } = useRps();

  const addTask = () =>
    update({
      tasks: [
        ...data.tasks,
        { id: uid(), minggu: "", namaTugas: "", kemampuan: "", bentuk: "", luaran: "", batasWaktu: "" },
      ],
    });

  const updateTask = (id: string, patch: Partial<TaskRow>) => {
    update({ tasks: data.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
  };

  const removeTask = (id: string) => update({ tasks: data.tasks.filter((t) => t.id !== id) });

  const cols: Array<{ key: keyof TaskRow; label: string; width?: string }> = [
    { key: "minggu", label: "Minggu", width: "min-w-[80px]" },
    { key: "namaTugas", label: "Nama Tugas & Evaluasi", width: "min-w-[200px]" },
    { key: "kemampuan", label: "Kemampuan yang Diukur", width: "min-w-[200px]" },
    { key: "bentuk", label: "Bentuk/Cara Pengerjaan", width: "min-w-[200px]" },
    { key: "luaran", label: "Luaran", width: "min-w-[160px]" },
    { key: "batasWaktu", label: "Batas Waktu", width: "min-w-[120px]" },
  ];

  return (
    <div className="space-y-3">
      <Button type="button" variant="outline" size="sm" onClick={addTask}>
        <Plus className="mr-1 h-4 w-4" />
        Tambah Tugas
      </Button>
      <Card>
        <CardContent className="overflow-auto p-0">
          <table className="w-full min-w-[900px] text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {cols.map((c) => (
                  <th key={String(c.key)} className={classNames("px-2 py-2 text-left", c.width)}>
                    {c.label}
                  </th>
                ))}
                <th className="w-10 px-2 py-2" />
              </tr>
            </thead>
            <tbody>
              {data.tasks.map((t) => (
                <tr key={t.id} className="border-b last:border-b-0">
                  {cols.map((c) => (
                    <td key={String(c.key)} className={classNames("px-1 py-1 align-top", c.width)}>
                      <Input
                        value={t[c.key]}
                        onChange={(e) => updateTask(t.id, { [c.key]: e.target.value } as Partial<TaskRow>)}
                        className="h-8 text-xs"
                      />
                    </td>
                  ))}
                  <td className="px-1 py-1 align-top">
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeTask(t.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Penilaian Akhir
   ============================================================ */

function VariantEditor({
  index,
  totalAll,
}: {
  index: number;
  totalAll: (idx: number) => number;
}) {
  const { data, update } = useRps();
  const variant = data.variants[index];
  if (!variant) return null;

  const updateVariant = (patch: Partial<AssessmentVariant>) => {
    const next = [...data.variants];
    next[index] = { ...variant, ...patch };
    update({ variants: next });
  };

  const addRow = () =>
    updateVariant({
      rows: [...variant.rows, { id: uid(), elemen: "", rencana: "", persentase: "" }],
    });

  const updateRow = (id: string, patch: Partial<ElementRow>) => {
    updateVariant({
      rows: variant.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    });
  };

  const removeRow = (id: string) => {
    updateVariant({ rows: variant.rows.filter((r) => r.id !== id) });
  };

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <Input
            value={variant.judul}
            onChange={(e) => updateVariant({ judul: e.target.value })}
            className="font-medium"
          />
          <span className="ml-3 shrink-0 text-sm">
            Total: {" "}
            <strong className={totalAll(index) === 100 ? "text-green-600" : "text-amber-600"}>
              {totalAll(index)}%
            </strong>
          </span>
        </div>
        <div className="space-y-2">
          {variant.rows.map((r) => (
            <div key={r.id} className="grid grid-cols-[1fr_1fr_100px_auto] gap-2">
              <Input
                value={r.elemen}
                placeholder="Elemen penilaian"
                onChange={(e) => updateRow(r.id, { elemen: e.target.value })}
              />
              <Input
                value={r.rencana}
                placeholder="Rencana penilaian"
                onChange={(e) => updateRow(r.id, { rencana: e.target.value })}
              />
              <Input
                value={r.persentase}
                placeholder="%"
                onChange={(e) => updateRow(r.id, { persentase: e.target.value })}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeRow(r.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="mr-1 h-4 w-4" />
          Tambah Baris
        </Button>
      </CardContent>
    </Card>
  );
}

function AchievementEditor() {
  const { data, update } = useRps();
  const total = data.achievements.reduce((s, a) => s + (parseFloat(a.bobot) || 0), 0);

  const updateAchievement = (id: string, patch: Partial<AchievementRow>) => {
    update({
      achievements: data.achievements.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    });
  };

  const cols: Array<{ key: keyof AchievementRow; label: string; width?: string; center?: boolean }> = [
    { key: "minggu", label: "Minggu", width: "min-w-[70px]", center: true },
    { key: "cpl", label: "CPL", width: "min-w-[100px]" },
    { key: "cpmk", label: "CPMK", width: "min-w-[100px]" },
    { key: "indikator", label: "Indikator Penilaian", width: "min-w-[200px]" },
    { key: "bentuk", label: "Bentuk Penilaian", width: "min-w-[140px]" },
    { key: "bobot", label: "Bobot (%)", width: "min-w-[80px]", center: true },
    { key: "nilai", label: "Nilai", width: "min-w-[70px]", center: true },
    { key: "ketercapaian", label: "Ketercapaian", width: "min-w-[140px]" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">
          Total bobot: {" "}
          <span className={total === 100 ? "text-green-600" : "text-amber-600"}>{total}%</span>
        </span>
      </div>
      <Card>
        <CardContent className="overflow-auto p-0">
          <table className="w-full min-w-[900px] text-xs">
            <thead>
              <tr className="border-b bg-muted/50">
                {cols.map((c) => (
                  <th
                    key={String(c.key)}
                    className={classNames("px-2 py-2", c.center ? "text-center" : "text-left", c.width)}
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.achievements.map((a) => (
                <tr key={a.id} className="border-b last:border-b-0">
                  {cols.map((c) => (
                    <td key={String(c.key)} className={classNames("px-1 py-1 align-top", c.width)}>
                      <Input
                        value={a[c.key]}
                        onChange={(e) =>
                          updateAchievement(a.id, { [c.key]: e.target.value } as Partial<AchievementRow>)
                        }
                        className={classNames("h-8 text-xs", c.center && "text-center")}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function PenilaianTab() {
  const { data, update } = useRps();

  const totalFor = useCallback(
    (idx: number) =>
      data.variants[idx]?.rows.reduce((s, r) => s + (parseFloat(r.persentase) || 0), 0) ?? 0,
    [data.variants],
  );

  const updateScale = (id: string, patch: Partial<{ rentang: string; kategori: string }>) => {
    update({
      gradeScale: data.gradeScale.map((g) => (g.id === id ? { ...g, ...patch } : g)),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="font-semibold">Persentase Penilaian per CPMK</h3>
        {data.variants.map((v, idx) => (
          <VariantEditor key={v.id} index={idx} totalAll={totalFor} />
        ))}
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Catatan Varian</h3>
        <StringListEditor
          title=""
          items={data.variantNotes}
          onChange={(variantNotes) => update({ variantNotes })}
          placeholder="Catatan untuk varian penilaian"
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold">Ketercapaian CPL pada CPMK</h3>
        <AchievementEditor />
      </div>

      <Card>
        <CardContent className="space-y-3 p-4">
          <h3 className="font-semibold">Skala Nilai Mata Kuliah</h3>
          <div className="grid grid-cols-2 gap-3">
            {data.gradeScale.map((g) => (
              <div key={g.id} className="flex gap-2">
                <Input
                  value={g.rentang}
                  placeholder="Rentang"
                  onChange={(e) => updateScale(g.id, { rentang: e.target.value })}
                />
                <Input
                  value={g.kategori}
                  placeholder="Kategori"
                  onChange={(e) => updateScale(g.id, { kategori: e.target.value })}
                  className="w-24"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
   Rubrik
   ============================================================ */

function RubrikTab() {
  const { data, update } = useRps();

  const updateRubricTitle = (title: string) => update({ rubricTitle: title });

  const addRubric = () =>
    update({
      rubric: [
        ...data.rubric,
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
    });

  const updateRubric = (id: string, patch: Partial<RubricRow>) => {
    update({ rubric: data.rubric.map((r) => (r.id === id ? { ...r, ...patch } : r)) });
  };

  const removeRubric = (id: string) => update({ rubric: data.rubric.filter((r) => r.id !== id) });

  const updateSub = (rubricId: string, subId: string, patch: Partial<RubricSubIndicator>) => {
    updateRubric(rubricId, {
      subIndikator: data.rubric
        .find((r) => r.id === rubricId)!
        .subIndikator.map((s) => (s.id === subId ? { ...s, ...patch } : s)),
    });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label>Judul Rubrik</Label>
        <Input value={data.rubricTitle} onChange={(e) => updateRubricTitle(e.target.value)} />
      </div>

      <div className="space-y-3">
        {data.rubric.map((r) => (
          <Card key={r.id}>
            <CardContent className="space-y-3 p-4">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <Input
                  value={r.aspek}
                  placeholder="Aspek"
                  onChange={(e) => updateRubric(r.id, { aspek: e.target.value })}
                />
                <Input
                  value={r.definisi}
                  placeholder="Definisi"
                  onChange={(e) => updateRubric(r.id, { definisi: e.target.value })}
                />
                <Input
                  value={r.indikator}
                  placeholder="Indikator"
                  onChange={(e) => updateRubric(r.id, { indikator: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                {r.subIndikator.map((s) => (
                  <div key={s.id} className="flex gap-2">
                    <Input
                      value={s.deskripsi}
                      placeholder={`Sub-indikator (${s.rentang})`}
                      onChange={(e) => updateSub(r.id, s.id, { deskripsi: e.target.value })}
                      className="flex-1"
                    />
                    <Input
                      value={s.rentang}
                      placeholder="Rentang"
                      onChange={(e) => updateSub(r.id, s.id, { rentang: e.target.value })}
                      className="w-28"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button type="button" variant="ghost" size="sm" onClick={() => removeRubric(r.id)}>
                  <Trash2 className="mr-1 h-4 w-4 text-destructive" />
                  Hapus Aspek
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Button type="button" variant="outline" size="sm" onClick={addRubric}>
        <Plus className="mr-1 h-4 w-4" />
        Tambah Aspek Rubrik
      </Button>

      <StringListEditor
        title="Keterangan Skala"
        items={data.rubricNotes}
        onChange={(rubricNotes) => update({ rubricNotes })}
        placeholder="Contoh: Skala 1 : Rentang Nilai 0 – 20"
      />
    </div>
  );
}
