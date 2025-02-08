const request = require("supertest");
const express = require("express");
const eventsRoutes = require("../../../src/modules/events/events.routes");

jest.mock("../../../src/modules/events/events.controller", () => ({
  createEvent: (req, res) => res.status(201).json({ message: "Event created" }),
  getEvent: (req, res) => res.status(200).json({ message: "Event fetched" }),
  getAllEvents: (req, res) => res.status(200).json({ message: "All events" }),
}));

describe("Events Routes", () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use("/api/events", eventsRoutes);
  });

  it("should allow public access to getAllEvents (POST '/') without authentication", async () => {
    const res = await request(app).post("/api/events");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "All events" });
  });

  it("should reject access to createEvent (POST '/initialize') without authentication", async () => {
    const res = await request(app).post("/api/events/initialize").send({
      name: "New Event",
      availableTickets: 100,
      creatorId: "creatorId123",
    });
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("should allow access to createEvent (POST '/initialize') with authentication", async () => {
    const res = await request(app)
      .post("/api/events/initialize")
      .set("Authorization", "Bearer validtoken")
      .send({
        name: "New Event",
        availableTickets: 100,
        creatorId: "creatorId123",
      });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Event created" });
  });

  it("should reject access to getEvent (GET '/status/:eventId') without authentication", async () => {
    const res = await request(app).get("/api/events/status/eventId123");
    expect(res.status).toBe(401);
    expect(res.body).toEqual({ error: "Unauthorized" });
  });

  it("should allow access to getEvent (GET '/status/:eventId') with authentication", async () => {
    const res = await request(app)
      .get("/api/events/status/eventId123")
      .set("Authorization", "Bearer validtoken");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Event fetched" });
  });
});
