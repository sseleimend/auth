import { connect } from "@/configs/db";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    const user = await User.findOne({ email });
    if (user) {
      return NextResponse.json(
        { error: "User already exists" },
        {
          status: 400,
        }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();

    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      {
        message: "User created successfully",
        savedUser,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : error,
      },
      {
        status: 500,
      }
    );
  }
}
