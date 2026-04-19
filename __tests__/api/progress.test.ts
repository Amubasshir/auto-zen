/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/RoadmapProgress", () => ({
  __esModule: true,
  default: { findOne: jest.fn(), findOneAndUpdate: jest.fn() },
}));

import { GET, PATCH } from "@/app/api/progress/route";
import { auth } from "@/auth";
import RoadmapProgress from "@/lib/db/models/RoadmapProgress";

const mockAuth = auth as jest.Mock;
const mockFindOne = RoadmapProgress.findOne as jest.Mock;
const mockUpdate = RoadmapProgress.findOneAndUpdate as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@example.com" } };

function makeRequest(method: string, body?: object) {
  return new Request(`http://localhost/api/progress`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUpdate.mockResolvedValue({});
});

// ── GET ──────────────────────────────────────────────────────────────────────

describe("GET /api/progress", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns empty progress when no DB record exists", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFindOne.mockReturnValue({ lean: () => Promise.resolve(null) });
    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ completedItems: {}, completedTasks: {} });
  });

  it("returns stored progress when record exists", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFindOne.mockReturnValue({
      lean: () =>
        Promise.resolve({
          completedItems: { "item-1": true },
          completedTasks: { "item-1": { "task-1": true } },
          lastActiveItem: "item-1",
        }),
    });
    const res = await GET();
    const body = await res.json();
    expect(body.completedItems["item-1"]).toBe(true);
    expect(body.completedTasks["item-1"]["task-1"]).toBe(true);
    expect(body.lastActiveItem).toBe("item-1");
  });
});

// ── PATCH ─────────────────────────────────────────────────────────────────────

describe("PATCH /api/progress", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PATCH(makeRequest("PATCH", { type: "item", itemId: "i1", completed: true }));
    expect(res.status).toBe(401);
  });

  it("returns 400 for invalid payload (missing itemId)", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(makeRequest("PATCH", { type: "item", completed: true }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid type", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(makeRequest("PATCH", { type: "unknown", itemId: "i1", completed: true }));
    expect(res.status).toBe(400);
  });

  it("updates completedItems on item toggle", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(makeRequest("PATCH", { type: "item", itemId: "item-1", completed: true }));
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      { userId: "user-1" },
      expect.objectContaining({
        $set: expect.objectContaining({ "completedItems.item-1": true }),
      }),
      { upsert: true },
    );
  });

  it("sets lastActiveItem on item toggle", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    await PATCH(makeRequest("PATCH", { type: "item", itemId: "item-2", completed: false }));
    const [, update] = mockUpdate.mock.calls[0];
    expect(update.$set.lastActiveItem).toBe("item-2");
  });

  it("updates completedTasks on task toggle", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(
      makeRequest("PATCH", { type: "task", itemId: "item-1", taskId: "task-1", completed: true }),
    );
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      { userId: "user-1" },
      { $set: { "completedTasks.item-1.task-1": true } },
      { upsert: true },
    );
  });

  it("returns 400 for task toggle missing taskId", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(
      makeRequest("PATCH", { type: "task", itemId: "item-1", completed: true }),
    );
    expect(res.status).toBe(400);
  });
});
