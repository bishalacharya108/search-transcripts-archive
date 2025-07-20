import { User } from "./../../../../modules/users/user.model";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectDB from "@/config/db";

connectDB();

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { token } = reqBody;

    const user = await User.findOne(
      { verifyToken: token },
      { verifyTokenExpiry: { $gt: Date.now() } }
    );

    //if user doesn't exist
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid Token",
        },
        { status: 400 }
      );
    }


    // need to structure this better in a different file such as services
    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    await user.save();

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Unable to Verify",
        error,
      },
      { status: 500 }
    );
  }
}
