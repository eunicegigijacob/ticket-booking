const bookingService = require("../../../src/modules/bookings/bookings.service");
const {
  createBooking,
  cancelBooking,
  getBooking,
} = require("../../src/bookings/bookings.controller");

jest.mock("../../src/bookings/bookings.service");

describe("Booking Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  it("should create a booking", async () => {
    req.body = { userId: "123", eventId: "456" };
    bookingService.createBooking.mockResolvedValue({ id: "1", ...req.body });

    await createBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ id: "1", ...req.body });
  });

  it("should cancel a booking", async () => {
    req.body = { bookingId: "1" };
    bookingService.cancelBooking.mockResolvedValue({
      id: "1",
      status: "cancelled",
    });

    await cancelBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: "1", status: "cancelled" });
  });

  it("should get a booking by ID", async () => {
    req.params.bookingId = "1";
    const mockBooking = { id: "1", userId: "123", eventId: "456" };
    bookingService.getBooking.mockResolvedValue(mockBooking);

    await getBooking(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockBooking);
  });
});
