"use server";

import {
  getMinimumBookingDateKey,
  isValidDateKey,
} from "@/lib/booking-date";
import {
  calculateCustomRugPriceCents,
  formatCustomRugSizeLabel,
} from "@/lib/custom-rug-price";
import {
  PAPADYWANY_SLUG,
  usesDirectCheckout,
} from "@/lib/rug-order-mode";
import {
  addAntiSlipMatPrice,
  ANTI_SLIP_MAT_LABEL,
  ANTI_SLIP_MAT_PRICE_CENTS,
  appendAntiSlipMatLabel,
} from "@/lib/order-addons";
import { bookingSchema } from "@/schema/booking";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  consumeContactBookingLimit,
  consumeReferenceImageUploadLimit,
} from "@/lib/upload-rate-limit";
import { headers } from "next/headers";
import { sendQuoteRequestWhatsAppNotification } from "@/lib/whatsapp-notification";

const REFERENCE_IMAGES_BUCKET = "booking-reference-images";
const MAX_REFERENCE_IMAGE_SIZE = 5 * 1024 * 1024;

async function validateBookingDate(
  supabase: ReturnType<typeof createAdminClient>,
  pickupDate: string,
) {
  if (!isValidDateKey(pickupDate)) {
    return "Wybrano nieprawidłowy termin.";
  }

  if (pickupDate < getMinimumBookingDateKey()) {
    return "Najbliższy możliwy termin realizacji jest za 5 dni.";
  }

  const { data: blockedDate, error } = await supabase
    .from("blocked_dates")
    .select("date")
    .eq("date", pickupDate)
    .maybeSingle();

  if (error) {
    console.error("Nie udało się sprawdzić dostępności terminu:", error);
    return "Nie udało się sprawdzić dostępności terminu.";
  }

  return blockedDate
    ? "Wybrany termin jest niedostępny. Wybierz inny dzień."
    : null;
}

export async function uploadReferenceImage(file: File) {
  const extensionByType: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  const extension = extensionByType[file?.type];

  if (!file || typeof file.arrayBuffer !== "function") {
    return { success: false, message: "Nie wybrano zdjęcia." };
  }

  if (!extension) {
    return { success: false, message: "Dozwolone są pliki JPG, PNG i WEBP." };
  }

  if (file.size > MAX_REFERENCE_IMAGE_SIZE) {
    return { success: false, message: "Zdjęcie może mieć maksymalnie 5 MB." };
  }

  const rateLimit = await consumeReferenceImageUploadLimit();

  if (rateLimit.unavailable) {
    return {
      success: false,
      message: "Nie udało się sprawdzić limitu przesyłania zdjęć.",
    };
  }

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: "Osiągnięto limit przesyłania zdjęć. Spróbuj później.",
    };
  }

  const fileBuffer = Buffer.from(await file.arrayBuffer());
  const isJpeg =
    fileBuffer[0] === 0xff &&
    fileBuffer[1] === 0xd8 &&
    fileBuffer[2] === 0xff;
  const isPng = fileBuffer.subarray(0, 8).equals(
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  );
  const isWebp =
    fileBuffer.toString("ascii", 0, 4) === "RIFF" &&
    fileBuffer.toString("ascii", 8, 12) === "WEBP";

  if (
    (file.type === "image/jpeg" && !isJpeg) ||
    (file.type === "image/png" && !isPng) ||
    (file.type === "image/webp" && !isWebp)
  ) {
    return {
      success: false,
      message: "Plik nie jest prawidłowym obrazem w wybranym formacie.",
    };
  }

  const path = `bookings/${crypto.randomUUID()}.${extension}`;
  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(REFERENCE_IMAGES_BUCKET)
    .upload(path, fileBuffer, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Nie udało się przesłać zdjęcia:", error);
    return { success: false, message: "Nie udało się przesłać zdjęcia." };
  }

  return { success: true, path };
}

