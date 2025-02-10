const express = require("express");
const router = express.Router();

const eventRoutes = require("../modules/events/events.routes");
const bookingRoutes = require("../modules/bookings/bookings.routes");
const authRoutes = require("../modules/auth/auth.routes");

router.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server up!" });
});

router.use("/event", eventRoutes);
router.use("/booking", bookingRoutes);
router.use("/auth", authRoutes);

module.exports = router;

