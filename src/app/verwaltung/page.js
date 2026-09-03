import Link from "next/link";
import { getSessionAndProfile } from "./auth";
import LoginForm from "./LoginForm";
import AccessDenied from "./AccessDenied";
import VerwaltungHeader from "./VerwaltungHeader";
import SubmitButton from "./SubmitButton";
import { weekdayLabels } from "@/lib/weekdays";
import { setRegistrationStatus, setTeacherApplicationStatus } from "./actions";

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
      <div>
        <VerwaltungHeader profile={profile} user={user} />
        <div className="mx-auto max-w-2xl px-4 py-10">
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">Meine Gruppen</h1>

          {(!groups || groups.length === 0) && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
              Dir wurde noch keine Gruppe zugewiesen.
            </div>
          )}

          <div className="space-y-4">
            {groups?.map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">{g.name}</p>
                <p className="mt-1 text-sm text-neutral-500">
                  {g.weekday ? weekdayLabels[g.weekday]?.de : "Kein Tag festgelegt"}
                  {g.start_time && g.end_time
                    ? `, ${g.start_time.slice(0, 5)}–${g.end_time.slice(0, 5)} Uhr`
                    : ""}
                </p>
                <p className="mt-3 text-sm text-neutral-700">
                  <span className="font-medium">Schüler: </span>
                  {students
                    ?.filter((s) => s.group_id === g.id)
                    .map((s) => s.child_name)
                    .join(", ") || "noch keine zugewiesen"}
                </p>
                <Link
                  href={`/verwaltung/unterricht/${g.id}`}
                  className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  Anwesenheit erfassen
                </Link>
              </div>
            ))}
          </div>
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
    <div>
      <VerwaltungHeader profile={profile} user={user} active="antraege" />
      <div className="mx-auto max-w-4xl space-y-10 px-4 py-10">
        <section>
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Offene Kind-Registrierungen{" "}
            <span className="text-neutral-400">({registrations?.length ?? 0})</span>
          </h2>
          <div className="space-y-4">
            {registrations?.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                Keine offenen Anträge.
              </div>
            )}
            {registrations?.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-l-4 border-neutral-200 border-l-orange-400 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">
                  {r.child_name} <span className="font-normal text-neutral-500">({r.birth_date})</span>
                </p>
                <div className="mt-2 space-y-0.5 text-sm text-neutral-600">
                  <p>Eltern: {r.father_name} / {r.mother_name}</p>
                  <p>Kontakt: {r.phone} · {r.email}</p>
                  <p>Adresse: {r.address}</p>
                  <p>Ort: {r.location} · Schule: {r.school}</p>
                  <p>Spricht Arabisch: {r.speaks_arabic ? "Ja" : "Nein"}</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <form action={setRegistrationStatus.bind(null, r.id, "approved")}>
                    <SubmitButton variant="approve" pendingText="Wird genehmigt …">
                      Genehmigen
                    </SubmitButton>
                  </form>
                  <form action={setRegistrationStatus.bind(null, r.id, "rejected")}>
                    <SubmitButton variant="reject" pendingText="Wird abgelehnt …">
                      Ablehnen
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            Offene Lehrer-Bewerbungen{" "}
            <span className="text-neutral-400">({teacherApplications?.length ?? 0})</span>
          </h2>
          <div className="space-y-4">
            {teacherApplications?.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                Keine offenen Bewerbungen.
              </div>
            )}
            {teacherApplications?.map((t) => (
              <div
                key={t.id}
                className="rounded-xl border border-l-4 border-neutral-200 border-l-orange-400 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">{t.full_name}</p>
                <div className="mt-2 space-y-0.5 text-sm text-neutral-600">
                  <p>Kontakt: {t.phone} · {t.email}</p>
                  <p>Ort: {t.location}</p>
                  <p>Qualifikation: {t.qualification}</p>
                  {t.message && <p>Nachricht: {t.message}</p>}
                </div>
                <div className="mt-4 flex gap-2">
                  <form action={setTeacherApplicationStatus.bind(null, t.id, "approved")}>
                    <SubmitButton variant="approve" pendingText="Wird genehmigt …">
                      Genehmigen
                    </SubmitButton>
                  </form>
                  <form action={setTeacherApplicationStatus.bind(null, t.id, "rejected")}>
                    <SubmitButton variant="reject" pendingText="Wird abgelehnt …">
                      Ablehnen
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
