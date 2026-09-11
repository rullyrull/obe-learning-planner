import { createFileRoute } from "@tanstack/react-router";
import { RpsEditor } from "@/components/rps/RpsEditor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aplikasi Pembuat RPS Berbasis OBE" },
      { name: "description", content: "Buat Rencana Pembelajaran Semester (RPS) dengan format OBE, pratinjau cetak A4, ekspor Word, dan PDF." },
      { property: "og:title", content: "Aplikasi Pembuat RPS Berbasis OBE" },
      { property: "og:description", content: "Buat Rencana Pembelajaran Semester (RPS) dengan format OBE, pratinjau cetak A4, ekspor Word, dan PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <RpsEditor />;
}
