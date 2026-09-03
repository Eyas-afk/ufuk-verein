import { Suspense } from "react";
import PasswortZuruecksetzenClient from "./PasswortZuruecksetzenClient";

export default function PasswortZuruecksetzenPage() {
  return (
    <Suspense fallback={null}>
      <PasswortZuruecksetzenClient />
    </Suspense>
  );
}
