import { createClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";
import {
  logout,
  setRegistrationStatus,
  setTeacherApplicationStatus,
} from "./actions";

export default async function VerwaltungPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginForm />;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "verwaltung") {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p>Kein Zugriff für dieses Konto.</p>
        <form action={logout}>
          <button type="submit" className="mt-4 underline">
            Abmelden
          </button>
        </form>
      </div>
    );
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
