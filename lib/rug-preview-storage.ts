export const REFERENCE_IMAGES_BUCKET = "booking-reference-images";
export const AI_RUG_PREVIEWS_FOLDER = "ai-rug-previews";

export const getAiRugPreviewPath = (bookingId: number) =>
  `${AI_RUG_PREVIEWS_FOLDER}/${bookingId}.png`;

