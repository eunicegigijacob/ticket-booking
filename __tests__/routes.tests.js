const request = require("supertest");
const app = require("../src/app"); 

describe("GET /health", () => {
  it("should check that the server is up", async () => {
    const response = await request(app).get("/health");
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe("Server up!");
  });
});

// describe("POST /book", () => {
//   it("should enqueue a booking request and return confirmation", async () => {
//     const response = await request(app)
//       .post("/book")
//       .send({ userId: 1, eventId: 1 });
//     expect(response.statusCode).toBe(200);
//     expect(response.body.message).toBe("Booking request received");
//   });
// });


