const eventRepository = require("./events.repository");


async function createEvent(eventData) {
  return await eventRepository.createEvent(eventData);
}

async function getEvent(eventId) {
  return await eventRepository.getEvent(eventId);
}

async function getAllEvents() {
  return await eventRepository.getAllEvents();
}

async function decreaseEventTicketCount(eventId) {
  return await eventRepository.decreaseEventTicketCount(eventId);
}

async function increaseEventTicketCount(eventId) {
  return await eventRepository.increaseEventTicketCount(eventId);
}

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
  increaseEventTicketCount,
  decreaseEventTicketCount
};
