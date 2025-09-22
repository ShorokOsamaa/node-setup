import nodemailer from "nodemailer";
import Env from "../config/env.config.js";
import HttpError from "./error.util.js";
import { HttpStatus } from "../types/error.type.js";

const { SENDER_EMAIL, SENDER_PASSWORD, EMAIL_HOST, EMAIL_PORT, EMAIL_CC } = Env;

export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    auth: { user: SENDER_EMAIL, pass: SENDER_PASSWORD },
  });

  const mailOptions = {
    from: SENDER_EMAIL,
    to,
    cc: EMAIL_CC,
    subject,
    text, // plain text body
    html, // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new HttpError(
      HttpStatus.INTERNAL_SERVER_ERROR,
      "Error sending email"
    );
  }
};

export const sendResetPasswordEmail = async (
  to: string,
  otp: string
): Promise<void> => {
  const subject = "Password Reset OTP";
  const text = `Your OTP for password reset is: ${otp}. It is valid for 10 minutes.`;
  const html = `<p>Your OTP for password reset is: <b>${otp}</b>. It is valid for 10 minutes.</p>`;
  await sendEmail(to, subject, text, html);
};
