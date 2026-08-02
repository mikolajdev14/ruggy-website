import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const getSigningSecret = () =>
  process.env.RUGGY_UPLOAD_SIGNING_SECRET?.trim() ||
  process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
  null;

const digestPath = (path: string) => {
  const secret = getSigningSecret();

  if (!secret) {
    throw new Error("Brak sekretu podpisującego uploady Ruggy.");
  }

  return createHmac("sha256", secret).update(path).digest("base64url");
};

export const createReferenceImageProof = (path: string) => digestPath(path);

export const isValidReferenceImageProof = (
  path: string | undefined,
  proof: string | undefined,
) => {
  if (!path || !proof || !/^bookings\/[0-9a-f-]{36}\.(?:jpg|png|webp)$/i.test(path)) {
    return false;
  }

  try {
    const expected = Buffer.from(digestPath(path));
    const received = Buffer.from(proof);

    return (
      expected.length === received.length &&
      timingSafeEqual(expected, received)
    );
  } catch {
    return false;
  }
};
