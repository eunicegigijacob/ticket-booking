const bookingRepository = require("./bookings.repository");

async function createBooking(bookingData) {
  // Check how many tickets are available for this event
  const availableTickets = await bookingRepository.getAvailableTickets(
    bookingData.eventId
  );

  if (availableTickets > 0) {
    // Tickets available, so create the booking
    return await bookingRepository.createBooking(bookingData);
  } else {
    // No tickets available – add the user to the waitlist
    return await addToWaitlist(bookingData);
  }
}

async function addToWaitlist(bookingData) {
  // Additional logic can be added here if needed (e.g., preventing duplicate waitlist entries)
  return await bookingRepository.addToWaitlist(bookingData);
}

async function cancelBooking(bookingId) {
  // First, retrieve the booking so we know its eventId
  const booking = await bookingRepository.getBooking(bookingId);
  if (!booking) {
    throw new Error("Booking not found");
  }

  // Cancel the booking
  const cancelledBooking = await bookingRepository.cancelBooking(bookingId);

  // Check if there are users on the waitlist for this event
  const waitlist = await bookingRepository.getWaitlist(booking.eventId);
  if (waitlist && waitlist.length > 0) {
    // Get the first person in the waitlist
    const nextInLine = waitlist[0];
    // Remove them from the waitlist
    await bookingRepository.removeFromWaitlist(nextInLine.id);
    // Create a booking for this waitlisted user
    const newBooking = await bookingRepository.createBooking({
      userId: nextInLine.userId,
      eventId: booking.eventId,
      // Optionally, add additional fields if needed
    });
    // Return an object containing both the cancelled booking and the new booking assignment
    return { cancelledBooking, newBooking };
  }

  // If no one was waiting, simply return the cancelled booking info
  return cancelledBooking;
}

async function getBooking(bookingId) {
  return await bookingRepository.getBooking(bookingId);
}

module.exports = {
  createBooking,
  addToWaitlist,
  cancelBooking,
  getBooking,
};
