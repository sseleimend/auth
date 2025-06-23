import nodemailer from "nodemailer";
import User from "@/models/User.model";
import bcrypt from "bcryptjs";

export const sendMail = async ({
  email,
  emailType,
  userId,
}: {
  email: string;
  emailType: "VERIFY" | "RESET";
  userId: string;
}) => {
  try {
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(
        userId,
        {
          verifyToken: hashedToken,
          verifyTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(
        userId,
        {
          forgotPasswordToken: hashedToken,
          forgotPasswordTokenExpiry: Date.now() + 3600000,
        },
        { new: true, runValidators: true }
      );
    }

    // Looking to send emails in production? Check out our Email API/SMTP product!
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.TRANSPORTER_USER!,
        pass: process.env.TRANSPORTER_PASS!,
      },
    });

    const mailOptions = {
      from: "verify@auth.com",
      to: email,
      subject: "Verify your email",
      html: `<p>Click <a href="${process.env
        .DOMAIN!}/verifyemail?token=${hashedToken}">here</a> to verify your email</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
};
