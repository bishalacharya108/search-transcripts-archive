
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import connectDB from "@/config/db";


connectDB();

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });

    // accessing cookies directly and removing them before logout
    response.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });

    return response;
  } catch (error) {
    return NextResponse.json(
        {
          success: false,
          message: "Logout failed!",
          error,
        },
        { status: 500 }
      );
  }
}
