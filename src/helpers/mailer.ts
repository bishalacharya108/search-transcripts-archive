import { User } from "./../modules/users/user.model";
import { v4 as uuidv4 } from "uuid";
// not used in verfication yet

import nodemailer from "nodemailer";

type SendEmailParams = {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
};

export const sendEmail = async ({
  email,
  emailType,
  userId,
}: SendEmailParams) => {
  try {
    // TODO: configure mail for usage

    // links
    const baseUrl = process.env.DOMAIN;
    if (!baseUrl) throw new Error("Missing DOMAIN in environment variables");
    else console.log(baseUrl);

    const verificationLink = `${baseUrl}/verify`;
    const resetPassLink = `${baseUrl}/resetpassword`;
    const generatedId = uuidv4();
    
    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: generatedId,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: generatedId,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      auth: {
        user: "api",
        pass: "ce2346d81c4a3b3c0ba9826a3cd56898"
      }
    });

    const actionUrl = `${emailType === "VERIFY" ? verificationLink : resetPassLink}?token=${generatedId}&id=${userId}`;


    const mailOptions = {
      from: 'info@demomailtrap.co',
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify Your Email" : "Reset your password",
      text: "Hello world?", 

      html: `<p>Please <a href="${actionUrl}">${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      }</a> within 1 hour.</p>`, 
    };
    const mailResponse = await transporter.sendMail(mailOptions);
    if (process.env.NODE_ENV === "development") {
      console.log("Preview URL:", nodemailer.getTestMessageUrl(mailResponse));
    }
    console.log(mailResponse);
    return mailResponse;
  } catch (error: any) {
    console.error("Error occurred while sending email:", error); 
  throw new Error(error?.message || "Failed to send email");

  }
};
