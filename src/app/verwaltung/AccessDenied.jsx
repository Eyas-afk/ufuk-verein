import { logout } from "./actions";

export default function AccessDenied({ message = "Kein Zugriff für dieses Konto." }) {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p>{message}</p>
      <form action={logout}>
        <button type="submit" className="mt-4 underline">
          Abmelden
        </button>
      </form>
    </div>
  );
}
