import { describe, expect, it } from "vitest";
import { hasActiveRugVariants } from "./rug-order-mode";

describe("hasActiveRugVariants", () => {
  it("returns true for an active variant in any rug category", () => {
    expect(hasActiveRugVariants([{ is_active: true }])).toBe(true);
  });

  it("returns false when a category has no active variants", () => {
    expect(hasActiveRugVariants([{ is_active: false }])).toBe(false);
    expect(hasActiveRugVariants([])).toBe(false);
    expect(hasActiveRugVariants(null)).toBe(false);
  });
});
