const express = require("express");
const router = express.Router();

const eventRoutes = require("../modules/events/event.routes");
const bookingRoutes = require("../modules/bookings/booking.routes");

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server up!" });
});

router.use("/event", eventRoutes);
router.use("/booking", bookingRoutes);

module.exports = router;

