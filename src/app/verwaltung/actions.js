"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  sendTeacherInviteEmail,
  sendRegistrationApprovedEmail,
  sendGroupAssignedParentEmail,
  sendGroupAssignedTeacherEmail,
} from "@/lib/email";

export async function login(formData) {
  const supabase = await createClient();
  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "E-Mail oder Passwort ist falsch." };
  }

  revalidatePath("/verwaltung");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/verwaltung");
}

export async function setRegistrationStatus(id, status) {
  const supabase = await createClient();

  const { data: registration } = await supabase
    .from("registrations")
    .select("child_name, email, locale")
    .eq("id", id)
    .single();

  await supabase.from("registrations").update({ status }).eq("id", id);

  if (status === "approved" && registration) {
    try {
      await sendRegistrationApprovedEmail({
        to: registration.email,
        locale: registration.locale,
        childName: registration.child_name,
      });
    } catch (err) {
      console.error("Bestätigungsmail (Registrierung) konnte nicht gesendet werden:", err);
    }
  }

  revalidatePath("/verwaltung");
}

export async function setTeacherApplicationStatus(id, status) {
  const supabase = await createClient();

  const { data: application } = await supabase
    .from("teacher_applications")
    .select("full_name, email, locale")
    .eq("id", id)
    .single();

  await supabase.from("teacher_applications").update({ status }).eq("id", id);

  if (status === "approved" && application) {
    try {
      const admin = createAdminClient();

      const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
        type: "invite",
        email: application.email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/einladung?lang=${application.locale}`,
        },
      });

      if (linkError) throw linkError;

      await admin.from("profiles").insert({
        id: linkData.user.id,
        full_name: application.full_name,
        role: "lehrer",
        locale: application.locale,
      });

      await sendTeacherInviteEmail({
        to: application.email,
        locale: application.locale,
        link: linkData.properties.action_link,
      });
    } catch (err) {
      console.error("Einladung an Lehrer konnte nicht erstellt/gesendet werden:", err);
    }
  }

  revalidatePath("/verwaltung");
}

export async function createGroup(formData) {
  const supabase = await createClient();
  const name = formData.get("name");

  const { data: group, error } = await supabase
    .from("groups")
    .insert({ name })
    .select("id")
    .single();

  if (error) {
    console.error("Gruppe konnte nicht erstellt werden:", error);
    return;
  }

  revalidatePath("/verwaltung/gruppen");
  redirect(`/verwaltung/gruppen/${group.id}`);
}

export async function saveGroup(id, notify, formData) {
  const supabase = await createClient();

  const name = formData.get("name");
  const teacherId = formData.get("teacherId") || null;
  const weekday = formData.get("weekday") || null;
  const startTime = formData.get("startTime") || null;
  const endTime = formData.get("endTime") || null;
  const studentIds = formData.getAll("studentIds");

  await supabase
    .from("groups")
    .update({ name, teacher_id: teacherId, weekday, start_time: startTime, end_time: endTime })
    .eq("id", id);

  // Erst alle bisherigen Zuordnungen zu dieser Gruppe lösen, dann die aktuell
  // ausgewählten Kinder neu zuweisen – vermeidet komplexe "nicht mehr angehakt"-Logik.
  await supabase.from("registrations").update({ group_id: null }).eq("group_id", id);
  if (studentIds.length > 0) {
    await supabase.from("registrations").update({ group_id: id }).in("id", studentIds);
  }

  if (notify) {
    const { data: group } = await supabase
      .from("groups")
      .select("name, weekday, start_time, end_time, teacher_id")
      .eq("id", id)
      .single();

    const { data: students } = await supabase
      .from("registrations")
      .select("child_name, email, locale")
      .eq("group_id", id);

    for (const student of students ?? []) {
      try {
        await sendGroupAssignedParentEmail({
          to: student.email,
          locale: student.locale,
          childName: student.child_name,
          groupName: group.name,
          weekday: group.weekday,
          startTime: group.start_time,
          endTime: group.end_time,
        });
      } catch (err) {
        console.error("Gruppen-Benachrichtigung (Eltern) fehlgeschlagen:", err);
      }
    }

    if (group.teacher_id) {
      const { data: teacherProfile } = await supabase
        .from("profiles")
        .select("locale")
        .eq("id", group.teacher_id)
        .single();

      const { data: adminAuth } = await createAdminClient().auth.admin.getUserById(
        group.teacher_id
      );

      if (adminAuth?.user?.email) {
        try {
          await sendGroupAssignedTeacherEmail({
            to: adminAuth.user.email,
            locale: teacherProfile?.locale,
            groupName: group.name,
            weekday: group.weekday,
            startTime: group.start_time,
            endTime: group.end_time,
            studentNames: (students ?? []).map((s) => s.child_name),
          });
        } catch (err) {
          console.error("Gruppen-Benachrichtigung (Lehrer) fehlgeschlagen:", err);
        }
      }
    }

    await supabase
      .from("groups")
      .update({ last_notified_at: new Date().toISOString() })
      .eq("id", id);
  }

  revalidatePath(`/verwaltung/gruppen/${id}`);
  revalidatePath("/verwaltung/gruppen");
  revalidatePath("/verwaltung");
}

export async function createLesson(groupId) {
  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const { data: existing } = await supabase
    .from("lessons")
    .select("id")
    .eq("group_id", groupId)
    .eq("date", today)
    .maybeSingle();

  if (existing) {
    redirect(`/verwaltung/unterricht/${groupId}/${existing.id}`);
  }

  const { data, error } = await supabase
    .from("lessons")
    .insert({ group_id: groupId, date: today })
    .select("id")
    .single();

  if (error) {
    console.error("Unterrichtsstunde konnte nicht erstellt werden:", error);
    return;
  }

  redirect(`/verwaltung/unterricht/${groupId}/${data.id}`);
}

export async function saveAttendance(lessonId, studentIds, formData) {
  const supabase = await createClient();

  const rows = studentIds.map((studentId) => ({
    lesson_id: lessonId,
    student_id: studentId,
    present: formData.get(`present-${studentId}`) === "on",
    homework_done: formData.get(`homework-${studentId}`) === "on",
    notes: formData.get(`notes-${studentId}`) || null,
  }));

  if (rows.length > 0) {
    await supabase.from("attendance").upsert(rows, { onConflict: "lesson_id,student_id" });
  }

  revalidatePath(`/verwaltung/unterricht/${lessonId}`);
}
