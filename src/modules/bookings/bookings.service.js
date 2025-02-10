const bookingRepository = require("./bookings.repository");
const eventService = require("../events/events.service");
const Queue = require("bull");
const Redis = require("ioredis");


const bookingQueue = new Queue("bookingQueue", {
  createClient: function (type) {
    const options = {
      keepAlive: 1,
      pingInterval: 10000,
      enableReadyCheck: false,
      maxRetriesPerRequest: null,
    };

    switch (type) {
      case "client":
        return new Redis(process.env.REDIS_URL, options);
      case "subscriber":
        return new Redis(process.env.REDIS_URL, options);
      case "bclient":
        return new Redis(process.env.REDIS_URL, options);
      default:
        return new Redis(process.env.REDIS_URL, options);
    }
  },
});
async function getAvailableTickets(eventId) {
  const event = await eventService.getEvent(eventId);
  if (!event) throw new Error("Event not found");

  
  return event.availableTickets;
}

async function confirmBooking(bookingId) {
  const booking = await bookingRepository.getBookingById(bookingId);

  if (!booking) {
    throw new Error(`Booking record not found for id ${bookingId}`);
  }
  return booking;
}


async function createBooking(bookingData) {

  const availableTickets = await getAvailableTickets(bookingData.eventId);

  if(availableTickets > 0) {

  const pendingBooking = await bookingRepository.createBooking({
    ...bookingData,
  });

  await bookingQueue.add(
    { bookingId: pendingBooking.id },
    {
      attempts: 3,
      backoff: 5000,
      removeOnComplete: true,
    }
  );

  return {
    status: true,
    message: "Your booking request has been received and is being processed.",
    data: { booking: pendingBooking },
  };

  } else {
    const waitlistedRecord = await addToWaitlist(bookingData);
    return {
      status: false,
      message: "Sorry, we are out of tickets for this event. However, you have been added to the waitlist and will be notified of ticket availability.",
      data: { waitlist: waitlistedRecord },
    };
  }   

 }


async function processBooking({ bookingId }) {

  const booking = await confirmBooking(bookingId);

  const availableTickets = await getAvailableTickets(booking.eventId);

  if (availableTickets > 0) {
    await bookingRepository.updateBooking(bookingId, { status: "CONFIRMED" });
    console.log(`Booking with Id:${bookingId} has been confirmed.`);

    await eventService.decreaseEventTicketCount(booking.eventId);
    console.log('updating ticket count decrement')

    
  } else {
    const waitlistedRecord = await addToWaitlist({
      eventId: booking.eventId,
      userId: booking.userId,
    });
    await bookingRepository.updateBooking(bookingId, {
      status: "WAITLISTED",
      waitlistId: waitlistedRecord.id,
    });
    console.log(`Booking with Id:${bookingId} waitlisted.`);
  }
}


async function addToWaitlist(bookingData) {
  const { userId, eventId } = bookingData;
  const alreadyWaitlisted = await bookingRepository.getUserWaitList(
    userId,
    eventId
  );
  if (alreadyWaitlisted) {
    return alreadyWaitlisted;
  }
  return await bookingRepository.addToWaitlist(bookingData);
}

async function reprocessPendingBookings() {
  const pendingBookings = await bookingRepository.getBooking({
    status: "PENDING",
  }
  );

  if(pendingBookings.length > 0) {
    for (const booking of pendingBookings) {
      try {
        await bookingQueue.add(
          { bookingId: booking.id },
          {
            attempts: 3,
            backoff: 5000,
          }
        );
        console.log(`Re-enqueued pending booking ${booking.id}`);
      } catch (err) {
        console.error(
          `Failed to re-enqueue booking ${booking.id}: ${err.message}`
        );
      }
    }
  } else {
    console.log("No pending bookings to reprocess in the last 3min");
  }
  
}

async function getBooking(bookingId) {

  data =  await bookingRepository.getBookingById(bookingId);

  if(!data) {
    throw new Error(`Booking record not found for id ${bookingId}`);
  }

  return {
    status: true,
    message: "successfully retrieved booking",
    data: {
      ...data
    }
  }
}

async function getUserBookings(userId) {
 const userBookings = await bookingRepository.getBooking({ userId });

 return {
   status: true,
   message: "Bookings successfully retrieved",
   data: { userBookings },
 };
}

async function cancelBooking(bookingId, userId) {
  const booking = await confirmBooking(bookingId);

  if(userId !== booking.userId) {
    throw new Error(`You are not authorized to cancel this booking`);
  }

  if (booking.status === "CANCELLED") {
    throw new Error(`Booking with id ${bookingId} has already been cancelled`);
  }

if (booking.status === "CONFIRMED") {
  await bookingRepository.updateBooking(bookingId, {
    status: "CANCELLED",
  });

  await eventService.increaseEventTicketCount(booking.eventId);
   console.log("updating ticket count increment");

  // get the next waitlisted user
  const waitlist = await bookingRepository.getWaitlist(booking.eventId);

  if (waitlist.length > 0) {
    const nextWaitlisted = waitlist[0];
     const existingBooking = await bookingRepository.getBooking({
      eventId: booking.eventId,
      userId: nextWaitlisted.userId,
     })

    if (existingBooking.length > 0 ) {

      if (existingBooking.status !== "CONFIRMED") { 
    
       await bookingQueue.add(
         { bookingId: existingBooking[0].id },
         {
           attempts: 3,
           backoff: 5000,
           removeOnComplete: true,
         }
       );

      }
      await bookingRepository.removeFromWaitlist(nextWaitlisted.id);
    } else {
      await createBooking({
        eventId: booking.eventId,
        userId: nextWaitlisted.userId,
      })
    }
   

    
  }

  return {
    status: true,
    message: "Booking has been cancelled",
    data: {},
  };

}


  
}

module.exports = {
  createBooking,
  processBooking,
  reprocessPendingBookings,
  bookingQueue,
  getAvailableTickets,
  addToWaitlist,
  getBooking,
  getUserBookings,
  cancelBooking,
};
