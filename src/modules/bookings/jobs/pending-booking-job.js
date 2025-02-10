const { reprocessPendingBookings } = require("../bookings.service");

const TIME = 3 * 60 * 1000; 

function startPendingReprocessor() {
  setInterval(async () => {
    console.log("Running pending bookings reprocessor...");
    try {
      await reprocessPendingBookings();
    } catch (error) {
      console.error("Error reprocessing pending bookings:", error);
    }
  }, TIME);
}

startPendingReprocessor();
