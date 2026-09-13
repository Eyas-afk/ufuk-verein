"use client";

import { useSearchParams } from "next/navigation";
import PasswordSetupFlow from "../PasswordSetupFlow";
import { getAdminDict } from "@/lib/adminDictionary";

export default function PasswortZuruecksetzenClient() {
  const params = useSearchParams();
  const locale = params.get("lang") === "ar" ? "ar" : "de";
  const dict = getAdminDict(locale).resetPassword;
  const dir = locale === "ar" ? "rtl" : "ltr";

  const texts = {
    title: dict.title,
    confirmIntro: dict.confirmIntro,
    confirmButton: dict.confirmButton,
    verifying: dict.verifying,
    password: dict.newPassword,
    passwordConfirm: dict.repeatPassword,
    submit: dict.save,
    submitting: dict.saving,
    mismatch: dict.mismatch,
    tooShort: dict.tooShort,
    error: dict.error,
    success: dict.success,
    loginLink: dict.toLogin,
  };

  return <PasswordSetupFlow texts={texts} dir={dir} loginHref="/verwaltung" />;
}
