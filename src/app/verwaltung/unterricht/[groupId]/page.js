import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import { createLesson } from "../../actions";

export default async function UnterrichtGruppePage({ params }) {
  const { groupId } = await params;
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group) notFound();

  const isOwnGroup = profile?.role === "lehrer" && group.teacher_id === user.id;
  const isVerwaltung = profile?.role === "verwaltung";

  if (!isOwnGroup && !isVerwaltung) {
    return <AccessDenied message="Diese Gruppe ist nicht dir zugewiesen." />;
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, date")
    .eq("group_id", groupId)
    .order("date", { ascending: false });

  const createForGroup = createLesson.bind(null, groupId);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">{group.name} – Unterrichtsstunden</h1>
        <form action={createForGroup}>
          <button
            type="submit"
            className="rounded bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
          >
            + Neue Stunde (heute)
          </button>
        </form>
      </div>

      {(!lessons || lessons.length === 0) && (
        <p className="text-neutral-500">Noch keine Unterrichtsstunden erfasst.</p>
      )}

      <div className="space-y-2">
        {lessons?.map((l) => (
          <Link
            key={l.id}
            href={`/verwaltung/unterricht/${groupId}/${l.id}`}
            className="block rounded-lg border border-neutral-200 bg-white p-3 hover:border-orange-400"
          >
            {new Date(l.date).toLocaleDateString("de-DE", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Link>
        ))}
      </div>

      <Link
        href={isVerwaltung ? `/verwaltung/gruppen/${groupId}` : "/verwaltung"}
        className="mt-6 inline-block text-sm text-neutral-500 underline"
      >
        ← Zurück zur Gruppe
      </Link>
    </div>
  );
}
