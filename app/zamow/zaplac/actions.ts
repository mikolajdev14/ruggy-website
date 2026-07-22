"use server";

import { getStripe } from "@/lib/stripe";
import { consumeAgreedProjectPaymentLimit } from "@/lib/upload-rate-limit";
import { headers } from "next/headers";
import * as z from "zod";

const agreedProjectPaymentSchema = z.object({
  customerName: z.string().trim().min(2, "Podaj imię i nazwisko").max(100),
  customerEmail: z
    .email("Podaj prawidłowy adres e-mail")
    .max(254, "Adres e-mail jest zbyt długi"),
  projectReference: z
    .string()
    .trim()
    .min(2, "Napisz krótko, którego projektu dotyczy płatność")
    .max(200),
  amountPln: z
    .number()
    .int("Kwota musi być podana w pełnych złotych")
    .min(50, "Minimalna kwota płatności to 50 zł")
    .max(20_000, "Maksymalna kwota pojedynczej płatności to 20 000 zł"),
});

export async function createAgreedProjectCheckout(input: unknown) {
  const result = agreedProjectPaymentSchema.safeParse(input);

  if (!result.success) {
    return {
      success: false as const,
      message: result.error.issues[0]?.message ?? "Nieprawidłowe dane.",
    };
  }

  const rateLimit = await consumeAgreedProjectPaymentLimit();

  if (rateLimit.unavailable) {
    return {
      success: false as const,
      message: "Nie udało się teraz przygotować płatności. Spróbuj ponownie.",
    };
  }

  if (!rateLimit.allowed) {
    return {
      success: false as const,
      message: "Utworzono zbyt wiele płatności. Spróbuj ponownie później.",
    };
  }

  const payment = result.data;
  const requestOrigin = (await headers()).get("origin");
  const originSource = requestOrigin ?? process.env.NEXT_PUBLIC_APP_URL;

  if (!originSource) {
    return {
      success: false as const,
      message: "Nie udało się ustalić adresu powrotu po płatności.",
    };
  }

  let origin: string;

  try {
    origin = new URL(originSource).origin;
  } catch {
    return {
      success: false as const,
      message: "Adres powrotu po płatności jest nieprawidłowy.",
    };
  }

  const successUrl = new URL("/zamow/zaplac/sukces", origin);
  successUrl.search = "?session_id={CHECKOUT_SESSION_ID}";
  const cancelUrl = new URL("/zamow/zaplac", origin);
  cancelUrl.searchParams.set("cancelled", "1");

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer_email: payment.customerEmail,
    success_url: successUrl.toString(),
    cancel_url: cancelUrl.toString(),
    line_items: [
      {
        price_data: {
          currency: "pln",
          unit_amount: payment.amountPln * 100,
          product_data: {
            name: "Płatność za uzgodniony projekt dywanu",
            description: payment.projectReference,
          },
        },
        quantity: 1,
      },
    ],
    metadata: {
      checkoutKind: "agreed_project_payment",
      customerName: payment.customerName,
      projectReference: payment.projectReference,
    },
  });

  if (!session.url) {
    return {
      success: false as const,
      message: "Stripe nie zwrócił adresu płatności. Spróbuj ponownie.",
    };
  }

  return { success: true as const, checkoutUrl: session.url };
}
