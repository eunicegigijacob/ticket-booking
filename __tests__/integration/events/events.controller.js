const eventService = require("../../../src/modules/events/events.service");
const {
  createEvent,
  getEvent,
  getAllEvents,
} = require("../../../src/modules/events/events.controller");

jest.mock("../../../src/events/events.service");

describe("Event Controller", () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  describe("createEvent", () => {
    it("should create an event and return 201 status", async () => {
      const eventData = {
        name: "Sample Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      };
      req.body = eventData;
      const createdEvent = { id: "eventId123", ...eventData };

      eventService.createEvent.mockResolvedValue(createdEvent);

      await createEvent(req, res, next);

      expect(eventService.createEvent).toHaveBeenCalledWith(eventData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdEvent);
    });
  });

  describe("getEvent", () => {
    it("should get an event by id and return 200 status", async () => {
      req.params.eventId = "eventId123";
      const event = {
        id: "eventId123",
        name: "Sample Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      };

      eventService.getEvent.mockResolvedValue(event);

      await getEvent(req, res, next);

      expect(eventService.getEvent).toHaveBeenCalledWith("eventId123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(event);
    });
  });

  describe("getAllEvents", () => {
    it("should return all events with 200 status", async () => {
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

      eventService.getAllEvents.mockResolvedValue(events);

      await getAllEvents(req, res, next);

      expect(eventService.getAllEvents).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(events);
    });
  });
});
