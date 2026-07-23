export const ANTI_SLIP_MAT_PRICE_CENTS = 3900;
export const ANTI_SLIP_MAT_LABEL = "Podkład antypoślizgowy";

export function addAntiSlipMatPrice(
  priceCents: number,
  antiSlipMat: boolean,
) {
  return antiSlipMat ? priceCents + ANTI_SLIP_MAT_PRICE_CENTS : priceCents;
}

export function appendAntiSlipMatLabel(
  sizeLabel: string,
  antiSlipMat: boolean,
) {
  return antiSlipMat
    ? `${sizeLabel} · ${ANTI_SLIP_MAT_LABEL} (+39 zł)`
    : sizeLabel;
}
