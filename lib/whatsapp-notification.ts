import "server-only";

import { absoluteUrl } from "@/lib/site-config";

type WhatsAppNotificationResult =
  | { success: true }
  | {
      success: false;
      reason: "not_configured" | "request_failed";
      message: string;
    };

const normalizePhoneNumber = (value: string) => value.replace(/\D/g, "");

export async function sendQuoteRequestWhatsAppNotification(
  bookingId: number,
): Promise<WhatsAppNotificationResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  const recipientNumber = normalizePhoneNumber(
    process.env.WHATSAPP_RECIPIENT_NUMBER ?? "",
  );
  const graphApiVersion = process.env.WHATSAPP_GRAPH_API_VERSION?.trim();
  const templateName =
    process.env.WHATSAPP_TEMPLATE_NAME?.trim() || "new_quote_request";
  const templateLanguage =
    process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim() || "pl";

  if (
    !accessToken ||
    !phoneNumberId ||
    !recipientNumber ||
    !graphApiVersion
  ) {
    return {
      success: false,
      reason: "not_configured",
      message: "Brakuje konfiguracji WhatsApp Cloud API.",
    };
  }

  if (!/^v\d+\.\d+$/.test(graphApiVersion)) {
    return {
      success: false,
      reason: "not_configured",
      message: "WHATSAPP_GRAPH_API_VERSION ma nieprawidłowy format.",
    };
  }

  const bookingUrl = absoluteUrl(
    `/admin/dashboard?booking=${encodeURIComponent(String(bookingId))}`,
  );

  try {
    const response = await fetch(
      `https://graph.facebook.com/${graphApiVersion}/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          recipient_type: "individual",
          to: recipientNumber,
          type: "template",
          template: {
            name: templateName,
            language: {
              code: templateLanguage,
            },
            components: [
              {
                type: "body",
                parameters: [
                  {
                    type: "text",
                    text: bookingUrl,
                  },
                ],
              },
            ],
          },
        }),
        cache: "no-store",
      },
    );

    if (!response.ok) {
      const responseBody = await response.text();
      return {
        success: false,
        reason: "request_failed",
        message: `WhatsApp API zwróciło ${response.status}: ${responseBody.slice(0, 500)}`,
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      reason: "request_failed",
      message:
        error instanceof Error
          ? error.message
          : "Nie udało się połączyć z WhatsApp API.",
    };
  }
}
