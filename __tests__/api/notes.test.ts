/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/Note", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findOneAndUpdate: jest.fn(),
  },
}));

import { GET, POST } from "@/app/api/notes/route";
import { PATCH } from "@/app/api/notes/[id]/route";
import { auth } from "@/auth";
import Note from "@/lib/db/models/Note";

const mockAuth = auth as jest.Mock;
const mockFind = Note.find as jest.Mock;
const mockUpsert = Note.findOneAndUpdate as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

function makeDoc(overrides = {}) {
  return {
    _id: { toString: () => "note-1" },
    weekId: "week-1",
    content: "My notes here",
    updatedAt: new Date("2026-04-01"),
    ...overrides,
  };
}

function makeReq(method: string, url: string, body?: object) {
  return new Request(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockUpsert.mockResolvedValue(makeDoc());
});

// ── GET ──────────────────────────────────────────────────────────────────────

describe("GET /api/notes", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(makeReq("GET", "http://localhost/api/notes"));
    expect(res.status).toBe(401);
  });

  it("returns empty array when no notes exist", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ lean: () => Promise.resolve([]) });
    const res = await GET(makeReq("GET", "http://localhost/api/notes"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns serialised notes", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ lean: () => Promise.resolve([makeDoc()]) });
    const res = await GET(makeReq("GET", "http://localhost/api/notes"));
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].weekId).toBe("week-1");
    expect(body[0].content).toBe("My notes here");
  });

  it("filters by weekId when provided", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ lean: () => Promise.resolve([]) });
    await GET(makeReq("GET", "http://localhost/api/notes?weekId=week-2"));
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({ weekId: "week-2" }),
    );
  });
});

// ── POST (upsert) ─────────────────────────────────────────────────────────────

describe("POST /api/notes", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq("POST", "http://localhost/api/notes", {
      weekId: "week-1", content: "hello",
    }));
    expect(res.status).toBe(401);
  });

  it("returns 201 with upserted note", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(makeReq("POST", "http://localhost/api/notes", {
      weekId: "week-1", content: "hello",
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.weekId).toBe("week-1");
  });

  it("returns 400 when weekId is missing", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(makeReq("POST", "http://localhost/api/notes", {
      content: "hello",
    }));
    expect(res.status).toBe(400);
  });

  it("uses upsert so existing notes are updated not duplicated", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    await POST(makeReq("POST", "http://localhost/api/notes", {
      weekId: "week-1", content: "updated text",
    }));
    expect(mockUpsert).toHaveBeenCalledWith(
      { userId: "user-1", weekId: "week-1" },
      { $set: { content: "updated text" } },
      { upsert: true, new: true },
    );
  });

  it("defaults content to empty string when omitted", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    await POST(makeReq("POST", "http://localhost/api/notes", { weekId: "week-1" }));
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.any(Object),
      { $set: { content: "" } },
      expect.any(Object),
    );
  });
});

// ── PATCH ─────────────────────────────────────────────────────────────────────

describe("PATCH /api/notes/[id]", () => {
  const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/notes/note-1", { content: "updated" }),
      makeParams("note-1"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 200 on valid update", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/notes/note-1", { content: "updated" }),
      makeParams("note-1"),
    );
    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith(
      { _id: "note-1", userId: "user-1" },
      { $set: { content: "updated" } },
      { new: true },
    );
  });

  it("returns 404 when note not found", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpsert.mockResolvedValue(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/notes/bad-id", { content: "x" }),
      makeParams("bad-id"),
    );
    expect(res.status).toBe(404);
  });
});
