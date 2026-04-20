/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/Streak", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
  },
}));

import { GET } from "@/app/api/streak/route";
import { auth } from "@/auth";
import Streak from "@/lib/db/models/Streak";

const mockAuth = auth as jest.Mock;
const mockFindOne = Streak.findOne as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/streak", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns zero streak when no document exists", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(null) });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ count: 0, personalBest: 0, lastDate: "", activeDays: [] });
  });

  it("returns streak data including personalBest for authenticated user", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const doc = { count: 5, personalBest: 18, lastDate: "2026-04-20", activeDays: ["2026-04-20", "2026-04-19"] };
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.count).toBe(5);
    expect(body.personalBest).toBe(18);
    expect(body.lastDate).toBe("2026-04-20");
    expect(body.activeDays).toHaveLength(2);
  });

  it("returns only expected fields", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const doc = { count: 3, personalBest: 5, lastDate: "2026-04-18", activeDays: ["2026-04-18"], userId: "user-1", _id: "abc" };
    mockFindOne.mockReturnValue({ lean: jest.fn().mockResolvedValue(doc) });

    const res = await GET();
    const body = await res.json();
    expect(Object.keys(body)).toEqual(["count", "personalBest", "lastDate", "activeDays"]);
  });
});
