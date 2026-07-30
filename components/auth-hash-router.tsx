"use client";

import { useEffect } from "react";

/**
 * Supabase's default invite link returns the session in the URL fragment.
 * Fragments never reach Next.js, so route invite sessions to the page that
 * can consume them in the browser before the admin proxy asks for a session.
 */
export default function AuthHashRouter() {
  useEffect(() => {
    if (window.location.pathname === "/admin/set-password") {
      return;
    }

    const hash = window.location.hash.slice(1);
    const params = new URLSearchParams(hash);

    const isInvite = params.get("type") === "invite";
    const isExpiredInvite = params.get("error_code") === "otp_expired";

    if (!isInvite && !isExpiredInvite) {
      return;
    }

    window.location.replace(`/admin/set-password#${hash}`);
  }, []);

  return null;
}
