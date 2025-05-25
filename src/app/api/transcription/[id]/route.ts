import connectDB from "@/config/db";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";

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
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please sign in.",
      },
      { status: 401 },
    );
  }
  await connectDB();
  try {
    const body = await req.json();

    const updated = await TranscriptControllers.updateATranscript(id, body);

    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Transcript not found or update failed" },
        { status: 404 },
      );
    }

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
  const session = await getServerSession(authOptions);
  //  we should probably check the role of the user here, because admins and verified users can upload only
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please sign in.",
      },
      { status: 401 },
    );
  }
  // console.log("Session in POST:", session.user.role);
  console.log("Session in delete", session)
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
