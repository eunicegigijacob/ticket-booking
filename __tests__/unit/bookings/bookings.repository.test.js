const prisma = require("../../../src/prisma");
const redisService = require("../../../src/redis/redis.service");
const bookingRepository = require("../../../src/modules/bookings/bookings.repository");

jest.mock("../../../src/prisma", () => ({
  booking: {
    create: jest.fn(),
    update: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    findMany: jest.fn(),
  },
  waitlist: {
    create: jest.fn(),
    findMany: jest.fn(),
    delete: jest.fn(),
    findFirst: jest.fn(),
  },
}));

jest.mock("../../../src/redis/redis.service", () => ({
  set: jest.fn(),
}));

describe("Booking Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should create a booking", async () => {
    const bookingData = {
      userId: "user123",
      eventId: "event456",
      status: "CONFIRMED",
    };
    prisma.booking.create.mockResolvedValue(bookingData);

    const result = await bookingRepository.createBooking(bookingData);
    expect(result).toEqual(bookingData);
    expect(prisma.booking.create).toHaveBeenCalledWith({ data: bookingData });
  });

  test("should cancel a booking", async () => {
    const bookingId = "booking123";
    const cancelledBooking = { id: bookingId, status: "CANCELLED" };
    prisma.booking.update.mockResolvedValue(cancelledBooking);

    const result = await bookingRepository.cancelBooking(bookingId);
    expect(result).toEqual(cancelledBooking);
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: bookingId },
      data: { status: "CANCELLED" },
    });
  });

  test("should get booking by ID", async () => {
    const bookingId = "booking123";
    const booking = { id: bookingId, userId: "user123" };
    prisma.booking.findUnique.mockResolvedValue(booking);

    const result = await bookingRepository.getBookingById(bookingId);
    expect(result).toEqual(booking);
    expect(prisma.booking.findUnique).toHaveBeenCalledWith({
      where: { id: bookingId },
    });
  });

  test("should get total confirmed bookings for an event", async () => {
    const eventId = "event123";
    prisma.booking.count.mockResolvedValue(5);

    const result = await bookingRepository.getTotalEventBooking(eventId);
    expect(result).toBe(5);
    expect(prisma.booking.count).toHaveBeenCalledWith({
      where: { eventId, status: { equals: "CONFIRMED" } },
    });
  });

  test("should retrieve multiple bookings based on query", async () => {
    const query = { eventId: "event123" };
    const bookings = [{ id: "1" }, { id: "2" }];
    prisma.booking.findMany.mockResolvedValue(bookings);

    const result = await bookingRepository.getBooking(query);
    expect(result).toEqual(bookings);
    expect(prisma.booking.findMany).toHaveBeenCalledWith({ where: query });
  });

  test("should update a booking", async () => {
    const bookingId = "booking123";
    const data = { status: "CONFIRMED" };
    prisma.booking.update.mockResolvedValue({ id: bookingId, ...data });

    const result = await bookingRepository.updateBooking(bookingId, data);
    expect(result).toEqual({ id: bookingId, ...data });
    expect(prisma.booking.update).toHaveBeenCalledWith({
      where: { id: bookingId },
      data,
    });
  });

  test("should add a user to waitlist", async () => {
    const waitlistData = { eventId: "event123", userId: "user456" };
    prisma.waitlist.create.mockResolvedValue(waitlistData);

    const result = await bookingRepository.addToWaitlist(waitlistData);
    expect(result).toEqual(waitlistData);
    expect(redisService.set).toHaveBeenCalledWith({
      key: `waitlist:${waitlistData.eventId}`,
      ttl: expect.any(Number),
      value: waitlistData.userId,
    });
    expect(prisma.waitlist.create).toHaveBeenCalledWith({
      data: { ...waitlistData },
    });
  });

  test("should retrieve waitlist for an event", async () => {
    const eventId = "event123";
    const waitlist = [{ id: "1" }, { id: "2" }];
    prisma.waitlist.findMany.mockResolvedValue(waitlist);

    const result = await bookingRepository.getWaitlist(eventId);
    expect(result).toEqual(waitlist);
    expect(prisma.waitlist.findMany).toHaveBeenCalledWith({
      where: { eventId },
      orderBy: { createdAt: "asc" },
    });
  });

  test("should remove a user from waitlist", async () => {
    const waitlistId = "waitlist123";
    prisma.waitlist.delete.mockResolvedValue({ id: waitlistId });

    const result = await bookingRepository.removeFromWaitlist(waitlistId);
    expect(result).toEqual({ id: waitlistId });
    expect(prisma.waitlist.delete).toHaveBeenCalledWith({
      where: { id: waitlistId },
    });
  });

  test("should get user waitlist entry", async () => {
    const userId = "user123";
    const eventId = "event456";
    const waitlistEntry = { userId, eventId };
    prisma.waitlist.findFirst.mockResolvedValue(waitlistEntry);

    const result = await bookingRepository.getUserWaitList(userId, eventId);
    expect(result).toEqual(waitlistEntry);
    expect(prisma.waitlist.findFirst).toHaveBeenCalledWith({
      where: { eventId, userId },
    });
  });
});
