const prisma = require("../../../src/prisma");
const eventRepository = require("../../../src/modules/events/events.repository");

jest.mock("../../../src/prisma");

describe("Event Repository", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should create an event in the database", async () => {
      const eventData = {
        name: "Sample Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      };

      const createdEvent = { id: "eventId123", ...eventData };

      prisma.event = {
        create: jest.fn().mockResolvedValue(createdEvent),
      };

      const result = await eventRepository.createEvent(eventData);
      expect(prisma.event.create).toHaveBeenCalledWith({ data: eventData });
      expect(result).toEqual(createdEvent);
    });
  });

  describe("getEvent", () => {
    it("should retrieve an event by id", async () => {
      const eventId = "eventId123";
      const event = {
        id: eventId,
        name: "Sample Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      };

      prisma.event = {
        findUnique: jest.fn().mockResolvedValue(event),
      };

      const result = await eventRepository.getEvent(eventId);
      expect(prisma.event.findUnique).toHaveBeenCalledWith({
        where: { id: eventId },
      });
      expect(result).toEqual(event);
    });
  });

  describe("getAllEvents", () => {
    it("should retrieve all events", async () => {
      const events = [
        {
          id: "1",
          name: "Event 1",
          availableTickets: 50,
          creatorId: "creator1",
        },
        {
          id: "2",
          name: "Event 2",
          availableTickets: 75,
          creatorId: "creator2",
        },
      ];

      prisma.event = {
        findMany: jest.fn().mockResolvedValue(events),
      };

      const result = await eventRepository.getAllEvents();
      expect(prisma.event.findMany).toHaveBeenCalled();
      expect(result).toEqual(events);
    });
  });
});
