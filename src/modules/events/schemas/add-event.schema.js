const { z } = require("zod");

const addEventSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),

  availableTickets: z.number().int().min(1, {message: "the number of available tickets is required and must be greater than 1"}),
  
});

module.exports = {
    addEventSchema
};