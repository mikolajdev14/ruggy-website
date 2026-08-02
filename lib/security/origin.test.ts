import { afterEach, describe, expect, it } from "vitest";
import { getTrustedAppOrigin } from "./origin";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
});

describe("getTrustedAppOrigin", () => {
  it("returns the configured origin when the request has no origin", () => {
    process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

    expect(getTrustedAppOrigin(null)).toBe("http://localhost:3000");
  });

  it("accepts an exact configured origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ruggy.pl";

    expect(getTrustedAppOrigin("https://ruggy.pl")).toBe("https://ruggy.pl");
  });

  it("rejects an attacker controlled origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ruggy.pl";

    expect(getTrustedAppOrigin("https://evil.example")).toBeNull();
  });

  it("rejects a malformed origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ruggy.pl";

    expect(getTrustedAppOrigin("not an origin")).toBeNull();
  });

  it("does not treat a subdomain as the configured origin", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ruggy.pl";

    expect(getTrustedAppOrigin("https://evil.ruggy.pl")).toBeNull();
  });
});