export async function createCheckoutSession(input: unknown) {
  const result = bookingSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Nieprawidłowe dane.",
    };
  }

  const booking = result.data;
  const supabase = createAdminClient();
  const dateError = await validateBookingDate(supabase, booking.pickupDate);

  if (dateError) return { success: false, message: dateError };

  const { data: rugType, error: rugTypeError } = await supabase
    .from("rug_types")
    .select("id, name, slug")
    .eq("id", Number(booking.rugTypeId))
    .single();

  if (rugTypeError || !rugType) {
    return { success: false, message: "Nie znaleziono typu dywanu." };
  }

  if (!usesDirectCheckout(rugType.slug)) {
    return {
      success: false,
      message: "Ten wariant wymaga indywidualnej wyceny na Instagramie.",
    };
  }

  if (
    booking.pickedSize == null ||
    booking.customWidthCm != null ||
    booking.customHeightCm != null
  ) {
    return {
      success: false,
      message: "Wybierz dostępny rozmiar dywanu.",
    };
  }

  const { data: size, error: sizeError } = await supabase
    .from("rug_sizes")
    .select("id, label, price_cents, rug_type_id, rug_variant_id, is_active")
    .eq("id", booking.pickedSize)
    .maybeSingle();

  if (sizeError || !size || size.is_active === false) {
    return {
      success: false,
      message: "Wybrany rozmiar jest niedostępny.",
    };
  }

  let rugVariant: { id: number | string; name: string } | null = null;

  if (rugType.slug === PAPADYWANY_SLUG) {
    if (booking.rugVariantId == null) {
      return { success: false, message: "Wybierz podrodzaj papadywanu." };
    }

    const { data: selectedVariant, error: variantError } = await supabase
      .from("rug_variants")
      .select("id, name")
      .eq("id", booking.rugVariantId)
      .eq("rug_type_id", Number(rugType.id))
      .eq("is_active", true)
      .maybeSingle();

    if (
      variantError ||
      !selectedVariant ||
      Number(size.rug_variant_id) !== Number(selectedVariant.id)
    ) {
      return {
        success: false,
        message: "Wybrany rozmiar nie należy do tego podrodzaju.",
      };
    }

    rugVariant = selectedVariant;
  } else if (
    Number(size.rug_type_id) !== Number(rugType.id) ||
    size.rug_variant_id != null
  ) {
    return {
      success: false,
      message: "Wybrany rozmiar nie należy do tego wariantu dywanu.",
    };
  }

  const sizeLabel = size.label;
  const priceCents = Number(size.price_cents);

  if (!Number.isInteger(priceCents) || priceCents <= 0) {
    return {
      success: false,
      message: "Wybrany rozmiar nie ma prawidłowej ceny.",
    };
  }

  const requestOrigin = (await headers()).get("origin");
  const checkoutOriginSource =
    requestOrigin ?? process.env.NEXT_PUBLIC_APP_URL;

  if (!checkoutOriginSource) {
    return {
      success: false,
      message: "Nie udało się ustalić adresu powrotu po płatności.",
    };
  }

  let checkoutOrigin: string;

  try {
    checkoutOrigin = new URL(checkoutOriginSource).origin;
  } catch {
    return {
      success: false,
      message: "Adres powrotu po płatności jest nieprawidłowy.",
    };
  }

  const successUrl = new URL("/zamow/sukces", checkoutOrigin);
  successUrl.search = "?session_id={CHECKOUT_SESSION_ID}";
  const cancelUrl = new URL("/zamow/anulowano", checkoutOrigin);

  const stripe = getStripe();
  const lineItems = [
    {
      price_data: {
        currency: "pln",
        unit_amount: priceCents,
        product_data: {
          name: `${rugType.name}${rugVariant ? ` · ${rugVariant.name}` : ""} · ${sizeLabel}`,
        },
      },
      quantity: 1,
    },
  ];

  if (booking.antiSlipMat) {
    lineItems.push({
      price_data: {
        currency: "pln",
        unit_amount: ANTI_SLIP_MAT_PRICE_CENTS,
        product_data: {
          name: ANTI_SLIP_MAT_LABEL,
        },
      },
      quantity: 1,
    });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customerEmail,
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    line_items: lineItems,
    metadata: {
      rugTypeId: booking.rugTypeId,
      rugTypeName: rugType.name,
      rugTypeSlug: rugType.slug,
      rugVariantId: rugVariant ? String(rugVariant.id) : "",
      rugVariantName: rugVariant?.name ?? "",
      pickedSize: String(booking.pickedSize),
      rugSizeLabel: sizeLabel,
      customWidthCm: "",
      customHeightCm: "",
      pickupDate: booking.pickupDate,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone ?? "",
      customerNotes: booking.customerNotes ?? "",
      deliveryMethod: booking.deliveryMethod,
      parcelLockerCode: booking.parcelLockerCode ?? "",
      deliveryAddress: booking.deliveryAddress ?? "",
      referenceImagePath: booking.referenceImagePath ?? "",
      antiSlipMat: String(booking.antiSlipMat),
    },
  });

  return {
    success: true,
    checkoutUrl: session.url,
  };
}

