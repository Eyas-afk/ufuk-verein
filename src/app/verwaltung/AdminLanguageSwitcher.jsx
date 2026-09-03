import { FlagDE, FlagSY } from "../[lang]/Flags";
import { setMyLocale } from "./actions";

export default function AdminLanguageSwitcher({ locale }) {
  return (
    <div className="flex items-center gap-2">
      <form action={setMyLocale.bind(null, "ar")}>
        <button
          type="submit"
          title="العربية"
          aria-label="العربية"
          className={locale === "ar" ? "opacity-100" : "opacity-50 hover:opacity-80"}
        >
          <FlagSY className="h-4 w-6 rounded-sm shadow-sm" />
        </button>
      </form>
      <form action={setMyLocale.bind(null, "de")}>
        <button
          type="submit"
          title="Deutsch"
          aria-label="Deutsch"
          className={locale === "de" ? "opacity-100" : "opacity-50 hover:opacity-80"}
        >
          <FlagDE className="h-4 w-6 rounded-sm shadow-sm" />
        </button>
      </form>
    </div>
  );
}
