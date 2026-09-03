import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import VerwaltungHeader from "../../VerwaltungHeader";
import { saveGroup } from "../../actions";
import { weekdays, weekdayLabels } from "@/lib/weekdays";
import TeacherPicker from "./TeacherPicker";
import StudentPicker from "./StudentPicker";
import SaveGroupButtons from "./SaveGroupButtons";

const fieldClass =
  "w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500";
const labelClass = "mb-1 block text-sm font-medium text-neutral-700";

export default async function GruppeBearbeitenPage({ params }) {
  const { id } = await params;
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;
  if (profile?.role !== "verwaltung") return <AccessDenied />;

  const { data: group } = await supabase
    .from("groups")
    .select("*")
    .eq("id", id)
    .single();

  if (!group) notFound();

  const { data: teachers } = await supabase
    .from("profiles")
    .select("id, full_name")
    .eq("role", "lehrer")
    .order("full_name", { ascending: true });

  const { data: children } = await supabase
    .from("registrations")
    .select("id, child_name, group_id")
    .eq("status", "approved")
    .order("child_name", { ascending: true });

  const save = saveGroup.bind(null, group.id, false);
  const saveAndNotify = saveGroup.bind(null, group.id, true);

  return (
    <div>
      <VerwaltungHeader profile={profile} user={user} active="gruppen" />
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
          <h1 className="text-2xl font-bold text-neutral-900">Gruppe bearbeiten</h1>
          <Link
            href={`/verwaltung/unterricht/${group.id}`}
            className="text-sm text-orange-600 underline"
          >
            Unterrichtsstunden ansehen/bearbeiten →
          </Link>
        </div>
        {group.last_notified_at && (
          <p className="mb-6 text-sm text-neutral-500">
            Zuletzt benachrichtigt: {new Date(group.last_notified_at).toLocaleString("de-DE")}
          </p>
        )}

        <form className="space-y-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div>
            <label className={labelClass}>Gruppenname</label>
            <input
              name="name"
              type="text"
              required
              defaultValue={group.name}
              className={fieldClass}
            />
          </div>

          <div>
            <label className={labelClass}>Lehrer</label>
            <TeacherPicker
              options={(teachers ?? []).map((t) => ({ id: t.id, name: t.full_name }))}
              initialId={group.teacher_id}
            />
          </div>

          <div className="flex flex-wrap gap-4">
            <div className="flex-1 basis-40">
              <label className={labelClass}>Wochentag</label>
              <select
                name="weekday"
                defaultValue={group.weekday ?? ""}
                className={fieldClass}
              >
                <option value="">Kein Tag festgelegt</option>
                {weekdays.map((w) => (
                  <option key={w} value={w}>
                    {weekdayLabels[w].de}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Von</label>
              <input
                name="startTime"
                type="time"
                defaultValue={group.start_time?.slice(0, 5) ?? ""}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}>Bis</label>
              <input
                name="endTime"
                type="time"
                defaultValue={group.end_time?.slice(0, 5) ?? ""}
                className={fieldClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">Schüler</label>
            <StudentPicker
              options={(children ?? []).map((c) => ({
                id: c.id,
                name: c.child_name,
                otherGroup: Boolean(c.group_id && c.group_id !== group.id),
              }))}
              initialSelectedIds={(children ?? [])
                .filter((c) => c.group_id === group.id)
                .map((c) => c.id)}
            />
          </div>

          <div className="border-t border-neutral-100 pt-5">
            <SaveGroupButtons saveAction={save} saveAndNotifyAction={saveAndNotify} />
          </div>
        </form>
      </div>
    </div>
  );
}
