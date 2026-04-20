/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/Streak", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import { fetchStreak } from "@/actions/streak";
import { auth } from "@/auth";
import Streak from "@/lib/db/models/Streak";

const mockAuth = auth as jest.Mock;
const mockFindOne = Streak.findOne as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("fetchStreak()", () => {
  it("returns empty streak when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const result = await fetchStreak();
    expect(result).toEqual({ count: 0, personalBest: 0, lastDate: "", activeDays: [] });
  });

  it("returns empty streak when no DB document exists", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const result = await fetchStreak();
    expect(result).toEqual({ count: 0, personalBest: 0, lastDate: "", activeDays: [] });
  });

  it("returns real streak data from DB", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const doc = { count: 12, personalBest: 18, lastDate: "2026-04-20", activeDays: ["2026-04-20"] };
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) });

    const result = await fetchStreak();
    expect(result.count).toBe(12);
    expect(result.personalBest).toBe(18);
    expect(result.lastDate).toBe("2026-04-20");
    expect(result.activeDays).toEqual(["2026-04-20"]);
  });

  it("defaults personalBest to 0 when field missing from DB doc", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const doc = { count: 5, lastDate: "2026-04-19", activeDays: [] }; // no personalBest field
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) });

    const result = await fetchStreak();
    expect(result.personalBest).toBe(0);
  });

  it("returns empty streak on DB error", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFindOne.mockReturnValue({ lean: jest.fn().mockRejectedValue(new Error("DB fail")) });

    const result = await fetchStreak();
    expect(result).toEqual({ count: 0, personalBest: 0, lastDate: "", activeDays: [] });
  });
});
