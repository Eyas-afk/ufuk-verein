import "server-only";
import { Resend } from "resend";
import { weekdayLabels } from "@/lib/weekdays";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM;

function formatSchedule(locale, weekday, startTime, endTime) {
  const day = weekdayLabels[weekday]?.[locale] ?? weekday;
  const time = `${startTime?.slice(0, 5)}–${endTime?.slice(0, 5)}`;
  return locale === "de" ? `${day}, ${time} Uhr` : `${day}، ${time}`;
}

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
    groupAssignedParent: {
      subject: (groupName) => `Gruppeneinteilung: ${groupName} – Ufuk e.V.`,
      html: (childName, groupName, schedule) => `
        <p>Hallo,</p>
        <p><strong>${childName}</strong> wurde der Gruppe <strong>${groupName}</strong> zugeteilt.</p>
        <p>Termin: ${schedule}</p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `,
    },
    groupAssignedTeacher: {
      subject: (groupName) => `Deine Gruppe: ${groupName} – Ufuk e.V.`,
      html: (groupName, schedule, studentNames) => `
        <p>Hallo,</p>
        <p>dir wurde die Gruppe <strong>${groupName}</strong> zugeteilt.</p>
        <p>Termin: ${schedule}</p>
        <p>Schüler: ${studentNames.length ? studentNames.join(", ") : "noch keine zugewiesen"}</p>
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
    groupAssignedParent: {
      subject: (groupName) => `تم تعيين المجموعة: ${groupName} – نادي أفق`,
      html: (childName, groupName, schedule) => `
        <p dir="rtl">مرحبًا،</p>
        <p dir="rtl">تم تعيين <strong>${childName}</strong> إلى المجموعة <strong>${groupName}</strong>.</p>
        <p dir="rtl">الموعد: ${schedule}</p>
        <p dir="rtl">مع تحيات نادي أفق</p>
      `,
    },
    groupAssignedTeacher: {
      subject: (groupName) => `مجموعتك: ${groupName} – نادي أفق`,
      html: (groupName, schedule, studentNames) => `
        <p dir="rtl">مرحبًا،</p>
        <p dir="rtl">تم تعيينك لتدريس المجموعة <strong>${groupName}</strong>.</p>
        <p dir="rtl">الموعد: ${schedule}</p>
        <p dir="rtl">الطلاب: ${studentNames.length ? studentNames.join("، ") : "لم يتم تعيين أحد بعد"}</p>
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

export async function sendGroupAssignedParentEmail({
  to,
  locale,
  childName,
  groupName,
  weekday,
  startTime,
  endTime,
}) {
  const t = content[locale]?.groupAssignedParent ?? content.ar.groupAssignedParent;
  const schedule = formatSchedule(locale, weekday, startTime, endTime);
  return resend.emails.send({
    from,
    to,
    subject: t.subject(groupName),
    html: t.html(childName, groupName, schedule),
  });
}

export async function sendGroupAssignedTeacherEmail({
  to,
  locale,
  groupName,
  weekday,
  startTime,
  endTime,
  studentNames,
}) {
  const t = content[locale]?.groupAssignedTeacher ?? content.ar.groupAssignedTeacher;
  const schedule = formatSchedule(locale, weekday, startTime, endTime);
  return resend.emails.send({
    from,
    to,
    subject: t.subject(groupName),
    html: t.html(groupName, schedule, studentNames),
  });
}

// Nur Deutsch: wird ausschließlich vom (einsprachigen) Verwaltungsbereich ausgelöst.
export async function sendPasswordResetEmail({ to, link }) {
  return resend.emails.send({
    from,
    to,
    subject: "Passwort zurücksetzen – Ufuk e.V.",
    html: `
      <p>Hallo,</p>
      <p>du hast eine Zurücksetzung deines Passworts angefordert.</p>
      <p><a href="${link}">Neues Passwort festlegen</a></p>
      <p>Falls du das nicht warst, kannst du diese E-Mail einfach ignorieren.</p>
      <p>Viele Grüße<br/>Ufuk e.V.</p>
    `,
  });
}
