import type { User } from "@supabase/supabase-js";

const splitValues = (value: string | undefined) =>
  (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const configuredAdminUserIds = () =>
  new Set(splitValues(process.env.RUGGY_ADMIN_USER_IDS));

const configuredAdminEmails = () =>
  new Set(
    splitValues(process.env.RUGGY_ADMIN_EMAILS).map((email) =>
      email.toLowerCase(),
    ),
  );

/**
 * Authorization is deliberately fail closed. A signed in Supabase user is
 * not automatically a Ruggy administrator.
 */
export const isAdminUser = (
  user: Pick<
    User,
    "id" | "email" | "app_metadata" | "email_confirmed_at" | "confirmed_at"
  >,
) => {
  if (!user.email_confirmed_at && !user.confirmed_at) {
    return false;
  }

  const role = user.app_metadata?.role;

  if (role === "admin" || user.app_metadata?.is_admin === true) {
    return true;
  }

  if (configuredAdminUserIds().has(user.id)) {
    return true;
  }

  return Boolean(
    user.email && configuredAdminEmails().has(user.email.toLowerCase()),
  );
};
