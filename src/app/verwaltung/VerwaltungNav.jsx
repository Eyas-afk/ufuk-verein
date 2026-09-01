import Link from "next/link";

export default function VerwaltungNav() {
  return (
    <nav className="mb-6 flex gap-4 border-b border-neutral-200 pb-3 text-sm">
      <Link href="/verwaltung" className="hover:underline">
        Anträge
      </Link>
      <Link href="/verwaltung/gruppen" className="hover:underline">
        Gruppen
      </Link>
    </nav>
  );
}
