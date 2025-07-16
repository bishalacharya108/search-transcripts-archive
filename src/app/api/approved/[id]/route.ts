//this is for approved transcription page api
//TODO: very bad code here, need of upgrade
import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { Version } from "@/modules/versions/version.model";
import { VersionController } from "@/modules/versions/version.controller";
import { TVersion } from "@/modules/versions/version.interface";

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
    const { data, initialTranscript } = await req.json();
    if (data.status !== "approved") throw new Error("Status not approved");
    const oldVersion: Partial<TVersion> = {
      originId: new mongoose.Types.ObjectId(id),
      doc: initialTranscript,
    };
    // this way to do it sucks
    // TODO: add version numbers and users also maybe I don't need to put everything in the versions
    //TODO: use a transaction here to create versions of the updated doc
    const mongooseSession = await mongoose.startSession();
    try {
      mongooseSession.startTransaction();
      const result = await ApprovedController.updateApprovedDoc(id, data, {
        session: mongooseSession,
      });
      const version = await VersionController.createAVersion(oldVersion, {
        session: mongooseSession,
      });
      await mongooseSession.commitTransaction();

      if (!result || !version) {
        throw new Error("Operation validation failed");
      }
    } catch (error) {
      mongooseSession.abortTransaction();
      throw new Error("Error updating approved transcripts");
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
        success: false,
        message: error.message || "Failed to update approved doc",
      },
      {},
    );
  }
}
