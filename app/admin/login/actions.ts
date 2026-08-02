"use server";

import { isAdminUser } from "@/lib/auth/admin";
import { createClientServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const handleLogin = async (
  previousState: unknown,
  formData: FormData,
) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const requestedDestination = formData.get("next");

  if (!email || !password) {
    return { error: "Uzupełnij email i hasło" };
  }

  const supabase = await createClientServer();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user || !isAdminUser(data.user)) {
    if (data.user) {
      await supabase.auth.signOut();
    }

    return { error: "Nieprawidlowy email lub haslo" };
  }

  const destination =
    typeof requestedDestination === "string" &&
    requestedDestination.startsWith("/admin/") &&
    !requestedDestination.startsWith("//")
      ? requestedDestination
      : "/admin/dashboard";

  redirect(destination);
};
