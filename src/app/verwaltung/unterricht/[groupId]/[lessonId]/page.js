import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../../auth";
import LoginForm from "../../../LoginForm";
import AccessDenied from "../../../AccessDenied";
import { saveAttendance } from "../../../actions";

export default async function UnterrichtsstundePage({ params }) {
  const { groupId, lessonId } = await params;
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group) notFound();

  if (profile?.role !== "lehrer" || group.teacher_id !== user.id) {
    return <AccessDenied message="Diese Gruppe ist nicht dir zugewiesen." />;
  }

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const { data: students } = await supabase
    .from("registrations")
    .select("id, child_name")
    .eq("group_id", groupId)
    .order("child_name", { ascending: true });

  const { data: existingAttendance } = await supabase
    .from("attendance")
    .select("student_id, present, homework_done, notes")
    .eq("lesson_id", lessonId);

  const attendanceMap = Object.fromEntries(
    (existingAttendance ?? []).map((a) => [a.student_id, a])
  );

  const studentIds = (students ?? []).map((s) => s.id);
  const save = saveAttendance.bind(null, lessonId, studentIds);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold">{group.name}</h1>
      <p className="mb-6 text-neutral-600">
        {new Date(lesson.date).toLocaleDateString("de-DE", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {(!students || students.length === 0) && (
        <p className="text-neutral-500">Dieser Gruppe sind noch keine Schüler zugewiesen.</p>
      )}

      <form action={save} className="space-y-4">
        {students?.map((s) => {
          const a = attendanceMap[s.id];
          return (
            <div key={s.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="mb-2 font-semibold">{s.child_name}</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={`present-${s.id}`}
                    defaultChecked={a?.present ?? false}
                  />
                  Anwesend
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name={`homework-${s.id}`}
                    defaultChecked={a?.homework_done ?? false}
                  />
                  Hausaufgabe erledigt
                </label>
              </div>
              <div className="mt-2">
                <label className="mb-1 block text-sm font-medium">Anmerkungen</label>
                <textarea
                  name={`notes-${s.id}`}
                  defaultValue={a?.notes ?? ""}
                  rows={2}
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm"
                />
              </div>
            </div>
          );
        })}

        {students?.length > 0 && (
          <button
            type="submit"
            className="rounded-lg bg-orange-600 px-6 py-2 font-semibold text-white hover:bg-orange-700"
          >
            Speichern
          </button>
        )}
      </form>

      <Link
        href={`/verwaltung/unterricht/${groupId}`}
        className="mt-6 inline-block text-sm text-neutral-500 underline"
      >
        ← Alle Stunden dieser Gruppe
      </Link>
    </div>
  );
}
