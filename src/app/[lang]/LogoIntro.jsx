import Image from "next/image";

export default function LogoIntro() {
  return (
    <div className="flex justify-center py-2">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <Image
          src="/logo.jpeg"
          alt="Ufuk e.V."
          width={230}
          height={280}
          priority
          className="h-auto w-52 sm:w-64"
        />
      </div>
    </div>
  );
}
