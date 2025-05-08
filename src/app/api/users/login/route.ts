import bcryptjs from "bcryptjs";
import { User } from "./../../../../modules/users/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectDB from "@/config/db";
import jwt from "jsonwebtoken";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqData = await req.json();
    const { email, password } = reqData;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        {
          message: "User doesn't exists",
        },
        { status: 400 }
      );
    }

    // TODO: user verification is not handled properly yet !!!
    

    // checking if credentials are valid
    const validUser = bcryptjs.compare(password, user.password);
    if (!validUser) {
      return NextResponse.json(
        {
          message: "Check credentials",
        },
        { status: 400 }
      );
    }

    // jwt
    const tokenPayload = {
      id: user._id,
      userName: user.userName,
      email: user.email,
    };

    // token secret
    const secret = process.env.TOKEN_SECRET;
    if (!secret) {
      throw new Error("TOKEN_SECRET is not defined in environment variables");
    }

    const token = jwt.sign(tokenPayload, secret, {
      expiresIn: "1d",
    });

    const response = NextResponse.json({
      success: true,
      message: "user logged in successfully",
    });


    // response with cookies
    response.cookies.set("token", token, { httpOnly: true });
    return response;

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to Login",
        error,
      },
      { status: 500 }
    );
  }
}
