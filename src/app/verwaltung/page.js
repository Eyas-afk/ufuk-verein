import Link from "next/link";
import { getSessionAndProfile } from "./auth";
import LoginForm from "./LoginForm";
import AccessDenied from "./AccessDenied";
import VerwaltungHeader from "./VerwaltungHeader";
import SubmitButton from "./SubmitButton";
import { weekdayLabels } from "@/lib/weekdays";
import { getAdminDict } from "@/lib/adminDictionary";
import { setRegistrationStatus, setTeacherApplicationStatus } from "./actions";

export default async function VerwaltungPage() {
  const { supabase, user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const locale = profile?.locale === "de" ? "de" : "ar";
  const t = getAdminDict(locale).dashboard;

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
          <h1 className="mb-6 text-2xl font-bold text-neutral-900">{t.myGroups}</h1>

          {(!groups || groups.length === 0) && (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
              {t.noGroupAssigned}
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
                  {g.weekday ? weekdayLabels[g.weekday]?.[locale] : t.noDay}
                  {g.start_time && g.end_time
                    ? `, ${g.start_time.slice(0, 5)}–${g.end_time.slice(0, 5)}`
                    : ""}
                </p>
                <p className="mt-3 text-sm text-neutral-700">
                  <span className="font-medium">{t.studentsLabel}: </span>
                  {students
                    ?.filter((s) => s.group_id === g.id)
                    .map((s) => s.child_name)
                    .join(", ") || t.noneAssignedYet}
                </p>
                <Link
                  href={`/verwaltung/unterricht/${g.id}`}
                  className="mt-4 inline-block rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-700"
                >
                  {t.takeAttendance}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (profile?.role !== "verwaltung") {
    return <AccessDenied locale={locale} />;
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
            {t.openRegistrations}{" "}
            <span className="text-neutral-400">({registrations?.length ?? 0})</span>
          </h2>
          <div className="space-y-4">
            {registrations?.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                {t.noOpenRegistrations}
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
                  <p>{t.parents}: {r.father_name} / {r.mother_name}</p>
                  <p>{t.contact}: {r.phone} · {r.email}</p>
                  <p>{t.address}: {r.address}</p>
                  <p>{t.location}: {r.location} · {t.school}: {r.school}</p>
                  <p>{t.speaksArabic}: {r.speaks_arabic ? t.yes : t.no}</p>
                </div>
                {r.consent_photos_public && (
                  <div className="mt-2">
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">
                      {t.consentPhotosPublicShort}
                    </span>
                  </div>
                )}
                <div className="mt-4 flex gap-2">
                  <form action={setRegistrationStatus.bind(null, r.id, "approved")}>
                    <SubmitButton variant="approve" pendingText={t.approving}>
                      {t.approve}
                    </SubmitButton>
                  </form>
                  <form action={setRegistrationStatus.bind(null, r.id, "rejected")}>
                    <SubmitButton variant="reject" pendingText={t.rejecting}>
                      {t.reject}
                    </SubmitButton>
                  </form>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold text-neutral-900">
            {t.openTeacherApplications}{" "}
            <span className="text-neutral-400">({teacherApplications?.length ?? 0})</span>
          </h2>
          <div className="space-y-4">
            {teacherApplications?.length === 0 && (
              <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-neutral-500">
                {t.noOpenApplications}
              </div>
            )}
            {teacherApplications?.map((app) => (
              <div
                key={app.id}
                className="rounded-xl border border-l-4 border-neutral-200 border-l-orange-400 bg-white p-5 shadow-sm"
              >
                <p className="font-semibold text-neutral-900">{app.full_name}</p>
                <div className="mt-2 space-y-0.5 text-sm text-neutral-600">
                  <p>{t.contact}: {app.phone} · {app.email}</p>
                  <p>{t.location}: {app.location}</p>
                  <p>{t.qualification}: {app.qualification}</p>
                  {app.message && <p>{t.message}: {app.message}</p>}
                </div>
                <div className="mt-4 flex gap-2">
                  <form action={setTeacherApplicationStatus.bind(null, app.id, "approved")}>
                    <SubmitButton variant="approve" pendingText={t.approving}>
                      {t.approve}
                    </SubmitButton>
                  </form>
                  <form action={setTeacherApplicationStatus.bind(null, app.id, "rejected")}>
                    <SubmitButton variant="reject" pendingText={t.rejecting}>
                      {t.reject}
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
