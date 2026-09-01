import Link from "next/link";
import { notFound } from "next/navigation";
import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import VerwaltungNav from "../../VerwaltungNav";
import { saveGroup } from "../../actions";
import { weekdays, weekdayLabels } from "@/lib/weekdays";
import TeacherPicker from "./TeacherPicker";
import StudentPicker from "./StudentPicker";

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
    <div className="mx-auto max-w-2xl px-4 py-10">
      <VerwaltungNav />

      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gruppe bearbeiten</h1>
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

      <form className="space-y-6">
        <div>
          <label className="mb-1 block text-sm font-medium">Gruppenname</label>
          <input
            name="name"
            type="text"
            required
            defaultValue={group.name}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Lehrer</label>
          <TeacherPicker
            options={(teachers ?? []).map((t) => ({ id: t.id, name: t.full_name }))}
            initialId={group.teacher_id}
          />
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium">Wochentag</label>
            <select
              name="weekday"
              defaultValue={group.weekday ?? ""}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2"
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
            <label className="mb-1 block text-sm font-medium">Von</label>
            <input
              name="startTime"
              type="time"
              defaultValue={group.start_time?.slice(0, 5) ?? ""}
              className="rounded-lg border border-neutral-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Bis</label>
            <input
              name="endTime"
              type="time"
              defaultValue={group.end_time?.slice(0, 5) ?? ""}
              className="rounded-lg border border-neutral-300 px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Schüler</label>
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

        <div className="flex gap-3">
          <button
            type="submit"
            formAction={save}
            className="rounded-lg border border-neutral-300 px-4 py-2 font-semibold hover:bg-neutral-100"
          >
            Speichern
          </button>
          <button
            type="submit"
            formAction={saveAndNotify}
            className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
          >
            Bestätigen &amp; Benachrichtigen
          </button>
        </div>
      </form>
    </div>
  );
}
