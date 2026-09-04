import "../plain.css";
import CalligraphyBackground from "../CalligraphyBackground";

export const metadata = {
  title: "Passwort zurücksetzen – Ufuk e.V.",
};

export default function PasswortZuruecksetzenLayout({ children }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <CalligraphyBackground />
        {children}
      </body>
    </html>
  );
}
