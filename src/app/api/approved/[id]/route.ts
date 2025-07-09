//this is for approved transcription page api
import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await connectDB();
  try {
    const {data, initialTranscript} = await req.json();
    if (data.status !== "approved")
        throw new Error("Status not approved")

    //use a transaction here to create versions of the updated doc
    const session = await mongoose.startSession()
    try {
        const result = await ApprovedController.updateApprovedDoc(id, data);
        
    } catch (error) {
        
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidateTag("transcription");
    revalidateTag("dashboard");
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Successfully updated approved doc",
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: true,
        message: error.message || "Failed to update approved doc",
      },
      {},
    );
  }
}
