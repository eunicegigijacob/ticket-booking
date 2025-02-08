const eventService = require(".../../../src/modules/events/events.service");
const eventRepository = require("../../../src/modules/events/events.repository");

jest.mock("../../../src/modules/events/events.repository");

describe("Event Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createEvent", () => {
    it("should create an event if valid event data is provided", async () => {
      const eventData = {
        name: "Sample Event",
        availableTickets: 100, 
        creatorId: "creatorId123",
      };

      const createdEvent = { id: "eventId123", ...eventData };

      eventRepository.createEvent.mockResolvedValue(createdEvent);

      const result = await eventService.createEvent(eventData);

      expect(eventRepository.createEvent).toHaveBeenCalledWith(eventData);
      expect(result).toEqual(createdEvent);
    });
  });

  describe("getEvent", () => {
    it("should return an event by its id", async () => {
      const eventId = "eventId123";
      const event = {
        id: eventId,
        name: "Sample Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      };

      eventRepository.getEvent.mockResolvedValue(event);

      const result = await eventService.getEvent(eventId);

      expect(eventRepository.getEvent).toHaveBeenCalledWith(eventId);
      expect(result).toEqual(event);
    });
  });

  describe("getAllEvents", () => {
    it("should return all events", async () => {
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

      eventRepository.getAllEvents.mockResolvedValue(events);

      const result = await eventService.getAllEvents();

      expect(eventRepository.getAllEvents).toHaveBeenCalled();
      expect(result).toEqual(events);
    });
  });
});
