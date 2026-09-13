import Image from "next/image";
import LogoBackgroundSlideshow from "./LogoBackgroundSlideshow";

export default function LogoIntro() {
  return (
    <div className="relative flex min-h-[280px] items-center justify-center py-10 sm:min-h-[360px]">
      <div className="absolute inset-y-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <LogoBackgroundSlideshow />
      </div>
      <Image
        src="/logo-home.jpeg"
        alt="Ufuk e.V."
        width={230}
        height={277}
        priority
        className="relative z-10 h-auto w-52 rounded-xl shadow-lg sm:w-64"
      />
    </div>
  );
}
