"use server";

import { getPolandDateKey, isValidDateKey } from "@/lib/booking-date";
import { calculateCustomRugPriceCents } from "@/lib/custom-rug-price";
import { bookingSchema } from "@/schema/booking";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { consumeReferenceImageUploadLimit } from "@/lib/upload-rate-limit";

const REFERENCE_IMAGES_BUCKET = "booking-reference-images";
const MAX_REFERENCE_IMAGE_SIZE = 5 * 1024 * 1024;

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

  if (!isValidDateKey(booking.pickupDate)) {
    return { success: false, message: "Wybrano nieprawidłowy termin." };
  }

  if (booking.pickupDate < getPolandDateKey()) {
    return { success: false, message: "Nie można wybrać daty z przeszłości." };
  }

  const { data: blockedDate, error: blockedDateError } = await supabase
    .from("blocked_dates")
    .select("date")
    .eq("date", booking.pickupDate)
    .maybeSingle();

  if (blockedDateError) {
    console.error("Nie udało się sprawdzić dostępności terminu:", blockedDateError);
    return {
      success: false,
      message: "Nie udało się sprawdzić dostępności terminu.",
    };
  }

  if (blockedDate) {
    return {
      success: false,
      message: "Wybrany termin jest niedostępny. Wybierz inny dzień.",
    };
  }

  const { data: rugType, error: rugTypeError } = await supabase
    .from("rug_types")
    .select("id, name, rug_sizes(id, label, price_cents)")
    .eq("id", Number(booking.rugTypeId))
    .single();

  if (rugTypeError || !rugType) {
    return { success: false, message: "Nie znaleziono typu dywanu." };
  }

  const isCustomType = rugType.name.trim().toLocaleLowerCase() === "inne";
  const hasCustomDimensions =
    booking.customWidthCm != null && booking.customHeightCm != null;

  if (!isCustomType && hasCustomDimensions) {
    return {
      success: false,
      message: "Własne wymiary są dostępne dla typu Inne.",
    };
  }

  const isCustomSize =
    isCustomType &&
    booking.pickedSize == null &&
    booking.customWidthCm != null &&
    booking.customHeightCm != null;
  const customPriceCents = isCustomSize
    ? calculateCustomRugPriceCents(
        booking.customWidthCm,
        booking.customHeightCm,
      )
    : null;
  const size = booking.pickedSize
    ? rugType.rug_sizes?.find(
        (rugSize) => Number(rugSize.id) === booking.pickedSize,
      )
    : null;

  if (!isCustomSize && !size) {
    return {
      success: false,
      message: "Wybrany rozmiar nie należy do tego wariantu dywanu.",
    };
  }

  if (isCustomSize && customPriceCents == null) {
    return {
      success: false,
      message: "Wymiary własnego dywanu są poza dozwolonym zakresem.",
    };
  }

  const sizeLabel = isCustomSize
    ? `Własny rozmiar ${booking.customWidthCm} × ${booking.customHeightCm} cm`
    : size!.label;
  const priceCents = isCustomSize ? customPriceCents! : Number(size!.price_cents);

  const stripe = getStripe();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: booking.customerEmail,
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/zamow/sukces?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/zamow/anulowano`,
    line_items: [
      {
        price_data: {
          currency: "pln",
          unit_amount: priceCents,
          product_data: {
            name: `${rugType.name} · ${sizeLabel}`,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      rugTypeId: booking.rugTypeId,
      rugTypeName: rugType.name,
      pickedSize: isCustomSize ? "custom" : String(booking.pickedSize),
      rugSizeLabel: sizeLabel,
      customWidthCm: isCustomSize ? String(booking.customWidthCm) : "",
      customHeightCm: isCustomSize ? String(booking.customHeightCm) : "",
      pickupDate: booking.pickupDate,
      customerName: booking.customerName,
      customerPhone: booking.customerPhone ?? "",
      customerNotes: booking.customerNotes ?? "",
      deliveryMethod: booking.deliveryMethod,
      parcelLockerCode: booking.parcelLockerCode ?? "",
      deliveryAddress: booking.deliveryAddress ?? "",
      referenceImagePath: booking.referenceImagePath ?? "",
    },
  });

  return {
    success: true,
    checkoutUrl: session.url,
  };
}
