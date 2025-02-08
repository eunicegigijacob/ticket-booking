const request = require("supertest");
const app = require("../../../src/app"); 
const prisma = require("../../../src/prisma");

jest.mock("../../../src/prisma");

describe("Booking Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("POST /api/book should create a booking", async () => {
    prisma.booking.create.mockResolvedValue({
      id: "1",
      userId: "123",
      eventId: "456",
    });

    const res = await request(app)
      .post("/api/book")
      .send({ userId: "123", eventId: "456" });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id", "1");
  });

  it("PATCH /api/book should cancel a booking", async () => {
    prisma.booking.update.mockResolvedValue({ id: "1", status: "cancelled" });

    const res = await request(app).patch("/api/book").send({ bookingId: "1" });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("status", "cancelled");
  });

  it("GET /api/status/:bookingId should retrieve a booking", async () => {
    const mockBooking = { id: "1", userId: "123", eventId: "456" };
    prisma.booking.findUnique.mockResolvedValue(mockBooking);

    const res = await request(app).get("/api/status/1");

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockBooking);
  });
});
