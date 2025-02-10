const eventRepository = require("./events.repository");

/**
 * Creates an event by delegating to the repository.
 * @param {Object} eventData - The event data (name, availableTickets, creatorId).
 * @returns {Promise<Object>} The created event.
 */
async function createEvent(eventData) {
  // (Optional) Business logic, validations, etc. could be added here.
  return await eventRepository.createEvent(eventData);
}

/**
 * Retrieves an event by its id.
 * @param {String} eventId - The id of the event.
 * @returns {Promise<Object|null>} The event if found.
 */
async function getEvent(eventId) {
  return await eventRepository.getEvent(eventId);
}

/**
 * Retrieves all events.
 * @returns {Promise<Array>} Array of events.
 */
async function getAllEvents() {
  return await eventRepository.getAllEvents();
}

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
};
