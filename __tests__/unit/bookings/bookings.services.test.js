const {
  createBooking,
  processBooking,
  getAvailableTickets,
  addToWaitlist,
  getBooking,
  getUserBookings,
  cancelBooking,
} = require("../../../src/modules/bookings/bookings.service");


// Mock dependencies
jest.mock("../../../src/modules/bookings/bookings.repository", () => ({
  createBooking: jest.fn(),
  getBookingById: jest.fn(),
  updateBooking: jest.fn(),
  getBooking: jest.fn(),
  getUserWaitList: jest.fn(),
  addToWaitlist: jest.fn(),
  removeFromWaitlist: jest.fn(),
  getWaitlist: jest.fn(),
}));

jest.mock("../../../src/modules/events/events.service", () => ({
  getEvent: jest.fn(),
  decreaseEventTicketCount: jest.fn(),
  increaseEventTicketCount: jest.fn(),
}));

jest.mock("bull", () => {
  return jest.fn().mockImplementation(() => ({
    add: jest.fn(),
  }));
});

const bookingRepository = require("../../../src/modules/bookings/bookings.repository");
const eventService = require("../../../src/modules/events/events.service");

describe("Booking Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createBooking", () => {
    it("should create a booking when tickets are available", async () => {
    
      const mockBookingData = {
        eventId: "123",
        userId: "user1",
      };
      const mockEvent = { availableTickets: 5 };
      const mockPendingBooking = {
        id: "booking1",
        ...mockBookingData,
      };

      eventService.getEvent.mockResolvedValue(mockEvent);
      bookingRepository.createBooking.mockResolvedValue(mockPendingBooking);

      const result = await createBooking(mockBookingData);

      expect(result.status).toBe(true);
      expect(result.message).toContain("booking request has been received");
      expect(result.data.booking).toEqual(mockPendingBooking);
      expect(bookingRepository.createBooking).toHaveBeenCalledWith(
        mockBookingData
      );
    });

    it("should add to waitlist when no tickets are available", async () => {

      const mockBookingData = {
        eventId: "123",
        userId: "user1",
      };
      const mockEvent = { availableTickets: 0 };
      const mockWaitlistRecord = {
        id: "waitlist1",
        ...mockBookingData,
      };

      eventService.getEvent.mockResolvedValue(mockEvent);
      bookingRepository.getUserWaitList.mockResolvedValue(null);
      bookingRepository.addToWaitlist.mockResolvedValue(mockWaitlistRecord);

     
      const result = await createBooking(mockBookingData);

      
      expect(result.status).toBe(false);
      expect(result.message).toContain("out of tickets");
      expect(result.data.waitlist).toEqual(mockWaitlistRecord);
    });
  });

  describe("processBooking", () => {
    it("should confirm booking when tickets are available", async () => {
     
      const mockBookingId = "booking1";
      const mockBooking = {
        id: mockBookingId,
        eventId: "123",
        userId: "user1",
      };
      const mockEvent = { availableTickets: 5 };

      bookingRepository.getBookingById.mockResolvedValue(mockBooking);
      eventService.getEvent.mockResolvedValue(mockEvent);

      
      await processBooking({ bookingId: mockBookingId });

      
      expect(bookingRepository.updateBooking).toHaveBeenCalledWith(
        mockBookingId,
        { status: "CONFIRMED" }
      );
      expect(eventService.decreaseEventTicketCount).toHaveBeenCalledWith(
        mockBooking.eventId
      );
    });

    it("should waitlist booking when no tickets are available", async () => {
     
      const mockBookingId = "booking1";
      const mockBooking = {
        id: mockBookingId,
        eventId: "123",
        userId: "user1",
      };
      const mockEvent = { availableTickets: 0 };
      const mockWaitlistRecord = { id: "waitlist1" };

      bookingRepository.getBookingById.mockResolvedValue(mockBooking);
      eventService.getEvent.mockResolvedValue(mockEvent);
      bookingRepository.addToWaitlist.mockResolvedValue(mockWaitlistRecord);

      
      await processBooking({ bookingId: mockBookingId });

      
      expect(bookingRepository.updateBooking).toHaveBeenCalledWith(
        mockBookingId,
        {
          status: "WAITLISTED",
          waitlistId: mockWaitlistRecord.id,
        }
      );
    });
  });

  describe("getBooking", () => {
    it("should retrieve a booking successfully", async () => {
     
      const mockBookingId = "booking1";
      const mockBookingData = {
        id: mockBookingId,
        eventId: "123",
        userId: "user1",
      };

      bookingRepository.getBookingById.mockResolvedValue(mockBookingData);

     
      const result = await getBooking(mockBookingId);

      
      expect(result.status).toBe(true);
      expect(result.message).toContain("successfully retrieved");
      expect(result.data).toEqual(mockBookingData);
    });

    it("should throw an error for non-existent booking", async () => {
      
      const mockBookingId = "nonexistent";
      bookingRepository.getBookingById.mockResolvedValue(null);

     
      await expect(getBooking(mockBookingId)).rejects.toThrow(
        "Booking record not found"
      );
    });
  });

  describe("cancelBooking", () => {
    it("should cancel a confirmed booking", async () => {
     
      const mockBookingId = "booking1";
      const mockUserId = "user1";
      const mockBooking = {
        id: mockBookingId,
        userId: mockUserId,
        eventId: "123",
        status: "CONFIRMED",
      };
      const mockWaitlist = [
        {
          id: "waitlist1",
          userId: "user2",
        },
      ];

      bookingRepository.getBookingById.mockResolvedValue(mockBooking);
      bookingRepository.getWaitlist.mockResolvedValue(mockWaitlist);
      bookingRepository.getBooking.mockResolvedValue([]);

     
      const result = await cancelBooking(mockBookingId, mockUserId);

    
      expect(result.status).toBe(true);
      expect(result.message).toContain("Booking has been cancelled");
      expect(bookingRepository.updateBooking).toHaveBeenCalledWith(
        mockBookingId,
        { status: "CANCELLED" }
      );
      expect(eventService.increaseEventTicketCount).toHaveBeenCalledWith(
        mockBooking.eventId
      );
    });

    it("should throw error when cancelling another user's booking", async () => {
      
      const mockBookingId = "booking1";
      const mockUserId = "user1";
      const mockBooking = {
        id: mockBookingId,
        userId: "user2",
        status: "CONFIRMED",
      };

      bookingRepository.getBookingById.mockResolvedValue(mockBooking);

      
      await expect(cancelBooking(mockBookingId, mockUserId)).rejects.toThrow(
        "not authorized"
      );
    });

    it("should throw error when booking is already cancelled", async () => {
     
      const mockBookingId = "booking1";
      const mockUserId = "user1";
      const mockBooking = {
        id: mockBookingId,
        userId: mockUserId,
        status: "CANCELLED",
      };

      bookingRepository.getBookingById.mockResolvedValue(mockBooking);

   
      await expect(cancelBooking(mockBookingId, mockUserId)).rejects.toThrow(
        "already been cancelled"
      );
    });
  });

  describe("addToWaitlist", () => {
    it("should add to waitlist if not already waitlisted", async () => {
     
      const mockBookingData = {
        userId: "user1",
        eventId: "123",
      };
      const mockWaitlistRecord = {
        id: "waitlist1",
        ...mockBookingData,
      };

      bookingRepository.getUserWaitList.mockResolvedValue(null);
      bookingRepository.addToWaitlist.mockResolvedValue(mockWaitlistRecord);

     
      const result = await addToWaitlist(mockBookingData);

      
      expect(result).toEqual(mockWaitlistRecord);
      expect(bookingRepository.addToWaitlist).toHaveBeenCalledWith(
        mockBookingData
      );
    });

    it("should return existing waitlist if already waitlisted", async () => {
 
      const mockBookingData = {
        userId: "user1",
        eventId: "123",
      };
      const mockExistingWaitlist = {
        id: "waitlist1",
        ...mockBookingData,
      };

      bookingRepository.getUserWaitList.mockResolvedValue(mockExistingWaitlist);

     
      const result = await addToWaitlist(mockBookingData);

     
      expect(result).toEqual(mockExistingWaitlist);
      expect(bookingRepository.addToWaitlist).not.toHaveBeenCalled();
    });
  });

  describe("getUserBookings", () => {
    it("should retrieve user bookings", async () => {
     
      const mockUserId = "user1";
      const mockUserBookings = [
        { id: "booking1", eventId: "123" },
        { id: "booking2", eventId: "456" },
      ];

      bookingRepository.getBooking.mockResolvedValue(mockUserBookings);

     
      const result = await getUserBookings(mockUserId);

     
      expect(result.status).toBe(true);
      expect(result.message).toContain("Bookings successfully retrieved");
      expect(result.data.userBookings).toEqual(mockUserBookings);
    });
  });

  describe("getAvailableTickets", () => {
    it("should return available tickets for an event", async () => {
     
      const mockEventId = "123";
      const mockEvent = { availableTickets: 5 };

      eventService.getEvent.mockResolvedValue(mockEvent);

      
      const result = await getAvailableTickets(mockEventId);

      
      expect(result).toBe(5);
    });

    it("should throw error for non-existent event", async () => {
     
      const mockEventId = "nonexistent";
      eventService.getEvent.mockResolvedValue(null);

     
      await expect(getAvailableTickets(mockEventId)).rejects.toThrow(
        "Event not found"
      );
    });
  });
});
