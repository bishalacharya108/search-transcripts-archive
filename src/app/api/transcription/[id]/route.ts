import connectDB from "@/config/db";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { ApprovedTranscript } from "@/modules/transcription/transcriptions.model";
import { getToken } from "next-auth/jwt";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  await connectDB();
  const session = getServerSession();
  try {
    // getting the transcript through services... here I realised I can directly call the service methods instead of controllers
    const data = await TranscriptServices.getATranscriptionFromDB(id);

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message: "Transcript not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Transcript Found!",
        data: data,
      },
      { status: 200 },
    );
  } catch (error) {
    // console.error(`[GET /api/transcription/${id}]`, error);
    return NextResponse.json(
      {
        success: false,
        message: "Error getting transcript",
        error: error,
      },
      { status: 500 },
    );
  }
}

// update a single transcript based on id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = await params;
  //  we should probably check the role of the user here, because admins and verified users can upload only
  await connectDB();
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  // const session = await getServerSession(authOptions);
  try {
    const body = await req.json();
    const updated = await TranscriptControllers.updateATranscript(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Transcript not found or update failed" },
        { status: 404 },
      );
    }

    if (updated.status === "approved" && token?.role === "admin") {
      const mongooseSession = await mongoose.startSession();
      try {
        mongooseSession.startTransaction();
        // this is a temporary solution, should have a separate module system for this because the update should have the approved admin's userId
        const doc = await TranscriptControllers.getATranscript(id);
        const result = await ApprovedTranscript.insertOne(doc);
        console.log(result);
        await mongooseSession.commitTransaction();
        console.log("Transaction committed");
      } catch (error) {
        await mongooseSession.abortTransaction();
        console.error("Transaction aborted:", error);
      } finally {
        await mongooseSession.endSession();
      }
    }

    revalidatePath("/dashboard");
    revalidatePath("/");
    revalidatePath("/admin");
    revalidateTag("transcription");
    revalidateTag("dashboard");
    return NextResponse.json(
      {
        success: true,
        message: "Transcript updated successfully",
        data: updated,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[PATCH /api/transcription/${id}]`, error);
    return NextResponse.json(
      { success: false, message: "Error updating transcript", error },
      { status: 500 },
    );
  }
}

// update a transcript based on id
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  const session = await getServerSession(authOptions);
  //  we should probably check the role of the user here, because admins and verified users can upload only
  if (token?.role != "admin") {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please sign in.",
      },
      { status: 401 },
    );
  }
  console.log("Session in delete", session);
  await connectDB();
  try {
    const deleted = await TranscriptServices.deleteTranscriptionFromDB(
      params.id,
    );

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          message: "Transcript not found or could not be deleted",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Transcript deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`[DELETE /api/transcription/${params.id}]`, error);
    return NextResponse.json(
      { success: false, message: "Error deleting transcript", error },
      { status: 500 },
    );
  }
}
