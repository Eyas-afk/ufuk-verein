import "server-only";
import { createClient } from "@supabase/supabase-js";

// Nutzt den service_role-Key: umgeht alle RLS-Regeln. Nur für vertrauenswürdigen
// Server-Code (z. B. Server Actions), niemals mit Nutzereingaben ungeprüft verwenden.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
