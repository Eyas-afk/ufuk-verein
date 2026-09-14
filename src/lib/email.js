import "server-only";
import { Resend } from "resend";
import { weekdayLabels } from "@/lib/weekdays";

const resend = new Resend(process.env.RESEND_API_KEY);
const from = process.env.EMAIL_FROM;
const replyTo = "ufukkulturverein@gmail.com";

function formatSchedule(locale, weekday, startTime, endTime) {
  const day = weekdayLabels[weekday]?.[locale] ?? weekday;
  const time = `${startTime?.slice(0, 5)}–${endTime?.slice(0, 5)}`;
  return locale === "de" ? `${day}, ${time} Uhr` : `${day}، ${time}`;
}

// Jede Mail an Eltern/Lehrkräfte enthält beide Sprachen im selben Schreiben,
// da wir nicht wissen, welche Sprache die empfangende Person bevorzugt.
function bilingualHtml(arHtml, deHtml) {
  return `
    <div dir="rtl" style="text-align:right;">
      ${arHtml}
    </div>
    <hr style="margin:24px 0;border:none;border-top:1px solid #ddd;" />
    <div dir="ltr" style="text-align:left;">
      ${deHtml}
    </div>
  `;
}

export async function sendTeacherInviteEmail({ to, link }) {
  return resend.emails.send({
    from,
    to,
    replyTo,
    subject: "تم قبول طلبك – نادي أفق / Deine Bewerbung wurde angenommen – Ufuk e.V.",
    html: bilingualHtml(
      `
        <p>مرحبًا،</p>
        <p>تم قبول طلبك للتدريس لدى نادي أفق.</p>
        <p>يرجى تعيين كلمة مرور لحسابك عبر الرابط التالي:</p>
        <p><a href="${link}">تعيين كلمة المرور</a></p>
        <p>مع تحيات نادي أفق</p>
      `,
      `
        <p>Hallo,</p>
        <p>deine Bewerbung als Lehrer bei Ufuk e.V. wurde angenommen.</p>
        <p>Bitte lege über den folgenden Link ein Passwort für dein Konto fest:</p>
        <p><a href="${link}">Passwort festlegen</a></p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `
    ),
  });
}

export async function sendRegistrationApprovedEmail({ to, childName }) {
  return resend.emails.send({
    from,
    to,
    replyTo,
    subject: "تم تأكيد التسجيل – نادي أفق / Registrierung bestätigt – Ufuk e.V.",
    html: bilingualHtml(
      `
        <p>مرحبًا،</p>
        <p>تم تأكيد تسجيل <strong>${childName}</strong> في دورة اللغة العربية لدى نادي أفق.</p>
        <p>كما نرجو منكم تحويل الاشتراك الشهري: 15 يورو للطفل الأول، و10 يورو لكل طفل إضافي، بالإضافة إلى 20 يورو لمرة واحدة مقابل الكتاب الدراسي (في حال لم يكن لدى طفلكم كتاب بعد).</p>
        <p>
          رقم الحساب البنكي (IBAN): <strong>DE32&nbsp;2305&nbsp;2750&nbsp;0082&nbsp;1685&nbsp;19</strong><br/>
          رمز BIC: <strong>NOLADE21RZB</strong><br/>
          الغرض من التحويل (Verwendungszweck): اسم الطفل والشهر الذي يخص عنه الاشتراك، مثال: Ahmad Ali – September
        </p>
        <p>مع تحيات نادي أفق</p>
      `,
      `
        <p>Hallo,</p>
        <p>die Registrierung von <strong>${childName}</strong> für den Arabischkurs bei Ufuk e.V. wurde bestätigt.</p>
        <p>Wir bitten Sie außerdem, den monatlichen Beitrag zu überweisen: 15 € für das erste Kind, 10 € für jedes weitere Kind, zuzüglich einmalig 20 € für das Lehrbuch (falls Ihr Kind noch kein Buch besitzt).</p>
        <p>
          IBAN: <strong>DE32&nbsp;2305&nbsp;2750&nbsp;0082&nbsp;1685&nbsp;19</strong><br/>
          BIC: <strong>NOLADE21RZB</strong><br/>
          Verwendungszweck: Name des Kindes und der Monat, für den der Beitrag bestimmt ist, z. B.: Ahmad Ali – September
        </p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `
    ),
  });
}

export async function sendGroupAssignedParentEmail({
  to,
  childName,
  groupName,
  weekday,
  startTime,
  endTime,
}) {
  const scheduleAr = formatSchedule("ar", weekday, startTime, endTime);
  const scheduleDe = formatSchedule("de", weekday, startTime, endTime);
  return resend.emails.send({
    from,
    to,
    replyTo,
    subject: `تم تعيين المجموعة: ${groupName} – نادي أفق / Gruppeneinteilung: ${groupName} – Ufuk e.V.`,
    html: bilingualHtml(
      `
        <p>مرحبًا،</p>
        <p>تم تعيين <strong>${childName}</strong> إلى المجموعة <strong>${groupName}</strong>.</p>
        <p>الموعد: ${scheduleAr}</p>
        <p>مع تحيات نادي أفق</p>
      `,
      `
        <p>Hallo,</p>
        <p><strong>${childName}</strong> wurde der Gruppe <strong>${groupName}</strong> zugeteilt.</p>
        <p>Termin: ${scheduleDe}</p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `
    ),
  });
}

export async function sendGroupAssignedTeacherEmail({
  to,
  groupName,
  weekday,
  startTime,
  endTime,
  studentNames,
}) {
  const scheduleAr = formatSchedule("ar", weekday, startTime, endTime);
  const scheduleDe = formatSchedule("de", weekday, startTime, endTime);
  return resend.emails.send({
    from,
    to,
    replyTo,
    subject: `مجموعتك: ${groupName} – نادي أفق / Deine Gruppe: ${groupName} – Ufuk e.V.`,
    html: bilingualHtml(
      `
        <p>مرحبًا،</p>
        <p>تم تعيينك لتدريس المجموعة <strong>${groupName}</strong>.</p>
        <p>الموعد: ${scheduleAr}</p>
        <p>الطلاب: ${studentNames.length ? studentNames.join("، ") : "لم يتم تعيين أحد بعد"}</p>
        <p>مع تحيات نادي أفق</p>
      `,
      `
        <p>Hallo,</p>
        <p>dir wurde die Gruppe <strong>${groupName}</strong> zugeteilt.</p>
        <p>Termin: ${scheduleDe}</p>
        <p>Schüler: ${studentNames.length ? studentNames.join(", ") : "noch keine zugewiesen"}</p>
        <p>Viele Grüße<br/>Ufuk e.V.</p>
      `
    ),
  });
}

// Nur Deutsch: wird ausschließlich vom (einsprachigen) Verwaltungsbereich ausgelöst.
export async function sendPasswordResetEmail({ to, link }) {
  return resend.emails.send({
    from,
    to,
    replyTo,
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
