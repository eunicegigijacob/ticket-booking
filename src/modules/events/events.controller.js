const { user } = require("../../prisma");
const eventService = require("./events.service");

const { addEventSchema } = require("./schemas/add-event.schema");


async function createEvent(req, res, next) {

  const { name, availableTickets } = addEventSchema.parse(req.body);

  console.log('this is the user id', req.user.id)

  try {
    const eventData = {
      name,
      availableTickets,
      creatorId: req.user.id
    };
    const createdEvent = await eventService.createEvent(eventData);
    return res.status(201).json({
      status: true,
      message: "Event created successfully",
      data: {
        createdEvent,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function getEvent(req, res, next) {
  try {
    const eventId = req.params.eventId;
    const event = await eventService.getEvent(eventId);
    return res.status(200).json({
      status: true,
      message: "Event retrieved successfully",
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
}


async function getAllEvents(req, res, next) {
  try {
    const events = await eventService.getAllEvents();

    
    return res.status(200).json({
      status: true,
      message: "Events retrieved successfully",
      data: {
       events,
      },
    });
    
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
};
