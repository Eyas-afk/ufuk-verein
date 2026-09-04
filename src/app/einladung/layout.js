import "../plain.css";
import CalligraphyBackground from "../CalligraphyBackground";

export const metadata = {
  title: "Zugang aktivieren – Ufuk e.V.",
};

export default function EinladungLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        <CalligraphyBackground />
        {children}
      </body>
    </html>
  );
}
