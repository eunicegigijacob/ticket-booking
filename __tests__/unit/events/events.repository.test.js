const prisma = require("../../../src/prisma");

const {
  createEvent,
  getEvent,
  getAllEvents,
  decreaseEventTicketCount,
  increaseEventTicketCount,
} = require("../../../src/modules/events/events.repository"); 


jest.mock("../../../src/prisma", () => ({
  event: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Event Repository", () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should create a new event successfully", async () => {
     
      const mockEventData = {
        name: "Test Event",
        description: "A test event",
        date: new Date(),
        availableTickets: 100,
      };
      const mockCreatedEvent = {
        id: "event123",
        ...mockEventData,
      };

      prisma.event.create.mockResolvedValue(mockCreatedEvent);

     
      const result = await createEvent(mockEventData);

      
      expect(prisma.event.create).toHaveBeenCalledWith({
        data: mockEventData,
      });
      expect(result).toEqual(mockCreatedEvent);
    });

    it("should handle errors when creating an event", async () => {
     
      const mockEventData = {
        name: "Test Event",
        description: "A test event",
      };

      prisma.event.create.mockRejectedValue(new Error("Database error"));

      await expect(createEvent(mockEventData)).rejects.toThrow(
        "Database error"
      );
    });
  });

  describe("getEvent", () => {
    it("should retrieve an event with related data", async () => {
     
      const mockEventId = "event123";
      const mockEvent = {
        id: mockEventId,
        name: "Test Event",
        Waitlist: [],
        bookings: [],
      };

      prisma.event.findUnique.mockResolvedValue(mockEvent);

     
      const result = await getEvent(mockEventId);

      
      expect(prisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: mockEventId },
        include: {
          Waitlist: true,
          bookings: true,
        },
      });
      expect(result).toEqual(mockEvent);
    });

    it("should return null for non-existent event", async () => {
     
      const mockEventId = "nonexistent";

      prisma.event.findUnique.mockResolvedValue(null);

     
      const result = await getEvent(mockEventId);

      
      expect(result).toBeNull();
    });
  });

  describe("getAllEvents", () => {
    it("should retrieve all events", async () => {
     
      const mockEvents = [
        { id: "event1", name: "Event 1" },
        { id: "event2", name: "Event 2" },
      ];

      prisma.event.findMany.mockResolvedValue(mockEvents);

     
      const result = await getAllEvents();

      
      expect(prisma.event.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockEvents);
    });

    it("should return an empty array when no events exist", async () => {
     
      prisma.event.findMany.mockResolvedValue([]);

     
      const result = await getAllEvents();

      
      expect(result).toEqual([]);
    });
  });

  describe("decreaseEventTicketCount", () => {
    it("should decrease ticket count by 1", async () => {
     
      const mockEventId = "event123";
      const mockUpdatedEvent = {
        id: mockEventId,
        availableTickets: 99,
      };

      prisma.event.update.mockResolvedValue(mockUpdatedEvent);

     
      const result = await decreaseEventTicketCount(mockEventId);

      
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: mockEventId },
        data: {
          availableTickets: {
            decrement: 1,
          },
        },
      });
      expect(result).toEqual(mockUpdatedEvent);
    });
  });

  describe("increaseEventTicketCount", () => {
    it("should increase ticket count by 1", async () => {
     
      const mockEventId = "event123";
      const mockUpdatedEvent = {
        id: mockEventId,
        availableTickets: 101,
      };

      prisma.event.update.mockResolvedValue(mockUpdatedEvent);

     
      const result = await increaseEventTicketCount(mockEventId);

      
      expect(prisma.event.update).toHaveBeenCalledWith({
        where: { id: mockEventId },
        data: {
          availableTickets: {
            increment: 1,
          },
        },
      });
      expect(result).toEqual(mockUpdatedEvent);
    });
  });
});
