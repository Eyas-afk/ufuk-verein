"use client";

import { useSearchParams } from "next/navigation";
import PasswordSetupFlow from "../PasswordSetupFlow";

const texts = {
  de: {
    title: "Passwort festlegen",
    confirmIntro: "Willkommen bei Ufuk e.V.! Klicke unten, um deine Einladung zu bestätigen.",
    confirmButton: "Einladung bestätigen",
    verifying: "Wird geprüft …",
    intro: "Bitte lege ein Passwort für dein Lehrer-Konto fest.",
    password: "Passwort",
    passwordConfirm: "Passwort wiederholen",
    submit: "Konto aktivieren",
    submitting: "Wird gespeichert …",
    mismatch: "Die Passwörter stimmen nicht überein.",
    tooShort: "Das Passwort muss mindestens 8 Zeichen lang sein.",
    error: "Der Link ist ungültig oder abgelaufen. Bitte wende dich an die Verwaltung.",
    success: "Dein Konto ist aktiviert! Du kannst dich jetzt einloggen.",
    loginLink: "Zum Login",
  },
  ar: {
    title: "تعيين كلمة المرور",
    confirmIntro: "مرحبًا بك في نادي أفق! اضغط أدناه لتأكيد الدعوة.",
    confirmButton: "تأكيد الدعوة",
    verifying: "جارٍ التحقق …",
    intro: "يرجى تعيين كلمة مرور لحساب المعلم الخاص بك.",
    password: "كلمة المرور",
    passwordConfirm: "تأكيد كلمة المرور",
    submit: "تفعيل الحساب",
    submitting: "جارٍ الحفظ …",
    mismatch: "كلمتا المرور غير متطابقتين.",
    tooShort: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل.",
    error: "الرابط غير صالح أو منتهي الصلاحية. يرجى التواصل مع الإدارة.",
    success: "تم تفعيل حسابك! يمكنك الآن تسجيل الدخول.",
    loginLink: "الذهاب لتسجيل الدخول",
  },
};

export default function EinladungClient() {
  const params = useSearchParams();
  const lang = params.get("lang") === "de" ? "de" : "ar";
  const dir = lang === "ar" ? "rtl" : "ltr";

  return <PasswordSetupFlow texts={texts[lang]} dir={dir} loginHref="/verwaltung" />;
}
