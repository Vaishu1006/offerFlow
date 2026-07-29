// services/emailService.js
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendInterviewReminderEmail = async (
  userEmail,
  companyName,
  roundType,
  interviewDate
) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: "Interview Reminder - offerFlow",
    html: `
      <h2>Interview Reminder</h2>
      <p>Hello,</p>
      <p>This is a reminder that your interview is scheduled within the next 24 hours.</p>
      <ul>
        <li><strong>Company:</strong> ${companyName}</li>
        <li><strong>Round:</strong> ${roundType}</li>
        <li><strong>Date & Time:</strong> ${new Date(interviewDate).toLocaleString()}</li>
      </ul>
      <p>Best of luck for your interview! 🚀</p>
      <br/>
      <p>Regards,<br/>offerFlow Team</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};