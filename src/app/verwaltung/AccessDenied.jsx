import { logout } from "./actions";
import { getAdminDict } from "@/lib/adminDictionary";

export default function AccessDenied({ locale = "ar", message }) {
  const t = getAdminDict(locale).accessDenied;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
        <p className="text-neutral-700">{message || t.default}</p>
        <form action={logout}>
          <button type="submit" className="mt-4 text-sm text-neutral-500 underline">
            {t.logout}
          </button>
        </form>
      </div>
    </div>
  );
}
