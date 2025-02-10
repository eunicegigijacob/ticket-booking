const { bookingQueue, processBooking } = require("../bookings.service");

bookingQueue.process(async (job) => {
  try {
    await processBooking(job.data);
    return Promise.resolve();
  } catch (error) {
    console.error(`Error processing job ${job.id}:`, error);
    return Promise.reject(error);
  }
});

