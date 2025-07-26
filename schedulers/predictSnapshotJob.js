// Schedule job: every day at 2:00 AM
const updateSnapShot = require("./updateSnapShot");
cron.schedule("0 2 * * *", async () => {
  console.log("⏰ Running snapshot prediction at 2AM");
  updateSnapShot();

  try {
  } catch (error) {
    console.error("❌ Snapshot failed:", error);
  }
});
