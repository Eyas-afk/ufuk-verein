"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Nur Lehrkräfte bekommen ein echtes Konto in diesem System – eine E-Mail,
// die schon ein Konto hat, kann also nicht doppelt als Lehrer bestätigt werden.
export async function checkEmailHasAccount(email) {
  const admin = createAdminClient();
  const { data } = await admin.auth.admin.listUsers();
  return data?.users.some((u) => u.email?.toLowerCase() === email.toLowerCase()) ?? false;
}
