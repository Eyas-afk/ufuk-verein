import Image from "next/image";

export default function LogoIntro() {
  return (
    <div className="flex justify-center py-2">
      <Image
        src="/logo-home.jpeg"
        alt="Ufuk e.V."
        width={230}
        height={277}
        priority
        className="h-auto w-52 sm:w-64"
      />
    </div>
  );
}
