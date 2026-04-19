/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/CustomResource", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

import { GET, POST } from "@/app/api/resources/route";
import { PATCH, DELETE } from "@/app/api/resources/[id]/route";
import { auth } from "@/auth";
import CustomResource from "@/lib/db/models/CustomResource";

const mockAuth = auth as jest.Mock;
const mockFind = CustomResource.find as jest.Mock;
const mockCreate = CustomResource.create as jest.Mock;
const mockUpdate = CustomResource.findOneAndUpdate as jest.Mock;
const mockDelete = CustomResource.findOneAndDelete as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

const VALID_RESOURCE = {
  weekId: "week-1",
  title: "Make.com Tutorial",
  url: "https://youtube.com/watch?v=abc",
  type: "youtube",
  difficulty: "beginner",
  duration: "30 min",
  tasks: ["Watch video"],
};

function makeDoc(overrides = {}) {
  return {
    _id: { toString: () => "res-1" },
    weekId: "week-1",
    title: "Make.com Tutorial",
    url: "https://youtube.com/watch?v=abc",
    type: "youtube",
    difficulty: "beginner",
    duration: "30 min",
    tasks: ["Watch video"],
    createdAt: new Date("2026-04-01"),
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
  mockUpdate.mockResolvedValue(makeDoc());
  mockDelete.mockResolvedValue(makeDoc());
  mockCreate.mockResolvedValue(makeDoc());
});

// ── GET ──────────────────────────────────────────────────────────────────────

describe("GET /api/resources", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET(makeReq("GET", "http://localhost/api/resources"));
    expect(res.status).toBe(401);
  });

  it("returns empty array when no resources exist", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([]) }) });
    const res = await GET(makeReq("GET", "http://localhost/api/resources"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("returns serialised resources", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([makeDoc()]) }) });
    const res = await GET(makeReq("GET", "http://localhost/api/resources"));
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].id).toBe("res-1");
    expect(body[0].title).toBe("Make.com Tutorial");
  });

  it("filters by weekId query param", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ sort: () => ({ lean: () => Promise.resolve([]) }) });
    await GET(makeReq("GET", "http://localhost/api/resources?weekId=week-2"));
    expect(mockFind).toHaveBeenCalledWith(
      expect.objectContaining({ weekId: "week-2" }),
    );
  });
});

// ── POST ─────────────────────────────────────────────────────────────────────

describe("POST /api/resources", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await POST(makeReq("POST", "http://localhost/api/resources", VALID_RESOURCE));
    expect(res.status).toBe(401);
  });

  it("returns 201 with created resource on valid input", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(makeReq("POST", "http://localhost/api/resources", VALID_RESOURCE));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.id).toBe("res-1");
    expect(body.title).toBe("Make.com Tutorial");
  });

  it("returns 400 when title is missing", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(
      makeReq("POST", "http://localhost/api/resources", { ...VALID_RESOURCE, title: "" }),
    );
    expect(res.status).toBe(400);
  });

  it("returns 400 for invalid URL", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(
      makeReq("POST", "http://localhost/api/resources", { ...VALID_RESOURCE, url: "not-a-url" }),
    );
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/valid URL/i);
  });

  it("returns 400 for invalid type enum", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await POST(
      makeReq("POST", "http://localhost/api/resources", { ...VALID_RESOURCE, type: "podcast" }),
    );
    expect(res.status).toBe(400);
  });

  it("creates resource with userId from session", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    await POST(makeReq("POST", "http://localhost/api/resources", VALID_RESOURCE));
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ userId: "user-1", title: "Make.com Tutorial" }),
    );
  });
});

// ── PATCH ─────────────────────────────────────────────────────────────────────

describe("PATCH /api/resources/[id]", () => {
  const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/resources/res-1", { title: "New Title" }),
      makeParams("res-1"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 200 on valid partial update", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/resources/res-1", { title: "Updated" }),
      makeParams("res-1"),
    );
    expect(res.status).toBe(200);
  });

  it("returns 404 when resource not found", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue(null);
    const res = await PATCH(
      makeReq("PATCH", "http://localhost/api/resources/bad-id", { title: "X" }),
      makeParams("bad-id"),
    );
    expect(res.status).toBe(404);
  });
});

// ── DELETE ────────────────────────────────────────────────────────────────────

describe("DELETE /api/resources/[id]", () => {
  const makeParams = (id: string) => ({ params: Promise.resolve({ id }) });

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await DELETE(
      makeReq("DELETE", "http://localhost/api/resources/res-1"),
      makeParams("res-1"),
    );
    expect(res.status).toBe(401);
  });

  it("returns 200 on successful delete", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const res = await DELETE(
      makeReq("DELETE", "http://localhost/api/resources/res-1"),
      makeParams("res-1"),
    );
    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith({ _id: "res-1", userId: "user-1" });
  });

  it("returns 404 when resource not found", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockDelete.mockResolvedValue(null);
    const res = await DELETE(
      makeReq("DELETE", "http://localhost/api/resources/bad-id"),
      makeParams("bad-id"),
    );
    expect(res.status).toBe(404);
  });
});
