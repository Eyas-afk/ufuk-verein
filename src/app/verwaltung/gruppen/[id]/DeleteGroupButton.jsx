"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

function ConfirmSubmit({ t, onCancel }) {
  const { pending } = useFormStatus();

  return (
    <div className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
      <span className="text-sm text-red-800">{t.deleteConfirm}</span>
      <button
        type="submit"
        disabled={pending}
        className="shrink-0 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? t.deleting : t.deleteYes}
      </button>
      <button
        type="button"
        onClick={onCancel}
        disabled={pending}
        className="shrink-0 text-sm text-neutral-600 underline"
      >
        {t.deleteCancel}
      </button>
    </div>
  );
}

export default function DeleteGroupButton({ deleteAction, t }) {
  const [confirming, setConfirming] = useState(false);

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="text-sm text-red-600 underline transition hover:text-red-800"
      >
        {t.delete}
      </button>
    );
  }

  return (
    <form action={deleteAction}>
      <ConfirmSubmit t={t} onCancel={() => setConfirming(false)} />
    </form>
  );
}
