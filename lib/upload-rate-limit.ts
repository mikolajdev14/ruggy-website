import "server-only";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

async function consumePublicActionLimit(
  namespace: string,
  limit: number,
  windowSeconds: number,
) {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0];
  const clientAddress =
    forwardedFor?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    "unknown-client";
  const fingerprint = createHash("sha256")
    .update(clientAddress)
    .digest("hex");

  const { data, error } = await createAdminClient().rpc(
    "consume_upload_rate_limit",
    {
      p_key: `${namespace}:${fingerprint}`,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    },
  );

  if (error) {
    console.error("Nie udało się sprawdzić limitu akcji publicznej:", error);
    return { allowed: false, unavailable: true };
  }

  return { allowed: data === true, unavailable: false };
}

export function consumeReferenceImageUploadLimit() {
  return consumePublicActionLimit("reference-image", 12, 60 * 60);
}

export function consumeContactBookingLimit() {
  return consumePublicActionLimit("contact-booking", 6, 60 * 60);
}

export function consumeAgreedProjectPaymentLimit() {
  return consumePublicActionLimit("agreed-project-payment", 12, 60 * 60);
}
