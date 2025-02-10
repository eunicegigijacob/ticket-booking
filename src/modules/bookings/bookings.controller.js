const bookingService = require("./bookings.service");

async function createBooking(req, res, next) {
  try {
    const bookingData = req.body;
    const result = await bookingService.createBooking(bookingData);
    // If the result is from adding to the waitlist, you may want to respond with a different code/message.
    // For simplicity, if the record has a status of "waitlisted", we return 200; otherwise, 201.
    if (result && result.status === "waitlisted") {
      return res.status(200).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    // The email mentioned POST for cancel booking, but PATCH is more RESTful.
    // Here we read bookingId from the request body.
    const { bookingId } = req.body;
    const result = await bookingService.cancelBooking(bookingId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

async function getBooking(req, res, next) {
  try {
    const { bookingId } = req.params;
    const result = await bookingService.getBooking(bookingId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
};
