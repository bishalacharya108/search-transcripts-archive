import connectDB from "@/config/db";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { Transcript } from "@/modules/transcription/transcriptions.model";
import { getToken } from "next-auth/jwt";
import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";

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
  //  we should probably check the role of the user here, because only admins and verified users can upload
  await connectDB();
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  try {
    const body = await req.json();
    // non admins cannot change the status to approved
    if (token?.role !== "admin" && body.status === "approved") {
      return NextResponse.json(
        { success: false, message: "Unauthorized status change" },
        { status: 403 },
      );
    }
    //TODO: only update the original if it is not approved
    // NOTE: this update does take into account the recent approved doc page update system
    const updated = await TranscriptControllers.updateATranscript(id, body);
    if (!updated) {
      return NextResponse.json(
        { success: false, message: "Transcript not found or update failed" },
        { status: 404 },
      );
    }

    // TODO: this is a very inefficient way to do this but still
    // A transaction session for inserting transactions in approved collection
    const mongooseSession = await mongoose.startSession();
    if (body.status === "approved") {
      try {
        // TODO: finding a better way to do transactions, especially using separate modules if possible
        mongooseSession.startTransaction();
        const doc = await Transcript.findById(id)
          .session(mongooseSession)
          .lean();
        const { _id, ...docWithoutId } = doc;

        const approvedDoc = new ApprovedTranscript({
          ...docWithoutId,
          approvedBy: new mongoose.Types.ObjectId(token?._id),
          approvedAt: new Date(),
        });
        //TODO: should validations first before insert perhaps using some middleware
        await approvedDoc.save({ session: mongooseSession });
        await Transcript.findByIdAndDelete(id).session(mongooseSession);
        await mongooseSession.commitTransaction();
      } catch (error) {
        await mongooseSession.abortTransaction();
        throw error;
      }
    }

    // TODO: this should be done in a better way
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
    return NextResponse.json(
      { success: false, message: "Error deleting transcript", error },
      { status: 500 },
    );
  }
}
