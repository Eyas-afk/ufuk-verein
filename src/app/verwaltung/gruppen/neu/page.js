import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import VerwaltungHeader from "../../VerwaltungHeader";
import SubmitButton from "../../SubmitButton";
import { getAdminDict } from "@/lib/adminDictionary";
import { createGroup } from "../../actions";

export default async function NeueGruppePage() {
  const { user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;

  const locale = profile?.locale === "de" ? "de" : "ar";
  if (profile?.role !== "verwaltung") return <AccessDenied locale={locale} />;

  const t = getAdminDict(locale).groups;

  return (
    <div>
      <VerwaltungHeader profile={profile} user={user} active="gruppen" />
      <div className="mx-auto max-w-md px-4 py-10">
        <h1 className="mb-6 text-2xl font-bold text-neutral-900">{t.newGroupTitle}</h1>

        <form
          action={createGroup}
          className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              {t.groupName}
            </label>
            <input
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <SubmitButton pendingText={t.creating}>{t.create}</SubmitButton>
        </form>
      </div>
    </div>
  );
}
