import type { RpsData } from "@/lib/rps/types";
import { matrixKey } from "@/lib/rps/types";
import {
  BENTUK_METODE_GROUPS,
  MEDIA_GROUPS,
  PENILAIAN_GROUPS,
  resolveChecklist,
  type ChecklistGroup,
} from "@/lib/rps/checklist";
import unblLogo from "@/assets/unbl-logo.png.asset.json";

const ChecklistCell = ({ groups, text }: { groups: ChecklistGroup[]; text: string }) => (
  <div className="rps-checklist">
    {resolveChecklist(groups, text).map((g, gi) => (
      <div key={gi}>
        {g.title ? <div className="rps-checklist-title">{g.title}</div> : null}
        {g.options.map((opt) => (
          <div key={opt.label} className="rps-checklist-row">
            <span className="rps-checklist-mark">{opt.checked ? "\u2713" : ""}</span>
            <span className="rps-checklist-box">{opt.label}</span>
          </div>
        ))}
      </div>
    ))}
  </div>
);

const Kop = ({ data }: { data: RpsData }) => (
  <div className="rps-kop">
    <img src={data.identity.logoDataUrl || unblLogo.url} alt="Logo institusi" className="rps-logo" />
    <div className="rps-kop-text">
      <div>{data.identity.fakultas || "FAKULTAS"}</div>
      <div>{data.identity.prodi || "PROGRAM STUDI"}</div>
      <div className="rps-kop-univ">{data.identity.universitas || "UNIVERSITAS"}</div>
    </div>
  </div>
);

const Multiline = ({ text }: { text: string }) => (
  <>
    {(text || "").split("\n").map((line, i) => (
      <div key={i}>{line || "\u00A0"}</div>
    ))}
  </>
);

const Check = ({ on }: { on: boolean }) => (
  <span className="rps-check">{on ? "\u2713" : ""}</span>
);

