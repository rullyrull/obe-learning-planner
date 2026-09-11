export type CurriculumRef = {
  fileName: string;
  chars: number;
  text: string;
};

const STORAGE_KEY = "rps-curriculum-ref";
export const MAX_REF_CHARS = 24000;

function clean(text: string) {
  return text.replace(/\r/g, "").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim();
}

async function readPdf(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");
  const worker = await import("pdfjs-dist/build/pdf.worker.mjs?url");
  pdfjs.GlobalWorkerOptions.workerSrc = worker.default;
  const buffer = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
  const parts: string[] = [];
  const limit = Math.min(doc.numPages, 120);
  for (let i = 1; i <= limit; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    parts.push(
      content.items
        .map((item) => ("str" in item ? item.str : ""))
        .join(" "),
    );
    if (parts.join("\n").length > MAX_REF_CHARS * 2) break;
  }
  return parts.join("\n");
}

async function readDocx(file: File): Promise<string> {
  const mammoth = await import("mammoth/mammoth.browser");
  const buffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer: buffer });
  return result.value;
}

export async function extractCurriculumText(file: File): Promise<CurriculumRef> {
  const name = file.name.toLowerCase();
  let raw = "";
  if (name.endsWith(".pdf")) raw = await readPdf(file);
  else if (name.endsWith(".docx")) raw = await readDocx(file);
  else if (name.endsWith(".txt") || name.endsWith(".md")) raw = await file.text();
  else throw new Error("Format tidak didukung. Gunakan PDF, DOCX, TXT, atau MD.");

  const text = clean(raw);
  if (!text) {
    throw new Error(
      "Tidak ada teks yang terbaca. Kemungkinan dokumen berupa hasil pindaian (gambar).",
    );
  }
  return { fileName: file.name, chars: text.length, text: text.slice(0, MAX_REF_CHARS) };
}

export function loadCurriculumRef(): CurriculumRef | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CurriculumRef) : null;
  } catch {
    return null;
  }
}

export function saveCurriculumRef(ref: CurriculumRef | null) {
  if (typeof window === "undefined") return;
  try {
    if (ref) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ref));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* kuota penuh */
  }
}
