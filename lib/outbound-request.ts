import "server-only";

export const OUTBOUND_REQUEST_TIMEOUT_MS = {
  email: 10_000,
  notification: 10_000,
  imageGeneration: 120_000,
} as const;

export const createOutboundRequestSignal = (timeoutMs: number) =>
  AbortSignal.timeout(timeoutMs);

export const formatOutboundRequestError = (
  provider: string,
  error: unknown,
) => {
  if (error instanceof Error && error.name === "TimeoutError") {
    return `${provider} nie odpowiedziało w wyznaczonym czasie.`;
  }

  return `Nie udało się połączyć z ${provider}.`;
};