export function RpsPreview({ data }: { data: RpsData }) {
  const { identity } = data;
  const logoSrc = identity.logoDataUrl || unblLogo.url;
  const year = identity.tanggalPenyusunan.match(/\d{4}/)?.[0] || new Date().getFullYear();
  const totalBobot = data.weeks.reduce((s, w) => s + (parseFloat(w.bobot) || 0), 0);
  const totalAchievement = data.achievements.reduce(
    (s, a) => s + (parseFloat(a.bobot) || 0),
    0,
  );
  const pustakaGroups: Array<[string, string[], string]> = [
    ["Utama (U):", data.pustaka.utama, "U"],
    ["Pendukung (P):", data.pustaka.pendukung, "P"],
    ["Pengintegrasian Hasil Penelitian (R):", data.pustaka.penelitian, "R"],
    ["Pengintegrasian Hasil Pengabdian Kepada Masyarakat (C):", data.pustaka.pkm, "C"],
  ];

  return (
    <div className="rps-doc" id="rps-print-area">
      {/* ---------- Halaman judul ---------- */}
      <section className="rps-page rps-cover">
        <div className="rps-cover-note">
          <div>RPS Mata Kuliah {identity.namaMK || "-"}</div>
          <div>Semester Genap TA. 2025/2026</div>
        </div>
        <h1 className="rps-cover-title">RENCANA PEMBELAJARAN SEMESTER (RPS)</h1>
        <img src={logoSrc} alt="Logo institusi" className="rps-cover-logo" />
        <div className="rps-cover-mk">
          <div>MATA KULIAH {(identity.namaMK || "-").toUpperCase()}</div>
          <div>({identity.bobotSKS || "-"} SKS)</div>
        </div>
        <div className="rps-cover-foot">
          <div>{identity.prodi || "PROGRAM STUDI"}</div>
          <div>{identity.fakultas || "FAKULTAS"}</div>
          <div>{identity.universitas || "UNIVERSITAS"}</div>
          <div className="rps-cover-year">{year}</div>
        </div>
      </section>

      {/* ---------- Bagian A ---------- */}
      <section className="rps-page">
        <Kop data={data} />
        <table className="rps-table">
          <tbody>
            <tr>
              <th colSpan={6} className="rps-section-head rps-section-head-left">
                A. RENCANANA PEMBELAJARAN SEMESTER
              </th>
            </tr>
            <tr className="rps-center">
              <th>Kode MK</th>
              <th>Nama Mata Kuliah (MK)</th>
              <th>Rumpun MK</th>
              <th>Bobot (SKS)</th>
              <th>Semester</th>
              <th>Tanggal Penyusunan</th>
            </tr>
            <tr className="rps-center">
              <td>{identity.kodeMK}</td>
              <td>{identity.namaMK}</td>
              <td>{identity.rumpunMK}</td>
              <td>{identity.bobotSKS}</td>
              <td>{identity.semester}</td>
              <td>{identity.tanggalPenyusunan}</td>
            </tr>
            <tr className="rps-center">
              <th>Otorisasi</th>
              <th colSpan={2}>Pengembang RPS</th>
              <th>Koordinator MK</th>
              <th colSpan={2}>Ketua Program Studi</th>
            </tr>
            <tr className="rps-center">
              <td />
              <td colSpan={2}>{identity.pengembangRPS}</td>
              <td>{identity.koordinatorMK}</td>
              <td colSpan={2}>{identity.kaprodi}</td>
            </tr>
            <tr>
              <th>
                Learning Outcomes (LO)/ Capaian Pembelajaran Lulusan (CPL) Prodi yang Dibebankan
                Pada MK
              </th>
              <th colSpan={5}>CPL yang dibebankan pada MK :</th>
            </tr>
            {data.cpl.map((c) => (
              <tr key={c.id}>
                <td className="rps-code">{c.kode}</td>
                <td colSpan={5}>{c.deskripsi}</td>
              </tr>
            ))}
            <tr>
              <th>Capaian Pembelajaran Mata Kuliah (CPMK)</th>
              <th colSpan={5}>
                CPL dijabarkan pada CPMK berikut, yaitu setelah menyelesaikan pembelajaran mata
                kuliah.
              </th>
            </tr>
            {data.cpmk.map((c) => (
              <tr key={c.id}>
                <td className="rps-code">{c.kode}</td>
                <td colSpan={5}>{c.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="rps-table rps-matrix">
          <tbody>
            <tr>
              <th>Pemetaan CPL dengan CPMK</th>
              {data.cpmk.map((c) => (
                <th key={c.id}>{c.kode}</th>
              ))}
            </tr>
            {data.cpl.map((row) => (
              <tr key={row.id}>
                <td className="rps-code">{row.kode}</td>
                {data.cpmk.map((col) => (
                  <td key={col.id} className="rps-center">
                    <Check on={!!data.cplCpmk[matrixKey(row.kode, col.kode)]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table className="rps-table rps-subcpmk">
          <tbody>
            <tr>
              <th colSpan={2}>
                Sub-CPMK — Kemampuan Akhir Tiap Tahapan Belajar MK (Sub-CPMK) :
              </th>
            </tr>
            {data.subCpmk.map((s) => (
              <tr key={s.id}>
                <td className="rps-code">{s.kode}</td>
                <td>{s.deskripsi}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="rps-table rps-matrix">
          <tbody>
            <tr>
              <th>Korelasi CPMK terhadap Sub-CPMK</th>
              {data.cpmk.map((c) => (
                <th key={c.id}>{c.kode}</th>
              ))}
            </tr>
            {data.subCpmk.map((row) => (
              <tr key={row.id}>
                <td className="rps-code">{row.kode}</td>
                {data.cpmk.map((col) => (
                  <td key={col.id} className="rps-center">
                    <Check on={!!data.subCpmkCpmk[matrixKey(row.kode, col.kode)]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table className="rps-table rps-matrix">
          <tbody>
            <tr>
              <th>Metode Penilaian dan Kaitannya dengan CPMK</th>
              {data.cpmk.map((c) => (
                <th key={c.id}>{c.kode}</th>
              ))}
            </tr>
            {data.metodePenilaian.map((m) => (
              <tr key={m}>
                <td>{m}</td>
                {data.cpmk.map((col) => (
                  <td key={col.id} className="rps-center">
                    <Check on={!!data.metodeCpmk[matrixKey(m, col.kode)]} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <table className="rps-table">
          <tbody>
            <tr>
              <th className="rps-label">Deskripsi Singkat Mata Kuliah</th>
              <td>{data.deskripsi}</td>
            </tr>
            <tr>
              <th className="rps-label">Bahan Kajian / Materi Pembelajaran</th>
              <td>
                <ol className="rps-ol">
                  {data.bahanKajian.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ol>
              </td>
            </tr>
            <tr>
              <th className="rps-label">Pustaka</th>
              <td>
                {pustakaGroups.map(([label, items, prefix]) => (
                  <div key={label} className="rps-pustaka-group">
                    <div className="rps-pustaka-label">{label}</div>
                    {items
                      .filter((x) => x.trim())
                      .map((x, i) => (
                        <div key={i}>
                          {prefix}
                          {i + 1}. {x}
                        </div>
                      ))}
                  </div>
                ))}
              </td>
            </tr>
            <tr>
              <th className="rps-label">Dosen Pengampu</th>
              <td>{data.dosenPengampu}</td>
            </tr>
            <tr>
              <th className="rps-label">Mata Kuliah Prasyarat</th>
              <td>{data.prasyarat}</td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* ---------- Rencana mingguan (landscape) ---------- */}
      <section className="rps-page rps-page-landscape">
        <Kop data={data} />
        <div className="rps-section-title">A. RENCANANA PEMBELAJARAN SEMESTER</div>
        <table className="rps-table rps-weekly rps-shaded-head">
          <thead>
            <tr>
              <th rowSpan={2}>Minggu Ke-</th>
              <th rowSpan={2}>Sub-CPMK (Kemampuan Akhir yang Direncanakan)</th>
              <th rowSpan={2}>Bahan Kajian</th>
              <th rowSpan={2}>Bentuk dan Metode Pembelajaran</th>
              <th rowSpan={2}>Estimasi Waktu Pembelajaran (mnt/mg/smt)</th>
              <th rowSpan={2}>Pengalaman Belajar Mahasiswa</th>
              <th rowSpan={2}>Media Pembelajaran</th>
              <th colSpan={3} className="rps-center">Penilaian</th>
              <th rowSpan={2}>Pustaka</th>
            </tr>
            <tr>
              <th>Indikator</th>
              <th>Bobot</th>
              <th>Teknik &amp; Kriteria</th>
            </tr>
          </thead>
          <tbody>
            {data.weeks.map((w) => (
              <tr key={w.id}>
                <td className="rps-center">{w.minggu}</td>
                <td>{w.subCpmk}</td>
                <td>{w.bahanKajian}</td>
                <td>
                  <ChecklistCell groups={BENTUK_METODE_GROUPS} text={w.bentukMetode} />
                </td>
                <td className="rps-center">{w.estimasiWaktu}</td>
                <td>{w.pengalamanBelajar}</td>
                <td>
                  <ChecklistCell groups={MEDIA_GROUPS} text={w.media} />
                </td>
                <td>{w.indikator}</td>
                <td className="rps-center">{w.bobot ? `${w.bobot}%` : ""}</td>
                <td>
                  <ChecklistCell groups={PENILAIAN_GROUPS} text={w.teknikKriteria} />
                </td>
                <td>
                  <Multiline text={w.pustaka} />
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={8} className="rps-right">
                <strong>Total Bobot</strong>
              </td>
              <td className="rps-center">
                <strong>{totalBobot}%</strong>
              </td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>
      </section>

      {/* ---------- Bagian B ---------- */}
      <section className="rps-page">
        <div className="rps-section-title">B. RENCANANA TUGAS MAHASISWA</div>
        <table className="rps-table">
          <thead>
            <tr>
              <th>Minggu ke-</th>
              <th>Nama Tugas dan Evaluasi</th>
              <th>Kemampuan yang Diukur (Sub-CPMK)</th>
              <th>Bentuk Penugasan / Cara Pengerjaan</th>
              <th>Luaran Tugas yang Dihasilkan</th>
              <th>Batas Waktu</th>
            </tr>
          </thead>
          <tbody>
            {data.tasks.map((t) => (
              <tr key={t.id}>
                <td className="rps-center">{t.minggu}</td>
                <td>{t.namaTugas}</td>
                <td>{t.kemampuan}</td>
                <td>{t.bentuk}</td>
                <td>{t.luaran}</td>
                <td>{t.batasWaktu}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Bagian C ---------- */}
      <section className="rps-page">
        <div className="rps-section-title">C. PENILAIAN AKHIR</div>
        <p className="rps-p">
          1. Persentase penilaian mata kuliah mahasiswa mengacu pada CPMK sebagai berikut:
        </p>
        {data.variants.map((v) => {
          const total = v.rows.reduce((s, r) => s + (parseFloat(r.persentase) || 0), 0);
          return (
            <div key={v.id} className="rps-variant">
              <p className="rps-p">{v.judul}</p>
              <table className="rps-table">
                <thead>
                  <tr>
                    <th className="rps-col-no">No.</th>
                    <th>Elemen Penilaian</th>
                    <th>Rencana Penilaian</th>
                    <th className="rps-col-pct">Persentase</th>
                  </tr>
                </thead>
                <tbody>
                  {v.rows.map((r, i) => (
                    <tr key={r.id}>
                      <td className="rps-center">{i + 1}</td>
                      <td>{r.elemen}</td>
                      <td>{r.rencana}</td>
                      <td className="rps-center">{r.persentase}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={3}>
                      <strong>Total Nilai</strong>
                    </td>
                    <td className="rps-center">
                      <strong>{total}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })}
        {data.variantNotes.map((n, i) => (
          <p key={i} className="rps-note">
            {n}
          </p>
        ))}

        <p className="rps-p">2. Ketercapaian CPL pada CPMK:</p>
        <table className="rps-table rps-small">
          <thead>
            <tr>
              <th>Minggu</th>
              <th>CPL</th>
              <th>CPMK</th>
              <th>Indikator Penilaian</th>
              <th>Bentuk Penilaian</th>
              <th>Bobot Nilai (%)</th>
              <th>Nilai Mahasiswa</th>
              <th>Ketercapaian CPL pada CPMK</th>
            </tr>
          </thead>
          <tbody>
            {data.achievements.map((a) => (
              <tr key={a.id}>
                <td className="rps-center">{a.minggu}</td>
                <td>{a.cpl}</td>
                <td>{a.cpmk}</td>
                <td>{a.indikator}</td>
                <td>{a.bentuk}</td>
                <td className="rps-center">{a.bobot}</td>
                <td>{a.nilai}</td>
                <td className="rps-center">{a.ketercapaian}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={5} className="rps-right">
                <strong>Total</strong>
              </td>
              <td className="rps-center">
                <strong>{totalAchievement}</strong>
              </td>
              <td />
              <td />
            </tr>
          </tbody>
        </table>

        <div className="rps-section-title">Nilai Mata Kuliah (NM)</div>
        <table className="rps-table rps-grade">
          <thead>
            <tr>
              <th>Rentang</th>
              <th>Kategori</th>
            </tr>
          </thead>
          <tbody>
            {data.gradeScale.map((g) => (
              <tr key={g.id}>
                <td className="rps-center">{g.rentang}</td>
                <td className="rps-center">{g.kategori}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ---------- Bagian D ---------- */}
      <section className="rps-page">
        <div className="rps-section-title">D. PENILAIAN TUGAS</div>
        <div className="rps-subtitle">{data.rubricTitle}</div>
        <table className="rps-table rps-small">
          <thead>
            <tr>
              <th className="rps-col-no">No.</th>
              <th>Aspek</th>
              <th>Definisi</th>
              <th>Indikator</th>
              <th>Rubrik</th>
              <th>Skor</th>
            </tr>
          </thead>
          <tbody>
            {data.rubric.map((r, i) =>
              r.subIndikator.map((s, j) => (
                <tr key={s.id}>
                  {j === 0 && (
                    <>
                      <td rowSpan={r.subIndikator.length} className="rps-center">
                        {i + 1}
                      </td>
                      <td rowSpan={r.subIndikator.length}>{r.aspek}</td>
                      <td rowSpan={r.subIndikator.length}>{r.definisi}</td>
                      <td rowSpan={r.subIndikator.length}>{r.indikator}</td>
                    </>
                  )}
                  <td>{s.deskripsi}</td>
                  <td className="rps-center">{s.rentang}</td>
                </tr>
              )),
            )}
          </tbody>
        </table>
        <div className="rps-notes">
          <strong>Keterangan :</strong>
          {data.rubricNotes.map((n, i) => (
            <div key={i}>{n}</div>
          ))}
        </div>
      </section>
    </div>
  );
}
