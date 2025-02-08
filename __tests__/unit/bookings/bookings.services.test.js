const bookingService = require("../../src/bookings/bookings.service");
const bookingRepository = require("../../src/bookings/bookings.repository");

jest.mock("../../src/bookings/bookings.repository");

describe("Booking Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a booking if tickets are available", async () => {
    const bookingData = { userId: "123", eventId: "456" };

    bookingRepository.getAvailableTickets = jest.fn().mockResolvedValue(5);
    bookingRepository.createBooking.mockResolvedValue({
      id: "1",
      ...bookingData,
    });

    const result = await bookingService.createBooking(bookingData);

    expect(result).toEqual({ id: "1", ...bookingData });
    expect(bookingRepository.getAvailableTickets).toHaveBeenCalledWith(
      bookingData.eventId
    );
    expect(bookingRepository.createBooking).toHaveBeenCalledWith(bookingData);
  });

  it("should call addToWaitlist if tickets are unavailable", async () => {
    const bookingData = { userId: "123", eventId: "456" };

    bookingRepository.getAvailableTickets = jest.fn().mockResolvedValue(0);

    bookingService.addToWaitlist = jest
      .fn()
      .mockResolvedValue({
        userId: "123",
        eventId: "456",
        status: "waitlisted",
      });

    const result = await bookingService.createBooking(bookingData);

    expect(result).toEqual({
      userId: "123",
      eventId: "456",
      status: "waitlisted",
    });
    expect(bookingRepository.getAvailableTickets).toHaveBeenCalledWith(
      bookingData.eventId
    );
    expect(bookingService.addToWaitlist).toHaveBeenCalledWith(bookingData);
    expect(bookingRepository.createBooking).not.toHaveBeenCalled();
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


