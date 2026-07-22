import "server-only";

const OPENAI_IMAGE_EDIT_URL = "https://api.openai.com/v1/images/edits";

type OpenAiImageResponse = {
  data?: Array<{ b64_json?: string }>;
  error?: { message?: string };
};

const getOpenAiKey = () =>
  process.env.OPENAI_API_KEY?.trim() || process.env.OPENAI_KEY?.trim();

const getFileExtension = (path: string) => {
  const extension = path.split(".").pop()?.toLowerCase();
  return extension && ["jpg", "jpeg", "png", "webp"].includes(extension)
    ? extension
    : "png";
};

const getContentType = (blob: Blob, path: string) => {
  if (blob.type.startsWith("image/")) return blob.type;

  const extension = getFileExtension(path);
  if (extension === "jpg" || extension === "jpeg") return "image/jpeg";
  if (extension === "webp") return "image/webp";
  return "image/png";
};

export async function createRugDesign(
  referenceImage: Blob,
  referenceImagePath: string,
) {
  const apiKey = getOpenAiKey();

  if (!apiKey) {
    throw new Error("Brak zmiennej OPENAI_API_KEY lub OPENAI_KEY.");
  }

  const extension = getFileExtension(referenceImagePath);
  const uploadImage = referenceImage.type.startsWith("image/")
    ? referenceImage
    : new Blob([await referenceImage.arrayBuffer()], {
        type: getContentType(referenceImage, referenceImagePath),
      });
  const formData = new FormData();

  formData.append("model", "gpt-image-2");
  formData.append("image", uploadImage, `reference.${extension}`);
  formData.append(
    "prompt",
    [
      "First identify the single main and most visually prominent object in the reference image.",
      "If several objects are present, use only the central foreground subject and ignore every secondary object.",
      "Create a production concept for a custom hand tufted rug based on that subject.",
      "Preserve its recognizable silhouette, proportions, defining features, markings, and main colors.",
      "Translate it into a feasible tufted rug design using clean bold outlines, clearly separated flat color areas, and simplified details.",
      "Remove tiny details, photographic texture, gradients, glare, and visual noise that cannot be reproduced with yarn.",
      "Show the complete rug directly from above, centered and fully visible, on a clean solid white background.",
      "Do not include the original room, scenery, people, hands, floor, wall, tools, shadows, labels, captions, frames, or additional objects.",
      "The result must be a single isolated rug design, not a room mockup and not an explanation.",
    ].join(" "),
  );
  formData.append("quality", "medium");
  formData.append("size", "1024x1024");
  formData.append("output_format", "png");

  const response = await fetch(OPENAI_IMAGE_EDIT_URL, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: formData,
  });

  const payload = (await response.json()) as OpenAiImageResponse;

  if (!response.ok) {
    throw new Error(
      `OpenAI zwróciło błąd ${response.status}: ${payload.error?.message ?? "brak szczegółów"}`,
    );
  }

  const generatedImage = payload.data?.[0]?.b64_json;

  if (!generatedImage) {
    throw new Error("OpenAI nie zwróciło wygenerowanego obrazu.");
  }

  return Buffer.from(generatedImage, "base64");
}
