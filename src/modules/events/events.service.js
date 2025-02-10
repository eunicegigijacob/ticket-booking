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

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
};
