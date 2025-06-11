import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;
  await connectDB();
  try {
    const result = await ApprovedController.getAnApproved(id);
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Successfully expanded approved doc",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: error.message || "Failed to get expanded approved doc",
      },
      {},
    );
  }
}
