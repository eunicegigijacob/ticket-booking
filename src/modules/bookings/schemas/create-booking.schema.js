const { z } = require("zod");

const createBookingSchema = z.object({
  firstName: z.string().min(1, { message: "firstName is required" }),
  lastName: z.string().min(1, { message: "lastName is required" }),
  email: z.string().email({ message: "email is required" }),
  phone: z.string().min(10, { message: "phone is required" }),
  eventId: z.string().min(6,{ message: "eventId is required" }),
});

module.exports = {
    createBookingSchema
};