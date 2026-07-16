import "server-only";

import { isValidDateKey } from "@/lib/booking-date";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";

export type FulfillmentResult =
  | { success: true }
  | {
      success: false;
      reason:
        | "invalid_session"
        | "not_paid"
        | "missing_metadata"
        | "database_error";
      message: string;
    };

const optionalMetadata = (value: string | undefined) => value?.trim() || null;

export async function fulfillCheckout(
  sessionId: string,
): Promise<FulfillmentResult> {
  if (!sessionId.startsWith("cs_")) {
    return {
      success: false,
      reason: "invalid_session",
      message: "Nieprawidłowy identyfikator płatności.",
    };
  }

  let session;

  try {
    session = await getStripe().checkout.sessions.retrieve(sessionId);
  } catch (error) {
    console.error("Nie udało się pobrać sesji Stripe:", error);
    return {
      success: false,
      reason: "invalid_session",
      message: "Nie udało się potwierdzić płatności w Stripe.",
    };
  }

  if (session.payment_status !== "paid") {
    return {
      success: false,
      reason: "not_paid",
      message: "Płatność nie została jeszcze potwierdzona.",
    };
  }

  const metadata = session.metadata ?? {};
  const rugTypeId = Number(metadata.rugTypeId);
  const rugSizeId = Number(metadata.pickedSize);
  const bookingDate = metadata.pickupDate?.slice(0, 10);
  const customerEmail =
    session.customer_details?.email ?? session.customer_email;

  if (
    !Number.isInteger(rugTypeId) ||
    !Number.isInteger(rugSizeId) ||
    !metadata.rugTypeName ||
    !metadata.rugSizeLabel ||
    !metadata.customerName ||
    !customerEmail ||
    !bookingDate ||
    !isValidDateKey(bookingDate) ||
    session.amount_total == null
  ) {
    console.error("Sesja Stripe nie zawiera kompletnych danych zamówienia:", {
      sessionId: session.id,
      metadata,
    });
    return {
      success: false,
      reason: "missing_metadata",
      message: "Płatność nie zawiera kompletnych danych zamówienia.",
    };
  }

  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  const supabase = createAdminClient();
  const { error } = await supabase.from("bookings").upsert(
    {
      rug_type_id: rugTypeId,
      rug_size_id: rugSizeId,
      rug_type_name: metadata.rugTypeName,
      rug_size_label: metadata.rugSizeLabel,
      price_cents: session.amount_total,
      customer_name: metadata.customerName,
      customer_email: customerEmail,
      customer_phone: optionalMetadata(metadata.customerPhone),
      notes: optionalMetadata(metadata.customerNotes),
      delivery_method: optionalMetadata(metadata.deliveryMethod),
      parcel_locker_code: optionalMetadata(metadata.parcelLockerCode),
      delivery_address: optionalMetadata(metadata.deliveryAddress),
      reference_image_path: optionalMetadata(metadata.referenceImagePath),
      booking_date: bookingDate,
      status: "paid",
      stripe_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId ?? null,
      expires_at: new Date(session.expires_at * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_session_id" },
  );

  if (error) {
    console.error("Nie udało się zapisać zamówienia w Supabase:", error);
    return {
      success: false,
      reason: "database_error",
      message: error.message,
    };
  }

  return { success: true };
}
