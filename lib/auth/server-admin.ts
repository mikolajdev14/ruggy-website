import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClientServer } from "@/lib/supabase/server";
import { isAdminUser } from "./admin";

export async function getAdminUser() {
  const supabase = await createClientServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user && isAdminUser(user) ? user : null;
}

export async function getAuthorizedAdminClient() {
  const user = await getAdminUser();
  return user ? createAdminClient() : null;
}
