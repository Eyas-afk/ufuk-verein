import "./verwaltung.css";

export const metadata = {
  title: "Verwaltung – Ufuk e.V.",
};

export default function VerwaltungLayout({ children }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
