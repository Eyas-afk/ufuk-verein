"use client";

import { useFormStatus } from "react-dom";

const variants = {
  primary: "bg-orange-600 text-white hover:bg-orange-700",
  approve: "bg-green-600 text-white hover:bg-green-700",
  reject: "bg-red-600 text-white hover:bg-red-700",
  neutral: "border border-neutral-300 text-neutral-700 hover:bg-neutral-100",
};

export default function SubmitButton({
  children,
  pendingText = "Wird gespeichert …",
  variant = "primary",
  formAction,
  className = "",
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      formAction={formAction}
      disabled={pending}
      className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
    >
      {pending ? pendingText : children}
    </button>
  );
}
