import Link from "next/link";
import { getSessionAndProfile } from "../auth";
import LoginForm from "../LoginForm";
import AccessDenied from "../AccessDenied";
import VerwaltungNav from "../VerwaltungNav";
import { weekdayLabels } from "@/lib/weekdays";

export default async function GruppenPage() {
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;
  if (profile?.role !== "verwaltung") return <AccessDenied />;

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, weekday, start_time, end_time, teacher_id, profiles(full_name)")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <VerwaltungNav />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gruppen</h1>
        <Link
          href="/verwaltung/gruppen/neu"
          className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
        >
          + Neue Gruppe
        </Link>
      </div>

      {(!groups || groups.length === 0) && (
        <p className="text-neutral-500">Keine Gruppen.</p>
      )}

      <div className="space-y-3">
        {groups?.map((g) => (
          <Link
            key={g.id}
            href={`/verwaltung/gruppen/${g.id}`}
            className="block rounded-lg border border-neutral-200 bg-white p-4 hover:border-orange-400"
          >
            <p className="font-semibold">{g.name}</p>
            <p className="text-sm text-neutral-600">
              {g.weekday ? weekdayLabels[g.weekday]?.de : "Kein Tag festgelegt"}
              {g.start_time && g.end_time
                ? `, ${g.start_time.slice(0, 5)}–${g.end_time.slice(0, 5)} Uhr`
                : ""}
              {" · "}
              {g.profiles?.full_name ? `Lehrer: ${g.profiles.full_name}` : "Kein Lehrer zugewiesen"}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