export async function createContactBooking(input: unknown) {
  const result = bookingSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false,
      message: result.error.issues[0]?.message ?? "Nieprawidłowe dane.",
    };
  }

  const rateLimit = await consumeContactBookingLimit();

  if (rateLimit.unavailable) {
    return {
      success: false,
      message: "Nie udało się teraz zapisać zgłoszenia. Spróbuj ponownie.",
    };
  }

  if (!rateLimit.allowed) {
    return {
      success: false,
      message: "Wysłano zbyt wiele zgłoszeń. Spróbuj ponownie później.",
    };
  }

  const booking = result.data;
  const supabase = createAdminClient();
  const dateError = await validateBookingDate(supabase, booking.pickupDate);

  if (dateError) return { success: false, message: dateError };

  const { data: rugType, error: rugTypeError } = await supabase
    .from("rug_types")
    .select("id, name, slug")
    .eq("id", Number(booking.rugTypeId))
    .single();

  if (rugTypeError || !rugType) {
    return { success: false, message: "Nie znaleziono typu dywanu." };
  }

  if (usesDirectCheckout(rugType.slug)) {
    return {
      success: false,
      message: "Ten wariant należy opłacić online po wybraniu rozmiaru.",
    };
  }

  if (
    booking.pickedSize != null ||
    booking.rugVariantId != null ||
    booking.customHeightCm == null
  ) {
    return {
      success: false,
      message: "Podaj własne wymiary dywanu.",
    };
  }

  const estimatedPriceCents = calculateCustomRugPriceCents(
    booking.customHeightCm,
  );

  if (estimatedPriceCents == null) {
    return {
      success: false,
      message: "Wysokość dywanu jest poza dozwolonym zakresem.",
    };
  }

  const { data: createdBooking, error } = await supabase
    .from("bookings")
    .insert({
      rug_type_id: Number(rugType.id),
      rug_variant_id: null,
      rug_size_id: null,
      rug_type_name: rugType.name,
      rug_variant_name: null,
      rug_size_label: appendAntiSlipMatLabel(
        formatCustomRugSizeLabel(
          booking.customWidthCm,
          booking.customHeightCm,
        ),
        booking.antiSlipMat,
      ),
      price_cents: addAntiSlipMatPrice(
        estimatedPriceCents,
        booking.antiSlipMat,
      ),
      customer_name: booking.customerName,
      customer_email: booking.customerEmail,
      customer_phone: booking.customerPhone?.trim() || null,
      notes: booking.customerNotes?.trim() || null,
      booking_date: booking.pickupDate,
      status: "awaiting_quote",
      stripe_session_id: null,
      stripe_payment_intent_id: null,
      expires_at: null,
      delivery_method: booking.deliveryMethod,
      parcel_locker_code: booking.parcelLockerCode?.trim() || null,
      delivery_address: booking.deliveryAddress?.trim() || null,
      reference_image_path: booking.referenceImagePath ?? null,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error || !createdBooking) {
    console.error(
      "Nie udało się zapisać zgłoszenia w Supabase:",
      JSON.stringify({
        code: error?.code,
        message: error?.message,
        details: error?.details,
        hint: error?.hint,
      }),
    );
    return {
      success: false,
      message: "Nie udało się zapisać zgłoszenia. Spróbuj ponownie.",
    };
  }

  const bookingId = Number(createdBooking.id);
  const notificationResult =
    await sendQuoteRequestWhatsAppNotification(bookingId);

  if (!notificationResult.success) {
    console.error(
      "Nie udało się wysłać powiadomienia WhatsApp:",
      JSON.stringify(notificationResult),
    );
  }

  return {
    success: true,
    bookingId,
    notificationSent: notificationResult.success,
  };
}
