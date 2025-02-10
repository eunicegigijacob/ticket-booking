require("dotenv").config();
const app = require("./app");

const PORT = process.env.PORT || 3000;


require("./modules/bookings/jobs/pending-booking-job");

require("./modules/bookings/queues/booking-queue.worker");

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
