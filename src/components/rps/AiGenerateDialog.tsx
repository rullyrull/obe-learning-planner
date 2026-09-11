import { useEffect, useRef, useState } from "react";
import { BookUp, Loader2, Trash2, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRps } from "@/lib/rps/store";
import { generateRpsDraft } from "@/lib/rps/ai.functions";
import { applyAiDraft } from "@/lib/rps/ai-apply";
import {
  extractCurriculumText,
  loadCurriculumRef,
  saveCurriculumRef,
  type CurriculumRef,
} from "@/lib/rps/curriculum";

export function AiGenerateDialog() {
  const { data, set } = useRps();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    namaMK: data.identity.namaMK,
    kodeMK: data.identity.kodeMK,
    sks: data.identity.bobotSKS,
    semester: data.identity.semester,
    prodi: data.identity.prodi,
    fakultas: data.identity.fakultas,
    universitas: data.identity.universitas,
    catatan: "",
  });

  const [ref, setRef] = useState<CurriculumRef | null>(null);
  const [reading, setReading] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setRef(loadCurriculumRef());
  }, []);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setReading(true);
    setError(null);
    try {
      const parsed = await extractCurriculumText(file);
      setRef(parsed);
      saveCurriculumRef(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membaca dokumen.");
    } finally {
      setReading(false);
    }
  }

  function removeRef() {
    setRef(null);
    saveCurriculumRef(null);
  }

  async function handleGenerate() {
    if (!form.namaMK.trim()) {
      setError("Nama mata kuliah wajib diisi.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const draft = await generateRpsDraft({
        data: { ...form, referensi: ref?.text ?? "", referensiNama: ref?.fileName ?? "" },
      });
      set(applyAiDraft(data, draft, form));
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gagal membuat RPS dengan AI.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="mr-1.5 h-4 w-4" />
          Buat dengan AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Buat RPS dengan AI</DialogTitle>
          <DialogDescription>
            Isi data mata kuliah, AI akan menyusun CPL, CPMK, Sub-CPMK, bahan kajian,
            pustaka, rencana 16 minggu, dan rencana tugas. Anda tetap bisa mengeditnya.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3">
          <div className="grid gap-1.5">
            <Label htmlFor="ai-nama">Nama Mata Kuliah *</Label>
            <Input id="ai-nama" placeholder="Analisis Laporan Keuangan" {...field("namaMK")} />
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="grid gap-1.5">
              <Label htmlFor="ai-kode">Kode MK</Label>
              <Input id="ai-kode" {...field("kodeMK")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ai-sks">Bobot SKS</Label>
              <Input id="ai-sks" placeholder="3" {...field("sks")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ai-smt">Semester</Label>
              <Input id="ai-smt" placeholder="5" {...field("semester")} />
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
              <Label htmlFor="ai-prodi">Program Studi</Label>
              <Input id="ai-prodi" {...field("prodi")} />
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="ai-fak">Fakultas</Label>
              <Input id="ai-fak" {...field("fakultas")} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ai-univ">Universitas</Label>
            <Input id="ai-univ" {...field("universitas")} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="ai-catatan">Catatan / Fokus Materi (opsional)</Label>
            <Textarea
              id="ai-catatan"
              rows={3}
              placeholder="Misal: fokus pada analisis rasio dan studi kasus perusahaan Indonesia"
              {...field("catatan")}
            />
          </div>
          <div className="grid gap-1.5 rounded-md border border-border/70 bg-muted/30 p-3">
            <Label>Buku Kurikulum Program Studi (opsional)</Label>
            <p className="text-xs text-muted-foreground">
              Unggah PDF, DOCX, TXT, atau MD. AI akan merujuk isinya saat menyusun CPL,
              CPMK, bahan kajian, dan pustaka.
            </p>
            <input
              ref={fileInput}
              type="file"
              accept=".pdf,.docx,.txt,.md"
              className="hidden"
              onChange={handleFile}
            />
            {ref ? (
              <div className="flex items-center justify-between gap-2 rounded border bg-background px-2.5 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{ref.fileName}</p>
                  <p className="text-xs text-muted-foreground">
                    {ref.chars.toLocaleString("id-ID")} karakter terbaca
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInput.current?.click()}
                    disabled={reading || loading}
                  >
                    Ganti
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={removeRef}
                    disabled={reading || loading}
                    aria-label="Hapus buku kurikulum"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="justify-self-start"
                onClick={() => fileInput.current?.click()}
                disabled={reading || loading}
              >
                {reading ? (
                  <>
                    <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                    Membaca dokumen…
                  </>
                ) : (
                  <>
                    <BookUp className="mr-1.5 h-4 w-4" />
                    Unggah Buku Kurikulum
                  </>
                )}
              </Button>
            )}
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleGenerate} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Menyusun RPS…
              </>
            ) : (
              <>
                <Wand2 className="mr-1.5 h-4 w-4" />
                Buat RPS
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
