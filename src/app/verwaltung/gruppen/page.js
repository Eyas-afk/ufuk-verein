import Link from "next/link";
import { getSessionAndProfile } from "../auth";
import LoginForm from "../LoginForm";
import AccessDenied from "../AccessDenied";
import VerwaltungHeader from "../VerwaltungHeader";
import { weekdayLabels } from "@/lib/weekdays";
import { getAdminDict } from "@/lib/adminDictionary";

export default async function GruppenPage() {
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const locale = profile?.locale === "de" ? "de" : "ar";
  if (profile?.role !== "verwaltung") return <AccessDenied locale={locale} />;

  const t = getAdminDict(locale).groups;

  const { data: groups } = await supabase
    .from("groups")
    .select("id, name, weekday, start_time, end_time, teacher_id, profiles(full_name)")
    .order("created_at", { ascending: true });

  return (
    <div>
      <VerwaltungHeader profile={profile} user={user} active="gruppen" />
      <div className="mx-auto max-w-4xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-neutral-900">{t.title}</h1>
          <Link
            href="/verwaltung/gruppen/neu"
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            {t.newGroup}
          </Link>
        </div>

        {(!groups || groups.length === 0) && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
            {t.none}
          </div>
        )}

        <div className="space-y-3">
          {groups?.map((g) => (
            <Link
              key={g.id}
              href={`/verwaltung/gruppen/${g.id}`}
              className="block rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-orange-400 hover:shadow"
            >
              <p className="font-semibold text-neutral-900">{g.name}</p>
              <p className="mt-1 text-sm text-neutral-500">
                {g.weekday ? weekdayLabels[g.weekday]?.[locale] : t.noDay}
                {g.start_time && g.end_time
                  ? `, ${g.start_time.slice(0, 5)}–${g.end_time.slice(0, 5)}`
                  : ""}
                {" · "}
                {g.profiles?.full_name ? `${t.teacherLabel}: ${g.profiles.full_name}` : t.noTeacherAssigned}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
