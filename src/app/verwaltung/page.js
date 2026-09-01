import { getSessionAndProfile } from "./auth";
import LoginForm from "./LoginForm";
import AccessDenied from "./AccessDenied";
import VerwaltungNav from "./VerwaltungNav";
import { weekdayLabels } from "@/lib/weekdays";
import {
  logout,
  setRegistrationStatus,
  setTeacherApplicationStatus,
} from "./actions";

export default async function VerwaltungPage() {
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  if (profile?.role === "lehrer") {
    const { data: groups } = await supabase
      .from("groups")
      .select("id, name, weekday, start_time, end_time")
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: true });

    const groupIds = groups?.map((g) => g.id) ?? [];
    const { data: students } = groupIds.length
      ? await supabase
          .from("registrations")
          .select("child_name, group_id")
          .in("group_id", groupIds)
      : { data: [] };

    return (
      <div className="mx-auto max-w-2xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Willkommen, {profile.full_name || user.email}
          </h1>
          <form action={logout}>
            <button type="submit" className="text-sm underline">
              Abmelden
            </button>
          </form>
        </div>

        <h2 className="mb-4 text-xl font-semibold">Meine Gruppen</h2>
        {(!groups || groups.length === 0) && (
          <p className="text-neutral-500">Dir wurde noch keine Gruppe zugewiesen.</p>
        )}
        <div className="space-y-4">
          {groups?.map((g) => (
            <div key={g.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p className="font-semibold">{g.name}</p>
              <p className="text-sm text-neutral-600">
                {g.weekday ? weekdayLabels[g.weekday]?.de : "Kein Tag festgelegt"}
                {g.start_time && g.end_time
                  ? `, ${g.start_time.slice(0, 5)}–${g.end_time.slice(0, 5)} Uhr`
                  : ""}
              </p>
              <p className="mt-2 text-sm">
                Schüler:{" "}
                {students
                  ?.filter((s) => s.group_id === g.id)
                  .map((s) => s.child_name)
                  .join(", ") || "noch keine zugewiesen"}
              </p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (profile?.role !== "verwaltung") {
    return <AccessDenied />;
  }

  const { data: registrations } = await supabase
    .from("registrations")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  const { data: teacherApplications } = await supabase
    .from("teacher_applications")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true });

  return (
    <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
      <VerwaltungNav />

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Verwaltung</h1>
        <form action={logout}>
          <button type="submit" className="text-sm underline">
            Abmelden ({profile.full_name || user.email})
          </button>
        </form>
      </div>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Offene Kind-Registrierungen ({registrations?.length ?? 0})
        </h2>
        <div className="space-y-4">
          {registrations?.length === 0 && (
            <p className="text-neutral-500">Keine offenen Anträge.</p>
          )}
          {registrations?.map((r) => (
            <div key={r.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p>
                <strong>{r.child_name}</strong> ({r.birth_date})
              </p>
              <p>Eltern: {r.father_name} / {r.mother_name}</p>
              <p>Kontakt: {r.phone} · {r.email}</p>
              <p>Adresse: {r.address}</p>
              <p>Ort: {r.location} · Schule: {r.school}</p>
              <p>Spricht Arabisch: {r.speaks_arabic ? "Ja" : "Nein"}</p>
              <div className="mt-3 flex gap-2">
                <form action={setRegistrationStatus.bind(null, r.id, "approved")}>
                  <button className="rounded bg-green-600 px-3 py-1 text-white">
                    Genehmigen
                  </button>
                </form>
                <form action={setRegistrationStatus.bind(null, r.id, "rejected")}>
                  <button className="rounded bg-red-600 px-3 py-1 text-white">
                    Ablehnen
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold">
          Offene Lehrer-Bewerbungen ({teacherApplications?.length ?? 0})
        </h2>
        <div className="space-y-4">
          {teacherApplications?.length === 0 && (
            <p className="text-neutral-500">Keine offenen Bewerbungen.</p>
          )}
          {teacherApplications?.map((t) => (
            <div key={t.id} className="rounded-lg border border-neutral-200 bg-white p-4">
              <p>
                <strong>{t.full_name}</strong>
              </p>
              <p>Kontakt: {t.phone} · {t.email}</p>
              <p>Ort: {t.location}</p>
              <p>Qualifikation: {t.qualification}</p>
              {t.message && <p>Nachricht: {t.message}</p>}
              <div className="mt-3 flex gap-2">
                <form action={setTeacherApplicationStatus.bind(null, t.id, "approved")}>
                  <button className="rounded bg-green-600 px-3 py-1 text-white">
                    Genehmigen
                  </button>
                </form>
                <form action={setTeacherApplicationStatus.bind(null, t.id, "rejected")}>
                  <button className="rounded bg-red-600 px-3 py-1 text-white">
                    Ablehnen
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
