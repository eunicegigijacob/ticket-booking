const express = require("express");
const {
  createBooking,
  cancelBooking,
  getBooking,
} = require("./bookings.controller");
const router = express.Router();


router.post("/book", createBooking);
router.patch("/book", cancelBooking);
router.get("/status/:bookingId", getBooking);

module.exports = router;
