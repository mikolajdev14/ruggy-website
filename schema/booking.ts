import * as z from "zod";
import { POSTAL_CODE_PATTERN } from "@/lib/delivery-address";
export const bookingSchema = z.object({
  rugTypeId: z
    .string()
    .regex(/^\d+$/, "Nieprawidłowy typ dywanu")
    .max(20, "Nieprawidłowy typ dywanu"),
  rugVariantId: z.number().int().positive().nullable().optional(),
  customerName: z
    .string()
    .trim()
    .min(2, "Podaj imię i nazwisko")
    .max(100, "Imię i nazwisko jest zbyt długie"),
  customerEmail: z
    .email("Nieprawidłowy email")
    .max(254, "Adres email jest zbyt długi"),
  customerPhone: z.string().trim().max(32).optional(),
  customerNotes: z.string().max(500).optional(),
  pickedSize: z.number().int().positive().nullable(),
  customWidthCm: z.number().int().min(20).max(300).nullable().optional(),
  customHeightCm: z.number().int().min(20).max(300).nullable().optional(),
  pickupDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Wybierz prawidłowy termin"),
  deliveryMethod: z.enum(["parcel_locker", "courier"], {
    error: "Wybierz metodę wysyłki",
  }),
  parcelLockerCode: z.string().max(100).optional(),
  parcelLockerAddress: z.string().max(300).optional(),
  deliveryStreet: z.string().max(200).optional(),
  deliveryBuildingNumber: z.string().max(20).optional(),
  deliveryPostalCode: z.string().max(10).optional(),
  deliveryCity: z.string().max(100).optional(),
  referenceImagePath: z.string().max(300).optional(),
  referenceImageProof: z.string().max(128).optional(),
  antiSlipMat: z.boolean().optional().default(false),
}).superRefine((booking, context) => {
  const hasHeight = booking.customHeightCm != null;

  if (booking.referenceImageProof && !booking.referenceImagePath) {
    context.addIssue({
      code: "custom",
      path: ["referenceImageProof"],
      message: "Dowód zdjęcia referencyjnego jest nieprawidłowy",
    });
  }

  if (booking.referenceImagePath && !booking.referenceImageProof) {
    context.addIssue({
      code: "custom",
      path: ["referenceImagePath"],
      message: "Brakuje dowodu zdjęcia referencyjnego",
    });
  }

  if (!booking.pickedSize && !hasHeight) {
    context.addIssue({
      code: "custom",
      path: ["customHeightCm"],
      message: "Wybierz gotowy rozmiar albo podaj wysokość dywanu",
    });
  }

  if (booking.deliveryMethod === "parcel_locker" && !booking.parcelLockerCode?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["parcelLockerCode"],
      message: "Podaj kod paczkomatu InPost",
    });
  }

  if (booking.deliveryMethod === "courier") {
    const requiredAddressParts = [
      ["deliveryStreet", booking.deliveryStreet, "Podaj ulicę"],
      [
        "deliveryBuildingNumber",
        booking.deliveryBuildingNumber,
        "Podaj numer domu lub lokalu",
      ],
      ["deliveryPostalCode", booking.deliveryPostalCode, "Podaj kod pocztowy"],
      ["deliveryCity", booking.deliveryCity, "Podaj miejscowość"],
    ] as const;

    for (const [path, value, message] of requiredAddressParts) {
      if (!value?.trim()) {
        context.addIssue({ code: "custom", path: [path], message });
      }
    }

    const postalCode = booking.deliveryPostalCode?.trim();

    if (postalCode && !POSTAL_CODE_PATTERN.test(postalCode)) {
      context.addIssue({
        code: "custom",
        path: ["deliveryPostalCode"],
        message: "Kod pocztowy w formacie 00-000",
      });
    }
  }
});
