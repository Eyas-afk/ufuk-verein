import "../plain.css";

export const metadata = {
  title: "Zugang aktivieren – Ufuk e.V.",
};

export default function EinladungLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen bg-neutral-50 text-neutral-900 antialiased">
        {children}
      </body>
    </html>
  );
}
