import { logout } from "./actions";

export default function AccessDenied({ message = "Kein Zugriff für dieses Konto." }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-neutral-700">{message}</p>
        <form action={logout}>
          <button type="submit" className="mt-4 text-sm text-neutral-500 underline">
            Abmelden
          </button>
        </form>
      </div>
    </div>
  );
}
