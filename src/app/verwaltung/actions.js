"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

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
  await supabase.from("registrations").update({ status }).eq("id", id);
  revalidatePath("/verwaltung");
}

export async function setTeacherApplicationStatus(id, status) {
  const supabase = await createClient();
  await supabase.from("teacher_applications").update({ status }).eq("id", id);
  revalidatePath("/verwaltung");
}
