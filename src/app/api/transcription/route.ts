import { TranscriptValidationSchema } from "./../../../modules/transcription/transcriptions.validation";
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/config/db";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest) {
  //  we should probably check the role of the user here, because admins and verified users can upload only
  // if (!session) {
  //   return NextResponse.json(
  //     {
  //       success: false,
  //       message: "Unauthorized. Please sign in.",
  //     },
  //     { status: 401 }
  //   );
  // }

  await connectDB().then(() => console.log("DB connecition Completed"));

  try {
    const data = await req.json();
    const validatedData = TranscriptValidationSchema.parse(data);

    // getting data using controllers. still undecided on whether to use controllers in cases like these
    // probably will delete controllers later and directly call from services
    const result = await TranscriptControllers.createTranscript(validatedData);
    revalidatePath("/dashboard");
    revalidatePath("/admin");

    return NextResponse.json(
      {
        success: true,
        message: "Trancsript Added Successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Post Transcript",
        error: error,
      },
      { status: 400 },
    );
  }
}

export async function GET(req: NextRequest) {
  await connectDB();

  try {
    const result = await TranscriptControllers.getAllTranscripts();
    return NextResponse.json(
      {
        success: true,
        message: "Trancsripts Fetched Successfully",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Fetch Transcripts",
        error: error,
      },
      { status: 400 },
    );
  }
}
