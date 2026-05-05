import { createClient } from "@supabase/supabase-js";

// Service role client — bypasses RLS. Server-only.
// Untyped intentionally: avoids strict TypeScript inference issues
// with handwritten Database types. All queries use runtime validation.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
