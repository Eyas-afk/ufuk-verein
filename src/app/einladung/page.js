import { Suspense } from "react";
import EinladungClient from "./EinladungClient";

export default function EinladungPage() {
  return (
    <Suspense fallback={null}>
      <EinladungClient />
    </Suspense>
  );
}
