import { afterEach, describe, expect, it } from "vitest";
import { getCheckoutReturnOrigin, getTrustedAppOrigin } from "./origin";

afterEach(() => {
  delete process.env.NEXT_PUBLIC_SITE_URL;
  delete process.env.NEXT_PUBLIC_APP_URL;
  delete process.env.VERCEL_PROJECT_PRODUCTION_URL;
  delete process.env.VERCEL_URL;
  delete process.env.VERCEL_BRANCH_URL;
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

  it("accepts the current Vercel deployment origin", () => {
    process.env.VERCEL_URL = "ruggy-website.vercel.app";

    expect(getTrustedAppOrigin("https://ruggy-website.vercel.app")).toBe(
      "https://ruggy-website.vercel.app",
    );
  });

  it("accepts localhost during development", () => {
    expect(getTrustedAppOrigin("http://localhost:3000")).toBe(
      "http://localhost:3000",
    );
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

describe("getCheckoutReturnOrigin", () => {
  it("uses the configured canonical origin when the request origin differs", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://ruggy.pl";

    expect(getCheckoutReturnOrigin("https://preview.example")).toBe(
      "https://ruggy.pl",
    );
  });

  it("keeps an exact trusted deployment origin", () => {
    process.env.VERCEL_URL = "ruggy-website.vercel.app";

    expect(
      getCheckoutReturnOrigin("https://ruggy-website.vercel.app"),
    ).toBe("https://ruggy-website.vercel.app");
  });
});
