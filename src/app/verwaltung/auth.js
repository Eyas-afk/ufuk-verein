import { createClient } from "@/lib/supabase/server";

export async function getSessionAndProfile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, locale")
    .eq("id", user.id)
    .single();

  return { supabase, user, profile };
}
