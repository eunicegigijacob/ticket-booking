const bookingService = require("./bookings.service");

const {createBookingSchema} = require('./schemas/create-booking.schema')
const userService = require('../user/user.service')

async function createBooking(req, res, next) {

  try {

    const {firstName, lastName, phone, email, eventId} = createBookingSchema.parse(req.body);

    let user;
    user = await userService.findUserByEmail(email);



    if(!user) {
      user = await userService.createGuestUser({
        firstName,
        lastName,
        email,
        phone
      });   
    }
  
    const result = await bookingService.createBooking({ 
      eventId,
      userId: user.id
    });

    console.log('this is result', result);

    if (result && result.status === false) {
      return res.status(200).json(result);
    }
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { bookingId } = req.body;
    const userId = req.user.id; 
  
    const result = await bookingService.cancelBooking(bookingId, userId);
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

async function getAllBookings(req, res, next) {
  try {
   const userId = req.user.id
    const result = await bookingService.getUserBookings(userId);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createBooking,
  cancelBooking,
  getBooking,
  getAllBookings,
};
