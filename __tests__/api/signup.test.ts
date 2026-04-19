/** @jest-environment node */
// API route tests need Node.js environment — jsdom lacks the Web Request API

jest.mock("@/lib/db/connect", () => ({
  dbConnect: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("@/lib/db/models/User", () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn().mockResolvedValue("hashed-password"),
  compare: jest.fn(),
}));

import { POST } from "@/app/api/auth/signup/route";
import User from "@/lib/db/models/User";
import bcrypt from "bcryptjs";

const mockFindOne = User.findOne as jest.Mock;
const mockCreate = User.create as jest.Mock;
const mockHash = bcrypt.hash as jest.Mock;

function makeRequest(body: object) {
  return new Request("http://localhost/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/auth/signup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFindOne.mockResolvedValue(null); // no existing user
    mockCreate.mockResolvedValue({ _id: "user-1" });
    mockHash.mockResolvedValue("hashed-password");
  });

  it("returns 201 and success on valid input", async () => {
    const res = await POST(makeRequest({
      name: "Ada",
      email: "ada@example.com",
      password: "password123",
    }));
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.success).toBe(true);
  });

  it("returns 400 when name is missing", async () => {
    const res = await POST(makeRequest({ email: "ada@example.com", password: "password123" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeTruthy();
  });

  it("returns 400 for invalid email format", async () => {
    const res = await POST(makeRequest({ name: "Ada", email: "not-an-email", password: "password123" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when password is too short", async () => {
    const res = await POST(makeRequest({ name: "Ada", email: "ada@example.com", password: "short" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/8 characters/i);
  });

  it("returns 409 when email already exists", async () => {
    mockFindOne.mockResolvedValue({ _id: "existing-user" });
    const res = await POST(makeRequest({
      name: "Ada",
      email: "ada@example.com",
      password: "password123",
    }));
    expect(res.status).toBe(409);
    const body = await res.json();
    expect(body.error).toMatch(/already exists/i);
  });

  it("hashes the password before saving", async () => {
    await POST(makeRequest({ name: "Ada", email: "ada@example.com", password: "password123" }));
    expect(mockHash).toHaveBeenCalledWith("password123", 12);
    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({ passwordHash: "hashed-password" }),
    );
  });

  it("returns 500 on unexpected DB error", async () => {
    mockCreate.mockRejectedValue(new Error("DB down"));
    const res = await POST(makeRequest({ name: "Ada", email: "ada@example.com", password: "password123" }));
    expect(res.status).toBe(500);
  });

  it("does not create user when validation fails", async () => {
    await POST(makeRequest({ email: "bad", password: "x" }));
    expect(mockCreate).not.toHaveBeenCalled();
  });
});
