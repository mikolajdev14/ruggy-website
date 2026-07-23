import * as z from "zod";
export const bookingSchema = z.object({
  rugTypeId: z.string().min(1),
  rugVariantId: z.number().int().positive().nullable().optional(),
  customerName: z.string().min(2, "Podaj imię i nazwisko"),
  customerEmail: z.email("Nieprawidlowy email"),
  customerPhone: z.string().max(500).optional(),
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
  deliveryAddress: z.string().max(500).optional(),
  referenceImagePath: z.string().max(300).optional(),
  antiSlipMat: z.boolean().optional().default(false),
}).superRefine((booking, context) => {
  const hasHeight = booking.customHeightCm != null;

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

  if (booking.deliveryMethod === "courier" && !booking.deliveryAddress?.trim()) {
    context.addIssue({
      code: "custom",
      path: ["deliveryAddress"],
      message: "Podaj adres dostawy",
    });
  }
});
