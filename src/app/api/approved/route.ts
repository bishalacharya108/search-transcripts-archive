import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  try {
    const result = await ApprovedController.getAllApproved();
    return NextResponse.json({
      success: true,
      data: result,
      message: "Successfully fetched all approved docs",
    }, {status: 200});
  } catch (error) {
    return NextResponse.json({
      success: true,
      message: error.message || "Failed to get all approved docs",
    }, {});
  }
}
