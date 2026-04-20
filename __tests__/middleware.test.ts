/** @jest-environment node */

jest.mock("@/auth", () => ({
  auth: jest.fn((fn: unknown) => fn),
}));

import { getRedirectUrl } from "@/proxy";

const BASE = "https://app.autozen.dev";

type Session = { user?: { id?: string } } | null;

function authed(): Session {
  return { user: { id: "user-1" } };
}

describe("getRedirectUrl()", () => {
  describe("unauthenticated", () => {
    it("redirects /dashboard to /login", () => {
      expect(getRedirectUrl("/dashboard", null, BASE)).toBe(`${BASE}/login`);
    });

    it("redirects /dashboard/today to /login", () => {
      expect(getRedirectUrl("/dashboard/today", null, BASE)).toBe(`${BASE}/login`);
    });

    it("redirects /onboarding to /login", () => {
      expect(getRedirectUrl("/onboarding", null, BASE)).toBe(`${BASE}/login`);
    });

    it("allows /login through", () => {
      expect(getRedirectUrl("/login", null, BASE)).toBeNull();
    });

    it("allows /signup through", () => {
      expect(getRedirectUrl("/signup", null, BASE)).toBeNull();
    });
  });

  describe("authenticated", () => {
    it("redirects /login to /dashboard", () => {
      expect(getRedirectUrl("/login", authed(), BASE)).toBe(`${BASE}/dashboard`);
    });

    it("redirects /signup to /dashboard", () => {
      expect(getRedirectUrl("/signup", authed(), BASE)).toBe(`${BASE}/dashboard`);
    });

    it("allows /dashboard through", () => {
      expect(getRedirectUrl("/dashboard", authed(), BASE)).toBeNull();
    });

    it("allows /dashboard/today through", () => {
      expect(getRedirectUrl("/dashboard/today", authed(), BASE)).toBeNull();
    });

    it("allows /onboarding through", () => {
      expect(getRedirectUrl("/onboarding", authed(), BASE)).toBeNull();
    });
  });

  describe("edge cases", () => {
    it("returns null for unmatched path", () => {
      expect(getRedirectUrl("/", null, BASE)).toBeNull();
    });

    it("returns null for unmatched authenticated path", () => {
      expect(getRedirectUrl("/", authed(), BASE)).toBeNull();
    });
  });
});
