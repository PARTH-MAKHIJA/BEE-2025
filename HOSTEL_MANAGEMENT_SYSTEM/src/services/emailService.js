// src/services/emailService.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject,
      html: `<p>${message}</p>`,
    });

    console.log("Email sent to:", email);
  } catch (err) {
    console.error("Email error:", err.message);
  }
};
