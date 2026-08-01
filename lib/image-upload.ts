// Shared upload validation for every image the app accepts: customer reference
// photos and the catalog photos in /admin/dywany. The declared MIME type is
// checked against the file's magic bytes, because the type on a File is just
// whatever the browser (or a hand-crafted request) claimed it to be.

const EXTENSION_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export type ValidatedImage = {
  buffer: Buffer;
  extension: string;
  contentType: string;
};

export type ImageValidationResult =
  | { ok: true; image: ValidatedImage }
  | { ok: false; message: string };

const matchesDeclaredType = (buffer: Buffer, contentType: string) => {
  if (contentType === "image/jpeg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  if (contentType === "image/png") {
    return buffer
      .subarray(0, 8)
      .equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }

  if (contentType === "image/webp") {
    return (
      buffer.toString("ascii", 0, 4) === "RIFF" &&
      buffer.toString("ascii", 8, 12) === "WEBP"
    );
  }

  return false;
};

export async function validateImageUpload(
  file: File,
  maxBytes: number,
): Promise<ImageValidationResult> {
  if (!file || typeof file.arrayBuffer !== "function") {
    return { ok: false, message: "Nie wybrano zdjęcia." };
  }

  const extension = EXTENSION_BY_TYPE[file.type];

  if (!extension) {
    return { ok: false, message: "Dozwolone są pliki JPG, PNG i WEBP." };
  }

  if (file.size > maxBytes) {
    return {
      ok: false,
      message: `Zdjęcie może mieć maksymalnie ${Math.round(maxBytes / (1024 * 1024))} MB.`,
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  if (!matchesDeclaredType(buffer, file.type)) {
    return {
      ok: false,
      message: "Plik nie jest prawidłowym obrazem w wybranym formacie.",
    };
  }

  return { ok: true, image: { buffer, extension, contentType: file.type } };
}
