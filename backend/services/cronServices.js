import cron from "node-cron";
import Interview from "../models/Interview.js";
import Notification from "../models/Notification.js";

// Runs every hour
cron.schedule("0 * * * *", async () => {
  try {
    console.log("⏰ Running Interview Reminder Cron...");

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find interviews happening within the next 24 hours
    const interviews = await Interview.find({
      interview_date: {
        $gte: now,
        $lte: next24Hours,
      },
      reminder_sent: false,
    }).populate("application_id");

    for (const interview of interviews) {
      await Notification.create({
        user_id: interview.application_id.user_id,
        type: "interview_reminder",
        title: "Interview Reminder",
        message: `Reminder: Your ${interview.round_type} interview is scheduled on ${new Date(
          interview.interview_date
        ).toLocaleString()}.`,
        interview_id: interview._id,
        application_id: interview.application_id._id,
      });

      // Mark reminder as sent
      interview.reminder_sent = true;
      await interview.save();

      console.log(
        `✅ Reminder notification created for Interview ${interview._id}`
      );
    }
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
  }
});