const express = require("express");
const {
  createBooking,
  cancelBooking,
  getBooking,
  getAllBookings
} = require("./bookings.controller");
const { authMiddleware } = require("../../middleware/auth.middleware");
const router = express.Router();


router.get("/", authMiddleware, getAllBookings);
router.get("/status/:bookingId", getBooking);
router.post("/book", createBooking);
router.patch("/cancel", authMiddleware, cancelBooking);


module.exports = router;
