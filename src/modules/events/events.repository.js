const prisma = require("../../prisma"); // Adjust the relative path as needed


async function createEvent(eventData) {
  return await prisma.event.create({
    data: eventData,
  });
}

async function getEvent(eventId) {
  return await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      Waitlist: true,
      bookings: true
    }
  });
}


async function getAllEvents() {
  return await prisma.event.findMany();
}

async function decreaseEventTicketCount(eventId) {
  return await prisma.event.update({
    where: { id: eventId },
    data: {
      availableTickets: {
        decrement: 1,
      },
    },
  });
}

async function increaseEventTicketCount(eventId) {
  return await prisma.event.update({
    where: { id: eventId },
    data: {
      availableTickets: {
        increment: 1,
      },
    },
  });
}

module.exports = {
  createEvent,
  getEvent,
  getAllEvents,
 decreaseEventTicketCount,
 increaseEventTicketCount
};
