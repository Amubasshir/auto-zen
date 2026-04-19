// Tests for dbConnect singleton behaviour (mongoose is mocked)
jest.mock("mongoose", () => ({
  connect: jest.fn().mockResolvedValue({ connection: { readyState: 1 } }),
  connection: { readyState: 0 },
}));

describe("dbConnect", () => {
  beforeEach(() => {
    // Reset singleton cache between tests
    const g = global as typeof globalThis & {
      _mongooseConn: null;
      _mongoosePromise: null;
    };
    g._mongooseConn = null;
    g._mongoosePromise = null;
    jest.resetModules();
  });

  it("calls mongoose.connect with MONGODB_URI", async () => {
    const mongoose = await import("mongoose");
    const { dbConnect } = await import("@/lib/db/connect");
    await dbConnect();
    expect(mongoose.connect).toHaveBeenCalledWith(
      process.env.MONGODB_URI,
      expect.objectContaining({ bufferCommands: false }),
    );
  });

  it("returns the same connection on repeated calls", async () => {
    const { dbConnect } = await import("@/lib/db/connect");
    const conn1 = await dbConnect();
    const conn2 = await dbConnect();
    expect(conn1).toBe(conn2);
  });

  it("only calls mongoose.connect once for multiple calls", async () => {
    const mongoose = await import("mongoose");
    const { dbConnect } = await import("@/lib/db/connect");
    await dbConnect();
    await dbConnect();
    await dbConnect();
    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
