"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendTeacherInviteEmail, sendRegistrationApprovedEmail } from "@/lib/email";

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
