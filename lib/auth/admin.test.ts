import { afterEach, describe, expect, it } from "vitest";
import { isAdminUser } from "./admin";

const baseUser = {
  id: "user-1",
  email: "owner@example.com",
  app_metadata: {},
  email_confirmed_at: "2026-01-01T00:00:00.000Z",
  confirmed_at: "2026-01-01T00:00:00.000Z",
};

afterEach(() => {
  delete process.env.RUGGY_ADMIN_USER_IDS;
  delete process.env.RUGGY_ADMIN_EMAILS;
});

describe("isAdminUser", () => {
  it("rejects a signed in user without an administrator grant", () => {
    expect(isAdminUser(baseUser)).toBe(false);
  });

  it("accepts an administrator role from app metadata", () => {
    expect(
      isAdminUser({ ...baseUser, app_metadata: { role: "admin" } }),
    ).toBe(true);
  });

  it("accepts a configured user id", () => {
    process.env.RUGGY_ADMIN_USER_IDS = "other-id, user-1";

    expect(isAdminUser(baseUser)).toBe(true);
  });

  it("accepts a configured email case insensitively", () => {
    process.env.RUGGY_ADMIN_EMAILS = "OWNER@EXAMPLE.COM";

    expect(isAdminUser(baseUser)).toBe(true);
  });

  it("does not trust user metadata that the user can edit", () => {
    expect(
      isAdminUser({
        ...baseUser,
        user_metadata: { role: "admin" },
      } as typeof baseUser),
    ).toBe(false);
  });

  it("rejects an administrator whose email is not confirmed", () => {
    expect(
      isAdminUser({
        ...baseUser,
        email_confirmed_at: undefined,
        confirmed_at: undefined,
        app_metadata: { role: "admin" },
      }),
    ).toBe(false);
  });
});
