const prisma = require("../../prisma");

async function createBooking(bookingData) {
  return await prisma.booking.create({
    data: bookingData,
  });
}

async function cancelBooking(bookingId) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "cancelled" },
  });
}

async function getBooking(bookingId) {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
  });
}

async function getAvailableTickets(eventId) {
  const event = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!event) throw new Error("Event not found");

 
  const bookingsCount = await prisma.booking.count({
    where: {
      eventId,
      status: { not: "cancelled" },
    },
  });

  return event.totalTickets - bookingsCount;
}

async function addToWaitlist(waitlistData) {

  return await prisma.waitingList.create({
    data: {
      ...waitlistData,
      status: "waitlisted",
    },
  });
}

async function getWaitlist(eventId) {
  return await prisma.waitingList.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
  });
}

async function removeFromWaitlist(waitlistId) {
  return await prisma.waitingList.delete({
    where: { id: waitlistId },
  });
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
  getAvailableTickets,
  addToWaitlist,
  getWaitlist,
  removeFromWaitlist,
};
