/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/User", () => ({
  __esModule: true,
  default: {
    findByIdAndUpdate: jest.fn(),
  },
}));

import { saveOnboarding } from "@/actions/onboarding";
import { auth } from "@/auth";
import User from "@/lib/db/models/User";

const mockAuth = auth as jest.Mock;
const mockUpdate = User.findByIdAndUpdate as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

const VALID_DATA = {
  pathType: "developer" as const,
  weeklyHours: 10,
  weeklyTarget: 5,
  startDate: "2026-04-20",
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("saveOnboarding()", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await saveOnboarding(VALID_DATA);
    expect(result).toEqual({ success: false, error: "Not authenticated" });
  });

  it("saves onboarding data and returns success", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue({ _id: "user-1", onboardingDone: true });

    const result = await saveOnboarding(VALID_DATA);
    expect(result).toEqual({ success: true });
    expect(mockUpdate).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({
        pathType: "developer",
        weeklyHours: 10,
        weeklyTarget: 5,
        startDate: "2026-04-20",
        onboardingDone: true,
      }),
      { new: true },
    );
  });

  it("accepts no-code pathType", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue({ _id: "user-1", onboardingDone: true });

    const result = await saveOnboarding({ ...VALID_DATA, pathType: "no-code" });
    expect(result).toEqual({ success: true });
    expect(mockUpdate).toHaveBeenCalledWith(
      "user-1",
      expect.objectContaining({ pathType: "no-code" }),
      { new: true },
    );
  });

  it("returns error for invalid pathType", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    // @ts-expect-error intentionally invalid
    const result = await saveOnboarding({ ...VALID_DATA, pathType: "wizard" });
    expect(result.success).toBe(false);
    expect((result as { success: false; error: string }).error).toBeTruthy();
  });

  it("returns error for weeklyHours < 1", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const result = await saveOnboarding({ ...VALID_DATA, weeklyHours: 0 });
    expect(result.success).toBe(false);
  });

  it("returns error for weeklyTarget < 1", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const result = await saveOnboarding({ ...VALID_DATA, weeklyTarget: 0 });
    expect(result.success).toBe(false);
  });

  it("returns error for invalid startDate format", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const result = await saveOnboarding({ ...VALID_DATA, startDate: "April 20" });
    expect(result.success).toBe(false);
  });

  it("returns error when user not found in DB", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue(null);

    const result = await saveOnboarding(VALID_DATA);
    expect(result).toEqual({ success: false, error: "User not found" });
  });

  it("returns error on DB exception", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockRejectedValue(new Error("Connection failed"));

    const result = await saveOnboarding(VALID_DATA);
    expect(result).toEqual({ success: false, error: "Failed to save onboarding data" });
  });
});
