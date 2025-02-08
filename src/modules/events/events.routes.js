const express = require("express");
const {
  createEvent,
  getEvent,
  getAllEvents
} = require("./events.controller");
const router = express.Router();


router.post("/", getAllEvents);
router.post("/initialize", createEvent);
router.get("/status/:eventId", getEvent);

module.exports = router;
