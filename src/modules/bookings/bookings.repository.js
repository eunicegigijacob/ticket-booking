const prisma = require("../../prisma");
const redisService = require("../../redis/redis.service");

async function createBooking(bookingData) {
  return await prisma.booking.create({
    data: bookingData,
  });
}

async function cancelBooking(bookingId) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "CANCELLED" },
  });
}

async function getBooking(bookingId) {
  return await prisma.booking.findUnique({
    where: { id: bookingId },
  });
}


async function getTotalEventBooking(eventId) {
  return await prisma.booking.count({
    where: {
      eventId,
      status: { equals: "CONFIRMED" },
    },
  });
  
}

async function getBookingByStatus(status) {
  return await prisma.booking.findMany({
    where: { status },
  });
}


// waitlist 
//Todo: move waitlist to separate module

async function addToWaitlist(waitlistData) {

  const waitlistKey = `waitlist:${waitlistData.eventId}`;
  await redisService.set({
    key: waitlistKey,
    ttl: Date.now(),
    value: waitlistData.userId,
  });

  return await prisma.waitlist.create({
    data: {
      ...waitlistData,
    },
  });
}

async function getWaitlist(eventId) {
  return await prisma.waitlist.findMany({
    where: { eventId },
    orderBy: { createdAt: "asc" },
  });
}

async function removeFromWaitlist(waitlistId) {
  return await prisma.waitlist.delete({
    where: { id: waitlistId },
  });
}

async function getUserWaitList(userId, eventId) {
  return await prisma.waitlist.findFirst({
    where: {
      eventId,
      userId,
    },
  });
}

async function updateBooking(bookingId, data) {
  return await prisma.booking.update({
    where: { id: bookingId },
    data,
  });
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
  addToWaitlist,
  getWaitlist,
  removeFromWaitlist,
  getTotalEventBooking,
  getUserWaitList,
  getBookingByStatus,
  updateBooking,
};
