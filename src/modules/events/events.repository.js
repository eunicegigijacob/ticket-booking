const prisma = require("../../prisma"); // Adjust the relative path as needed


async function createEvent(eventData) {
  return await prisma.event.create({
    data: eventData,
  });
}

async function getEvent(eventId) {
  return await prisma.event.findUnique({
    where: { id: eventId },
  });
}


async function getAllEvents() {
  return await prisma.event.findMany();
}

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
};
