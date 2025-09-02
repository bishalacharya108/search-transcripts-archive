//this is for approved transcription page api
//TODO: very bad code here, need of upgrade
import connectDB from "@/config/db";
import { ApprovedController } from "@/modules/approvedTranscript/approved.controllers";
import { NextRequest, NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import mongoose from "mongoose";
import { VersionController } from "@/modules/versions/version.controller";
import { TVersion } from "@/modules/versions/version.interface";
import { getToken } from "next-auth/jwt";

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
  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req, secret });
  if (!token || !token._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }
  await connectDB();
  try {
    const { data } = await req.json();
    if (data.status !== "approved") {
      return NextResponse.json(
        { success: false, message: "Status must be 'approved'" },
        { status: 400 }
      );
    }
    //TODO: Make versioning a middleware
    // this way to do transactions sucks
    // probably doesn't work
    // TODO: I don't need to put everything in the versions
    const mongooseSession = await mongoose.startSession();
    let result;
    try {
      mongooseSession.startTransaction();
      const initial = await ApprovedController.getAnApproved(id);
      if(!initial) throw new Error("Document not found");
      const oldVersion: Partial<TVersion> = {
        originId: new mongoose.Types.ObjectId(id),
        doc: initial,
        updatedBy: new mongoose.Types.ObjectId(token?._id),
      };
      result = await ApprovedController.updateApprovedDoc(
        id,
        {
          $set: data,
          $inc: { version: 1 },
        },
        {
          session: mongooseSession,
        },
      );
      if(!result) throw new Error("Error updating document");
      const version = await VersionController.createAVersion(oldVersion, {
        session: mongooseSession,
      });
      await mongooseSession.commitTransaction();

      if (!version) {
        throw new Error("Failed to save old version of the document");
      }
    } catch (error) {
      await mongooseSession.abortTransaction();
      throw new Error("Error updating approved transcripts");
    }finally{
        await mongooseSession.endSession();
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
