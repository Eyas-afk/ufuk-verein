import { getSessionAndProfile } from "../../auth";
import LoginForm from "../../LoginForm";
import AccessDenied from "../../AccessDenied";
import VerwaltungNav from "../../VerwaltungNav";
import { createGroup } from "../../actions";

export default async function NeueGruppePage() {
  const { user, profile } = await getSessionAndProfile();

  if (!user) return <LoginForm />;
  if (profile?.role !== "verwaltung") return <AccessDenied />;

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <VerwaltungNav />

      <h1 className="mb-6 text-2xl font-bold">Neue Gruppe</h1>

      <form action={createGroup} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium">Gruppenname</label>
          <input
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white hover:bg-orange-700"
        >
          Erstellen
        </button>
      </form>
    </div>
  );
}
