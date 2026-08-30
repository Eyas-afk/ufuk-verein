import "server-only";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM;

const content = {
  de: {
    teacherInvite: {
      subject: "Deine Bewerbung wurde angenommen – Ufuk e.V.",
      html: (link) => `
        <p>Hallo,</p>
        <p>deine Bewerbung als Lehrer bei Ufuk e.V. wurde angenommen.</p>
        <p>Bitte lege über den folgenden Link ein Passwort für dein Konto fest:</p>
        <p><a href="${link}">Passwort festlegen</a></p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `,
    },
    registrationApproved: {
      subject: "Registrierung bestätigt – Ufuk e.V.",
      html: (childName) => `
        <p>Hallo,</p>
        <p>die Registrierung von <strong>${childName}</strong> für den Arabischkurs bei Ufuk e.V. wurde bestätigt.</p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `,
    },
  },
  ar: {
    teacherInvite: {
      subject: "تم قبول طلبك – نادي أفق",
      html: (link) => `
        <p dir="rtl">مرحبًا،</p>
        <p dir="rtl">تم قبول طلبك للتدريس لدى نادي أفق.</p>
        <p dir="rtl">يرجى تعيين كلمة مرور لحسابك عبر الرابط التالي:</p>
        <p dir="rtl"><a href="${link}">تعيين كلمة المرور</a></p>
        <p dir="rtl">مع تحيات نادي أفق</p>
      `,
    },
    registrationApproved: {
      subject: "تم تأكيد التسجيل – نادي أفق",
      html: (childName) => `
        <p dir="rtl">مرحبًا،</p>
        <p dir="rtl">تم تأكيد تسجيل <strong>${childName}</strong> في دورة اللغة العربية لدى نادي أفق.</p>
        <p dir="rtl">مع تحيات نادي أفق</p>
      `,
    },
  },
};

export async function sendTeacherInviteEmail({ to, locale, link }) {
  const t = content[locale]?.teacherInvite ?? content.ar.teacherInvite;
  return resend.emails.send({
    from,
    to,
    subject: t.subject,
    html: t.html(link),
  });
}

export async function sendRegistrationApprovedEmail({ to, locale, childName }) {
  const t = content[locale]?.registrationApproved ?? content.ar.registrationApproved;
  return resend.emails.send({
    from,
    to,
    subject: t.subject,
    html: t.html(childName),
  });
}
