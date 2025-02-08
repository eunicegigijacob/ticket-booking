const prisma = require("../../src/prisma"); 
const bookingRepository = require("../../src/bookings/bookings.repository");

jest.mock("../../src/prisma");

describe("Booking Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should create a booking", async () => {
    const bookingData = { userId: "123", eventId: "456" };
    prisma.booking.create.mockResolvedValue({ id: "1", ...bookingData });

    const result = await bookingRepository.createBooking(bookingData);

    expect(result).toEqual({ id: "1", ...bookingData });
    expect(prisma.booking.create).toHaveBeenCalledWith({ data: bookingData });
  });

  it("should cancel a booking", async () => {
    const bookingId = "1";
    prisma.booking.update.mockResolvedValue({
      id: bookingId,
      status: "cancelled",
    });

    const result = await bookingRepository.cancelBooking(bookingId);

    expect(result).toEqual({ id: bookingId, status: "cancelled" });
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: bookingId },
      data: { status: "cancelled" },
    });
  });

  it("should get a booking by ID", async () => {
    const bookingId = "1";
    const mockBooking = { id: bookingId, userId: "123", eventId: "456" };
    prisma.booking.findUnique.mockResolvedValue(mockBooking);

    const result = await bookingRepository.getBooking(bookingId);

    expect(result).toEqual(mockBooking);
    expect(prisma.booking.findUnique).toHaveBeenCalledWith({
      where: { id: bookingId },
    });
  });
});
