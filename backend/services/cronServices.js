import cron from "node-cron";
import Interview from "../models/Interview.js";
import Notification from "../models/Notification.js";
import { sendInterviewReminderEmail } from "./emailService.js";

// Runs every hour
cron.schedule("0 * * * *", async () => {
  try {

    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find interviews happening within the next 24 hours
    const interviews = await Interview.find({
      interview_date: {
        $gte: now,
        $lte: next24Hours,
      },
      reminder_sent: false,
    }).populate({
      path: "application_id",
      populate: [
        { path: "user_id", select: "fullName email" },
        { path: "company_id", select: "name" },
      ],
    });

    for (const interview of interviews) {
      const application = interview.application_id;

      if (!application || !application.user_id) {
        console.warn(`⚠️ Skipping interview ${interview._id} — missing application or user`);
        continue;
      }

      const user = application.user_id;
      const companyName =
        application.company_id?.name ??
        application.requested_company?.name ??
        "the company";
      const roundLabel =
        interview.round_type === "Other"
          ? interview.custom_round_name
          : interview.round_type;

      // Create in-app notification
      await Notification.create({
        user_id: user._id,
        type: "interview_reminder",
        title: "Interview Reminder",
        message: `Reminder: Your ${roundLabel} interview at ${companyName} is scheduled on ${new Date(
          interview.interview_date
        ).toLocaleString()}.`,
        interview_id: interview._id,
        application_id: application._id,
      });

      // Send email reminder
      try {
        await sendInterviewReminderEmail(
          user.email,
          companyName,
          roundLabel,
          interview.interview_date
        );
      } catch (emailErr) {
        // Don't mark reminder_sent if email failed — retry next hour
        continue;
      }

      // Mark reminder as sent only after successful email
      interview.reminder_sent = true;
      await interview.save();

    }
  } catch (error) {
    console.error("❌ Cron Job Error:", error);
  }
});