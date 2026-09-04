export default function CalligraphyBackground() {
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 bg-cover bg-center opacity-[0.07]"
      style={{ backgroundImage: "url('/bg-calligraphy.webp')" }}
      aria-hidden="true"
    />
  );
}
