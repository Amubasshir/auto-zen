/** @jest-environment node */

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/db/connect", () => ({ dbConnect: jest.fn().mockResolvedValue(undefined) }));
jest.mock("@/lib/db/models/ProjectPortfolio", () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
  },
}));

import { GET, POST } from "@/app/api/projects/route";
import { PATCH, DELETE } from "@/app/api/projects/[id]/route";
import { auth } from "@/auth";
import ProjectPortfolio from "@/lib/db/models/ProjectPortfolio";

const mockAuth = auth as jest.Mock;
const mockFind = ProjectPortfolio.find as jest.Mock;
const mockCreate = ProjectPortfolio.create as jest.Mock;
const mockUpdate = ProjectPortfolio.findOneAndUpdate as jest.Mock;
const mockDelete = ProjectPortfolio.findOneAndDelete as jest.Mock;

const AUTHED = { user: { id: "user-1", name: "Ada", email: "ada@test.com" } };

function makeDoc(overrides = {}) {
  return {
    _id: { toString: () => "proj-1" },
    title: "Test Project",
    description: "A test",
    status: "planned",
    githubUrl: undefined,
    demoUrl: undefined,
    loomUrl: undefined,
    caseStudy: undefined,
    completedAt: undefined,
    createdAt: new Date("2026-01-01"),
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
});

// ── GET ──────────────────────────────────────────────────────────────────────

describe("GET /api/projects", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const res = await GET();
    expect(res.status).toBe(401);
  });

  it("returns projects for authenticated user", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([makeDoc()]) }) });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.projects).toHaveLength(1);
    expect(body.projects[0].title).toBe("Test Project");
  });

  it("returns empty array when no projects", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockFind.mockReturnValue({ sort: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) });

    const res = await GET();
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.projects).toHaveLength(0);
  });
});

// ── POST ─────────────────────────────────────────────────────────────────────

describe("POST /api/projects", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = makeReq("POST", "http://localhost/api/projects", { title: "Hi" });
    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("returns 400 for missing title", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const req = makeReq("POST", "http://localhost/api/projects", { title: "" });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("creates a project and returns 201", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockCreate.mockResolvedValue(makeDoc({ status: "planned" }));

    const req = makeReq("POST", "http://localhost/api/projects", {
      title: "Test Project",
      status: "planned",
    });
    const res = await POST(req);
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.project.title).toBe("Test Project");
    expect(body.project.id).toBe("proj-1");
  });
});

// ── PATCH ────────────────────────────────────────────────────────────────────

describe("PATCH /api/projects/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = makeReq("PATCH", "http://localhost/api/projects/proj-1", { title: "Updated" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue(null);
    const req = makeReq("PATCH", "http://localhost/api/projects/proj-1", { title: "Updated" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(404);
  });

  it("updates the project and returns 200", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockUpdate.mockResolvedValue(makeDoc({ title: "Updated" }));
    const req = makeReq("PATCH", "http://localhost/api/projects/proj-1", { title: "Updated" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.project.title).toBe("Updated");
  });

  it("sets completedAt when status moves to completed", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    const completed = makeDoc({ status: "completed", completedAt: new Date("2026-04-20") });
    mockUpdate.mockResolvedValue(completed);
    const req = makeReq("PATCH", "http://localhost/api/projects/proj-1", { status: "completed" });
    const res = await PATCH(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(200);
    expect(mockUpdate).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ $set: expect.objectContaining({ completedAt: expect.any(Date) }) }),
      expect.anything(),
    );
  });
});

// ── DELETE ───────────────────────────────────────────────────────────────────

describe("DELETE /api/projects/[id]", () => {
  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null);
    const req = makeReq("DELETE", "http://localhost/api/projects/proj-1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(401);
  });

  it("returns 404 when project not found", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockDelete.mockResolvedValue(null);
    const req = makeReq("DELETE", "http://localhost/api/projects/proj-1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(404);
  });

  it("deletes the project and returns success", async () => {
    mockAuth.mockResolvedValue(AUTHED);
    mockDelete.mockResolvedValue(makeDoc());
    const req = makeReq("DELETE", "http://localhost/api/projects/proj-1");
    const res = await DELETE(req, { params: Promise.resolve({ id: "proj-1" }) });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
  });
});
