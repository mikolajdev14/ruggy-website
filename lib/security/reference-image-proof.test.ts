import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createReferenceImageProof,
  isValidReferenceImageProof,
} from "./reference-image-proof";

const validPath = "bookings/123e4567-e89b-12d3-a456-426614174000.png";

afterEach(() => {
  delete process.env.RUGGY_UPLOAD_SIGNING_SECRET;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
});

describe("reference image proofs", () => {
  it("accepts a proof generated for the same path", () => {
    process.env.RUGGY_UPLOAD_SIGNING_SECRET = "test-secret";
    const proof = createReferenceImageProof(validPath);

    expect(isValidReferenceImageProof(validPath, proof)).toBe(true);
  });

  it("rejects a proof reused for a different path", () => {
    process.env.RUGGY_UPLOAD_SIGNING_SECRET = "test-secret";
    const proof = createReferenceImageProof(validPath);

    expect(
      isValidReferenceImageProof(
        "bookings/123e4567-e89b-12d3-a456-426614174000.jpg",
        proof,
      ),
    ).toBe(false);
  });

  it("rejects a tampered proof", () => {
    process.env.RUGGY_UPLOAD_SIGNING_SECRET = "test-secret";
    const proof = createReferenceImageProof(validPath);

    expect(isValidReferenceImageProof(validPath, `${proof}x`)).toBe(false);
  });

  it("rejects paths outside the upload namespace", () => {
    process.env.RUGGY_UPLOAD_SIGNING_SECRET = "test-secret";
    const proof = createReferenceImageProof(validPath);

    expect(isValidReferenceImageProof("../secret.png", proof)).toBe(false);
  });
});
