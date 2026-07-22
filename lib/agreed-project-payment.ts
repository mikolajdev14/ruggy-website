import "server-only";

import { getStripe } from "@/lib/stripe";

export type AgreedProjectPaymentResult =
  | {
      success: true;
      amountCents: number;
      customerName: string;
      projectReference: string;
    }
  | {
      success: false;
      reason: "invalid_session" | "not_paid" | "wrong_checkout_kind";
      message: string;
    };

export async function verifyAgreedProjectPayment(
  sessionId: string,
): Promise<AgreedProjectPaymentResult> {
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
    console.error("Nie udało się pobrać płatności uzgodnionego projektu:", error);
    return {
      success: false,
      reason: "invalid_session",
      message: "Nie udało się potwierdzić płatności w Stripe.",
    };
  }

  if (session.metadata?.checkoutKind !== "agreed_project_payment") {
    return {
      success: false,
      reason: "wrong_checkout_kind",
      message: "Ta płatność nie dotyczy uzgodnionego projektu.",
    };
  }

  if (session.payment_status !== "paid") {
    return {
      success: false,
      reason: "not_paid",
      message: "Płatność nie została jeszcze potwierdzona.",
    };
  }

  if (
    session.amount_total == null ||
    !session.metadata.customerName ||
    !session.metadata.projectReference
  ) {
    return {
      success: false,
      reason: "invalid_session",
      message: "Płatność nie zawiera kompletnych danych projektu.",
    };
  }

  return {
    success: true,
    amountCents: session.amount_total,
    customerName: session.metadata.customerName,
    projectReference: session.metadata.projectReference,
  };
}
