"use client";

import { useFormStatus } from "react-dom";

function ConfirmedSubmit({ t }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(t.deleteConfirm)) {
          e.preventDefault();
        }
      }}
      className="text-sm text-red-600 underline transition hover:text-red-800 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? t.deleting : t.delete}
    </button>
  );
}

export default function DeleteGroupButton({ deleteAction, t }) {
  return (
    <form action={deleteAction}>
      <ConfirmedSubmit t={t} />
    </form>
  );
}
