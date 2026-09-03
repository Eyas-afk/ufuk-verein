import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../../auth";
import LoginForm from "../../../LoginForm";
import AccessDenied from "../../../AccessDenied";
import VerwaltungHeader from "../../../VerwaltungHeader";
import SubmitButton from "../../../SubmitButton";
import { getAdminDict } from "@/lib/adminDictionary";
import { saveAttendance } from "../../../actions";

export default async function UnterrichtsstundePage({ params }) {
  const { groupId, lessonId } = await params;
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const locale = profile?.locale === "de" ? "de" : "ar";
  const t = getAdminDict(locale).lessons;
  const tAccess = getAdminDict(locale).accessDenied;

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .single();

  if (!group) notFound();

  const isOwnGroup = profile?.role === "lehrer" && group.teacher_id === user.id;
  const isVerwaltung = profile?.role === "verwaltung";

  if (!isOwnGroup && !isVerwaltung) {
    return <AccessDenied locale={locale} message={tAccess.notYourGroup} />;
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
    <div>
      <VerwaltungHeader profile={profile} user={user} active={isVerwaltung ? "gruppen" : undefined} />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-1 text-2xl font-bold text-neutral-900">{group.name}</h1>
        <p className="mb-6 text-neutral-500">
          {new Date(lesson.date).toLocaleDateString(locale === "de" ? "de-DE" : "ar-SY", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {(!students || students.length === 0) && (
          <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
            {t.noStudents}
          </div>
        )}

        <form action={save} className="space-y-4">
          {students?.map((s) => {
            const a = attendanceMap[s.id];
            return (
              <div
                key={s.id}
                className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
              >
                <p className="mb-3 font-semibold text-neutral-900">{s.child_name}</p>
                <div className="flex flex-wrap gap-5">
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      name={`present-${s.id}`}
                      defaultChecked={a?.present ?? false}
                      className="h-4 w-4 accent-orange-600"
                    />
                    {t.present}
                  </label>
                  <label className="flex items-center gap-2 text-sm text-neutral-700">
                    <input
                      type="checkbox"
                      name={`homework-${s.id}`}
                      defaultChecked={a?.homework_done ?? false}
                      className="h-4 w-4 accent-orange-600"
                    />
                    {t.homeworkDone}
                  </label>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-sm font-medium text-neutral-700">
                    {t.notes}
                  </label>
                  <textarea
                    name={`notes-${s.id}`}
                    defaultValue={a?.notes ?? ""}
                    rows={2}
                    className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            );
          })}

          {students?.length > 0 && (
            <SubmitButton pendingText={t.saving}>{t.save}</SubmitButton>
          )}
        </form>

        <Link
          href={`/verwaltung/unterricht/${groupId}`}
          className="mt-6 inline-block text-sm text-neutral-500 underline"
        >
          {t.backToLessons}
        </Link>
      </div>
    </div>
  );
}
