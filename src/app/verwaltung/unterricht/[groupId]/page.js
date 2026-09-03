import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import VerwaltungHeader from "../../VerwaltungHeader";
import SubmitButton from "../../SubmitButton";
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
    <div>
      <VerwaltungHeader profile={profile} user={user} active={isVerwaltung ? "gruppen" : undefined} />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-neutral-900">
            {group.name} <span className="font-normal text-neutral-400">– Unterrichtsstunden</span>
          </h1>
          <form action={createForGroup}>
            <SubmitButton pendingText="Wird angelegt …">+ Neue Stunde (heute)</SubmitButton>
          </form>
        </div>

        {(!lessons || lessons.length === 0) && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
            Noch keine Unterrichtsstunden erfasst.
          </div>
        )}

        <div className="space-y-2">
          {lessons?.map((l) => (
            <Link
              key={l.id}
              href={`/verwaltung/unterricht/${groupId}/${l.id}`}
              className="block rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:border-orange-400 hover:shadow"
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
    </div>
  );
}
