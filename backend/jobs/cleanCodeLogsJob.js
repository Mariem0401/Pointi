const cron = require('node-cron'); // <--- node-cron needs to be imported at the top
const CodeLog = require('../Model/CodeLog'); // Make sure to import your CodeLog model

module.exports = {
  start: () => {
    // Schedule the job to run once a day at 2 AM (Tunis time, if server's timezone is Europe/Paris)
    // '0 2 * * *' means: At 0 minutes past 2 o'clock every day.
    cron.schedule('0 2 * * *', async () => {
      console.log('Starting CodeLog cleanup job...'); // Using console.log instead of logger.info
      try {
        // Define the retention period (e.g., keep logs for 90 days)
        const retentionDays = 90;
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - retentionDays); // Calculate 90 days ago

        // Delete CodeLog documents older than the cutoffDate
        const result = await CodeLog.deleteMany({
          createdAt: { $lt: cutoffDate } // Assuming your CodeLog model has a 'createdAt' timestamp
        });

        console.log(`CodeLog cleanup job completed: ${result.deletedCount} old logs removed.`); // Using console.log
      } catch (error) {
        console.error('Error during CodeLog cleanup job:', error); // Using console.error
      }
    }, {
      scheduled: true,
      timezone: "Europe/Paris" // Ensure your timezone is consistent for cron scheduling
    });
  }
};