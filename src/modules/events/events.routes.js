const express = require("express");
const {
  createEvent,
  getEvent,
  getAllEvents
} = require("./events.controller");
const {authMiddleware} = require("../../middleware/auth.middleware");
const router = express.Router();


router.get("/", getAllEvents);
router.post("/initialize", authMiddleware, createEvent);
router.get("/status/:eventId", authMiddleware, getEvent);

module.exports = router;
