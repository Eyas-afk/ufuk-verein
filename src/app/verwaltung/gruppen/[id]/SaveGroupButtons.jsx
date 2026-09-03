"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

export default function SaveGroupButtons({ saveAction, saveAndNotifyAction, t }) {
  const { pending } = useFormStatus();
  const [clicked, setClicked] = useState(null); // "save" | "notify"

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="submit"
        formAction={saveAction}
        onClick={() => setClicked("save")}
        disabled={pending}
        className="rounded-lg border border-neutral-300 px-4 py-2 font-semibold text-neutral-700 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && clicked === "save" ? t.saving : t.save}
      </button>
      <button
        type="submit"
        formAction={saveAndNotifyAction}
        onClick={() => setClicked("notify")}
        disabled={pending}
        className="rounded-lg bg-orange-600 px-4 py-2 font-semibold text-white transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending && clicked === "notify" ? t.notifying : t.confirmNotify}
      </button>
    </div>
  );
}
