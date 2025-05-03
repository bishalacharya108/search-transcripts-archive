import { TranscriptValidationSchema } from './../../../modules/transcription/transcriptions.validation';
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/config/db";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";

export async function POST(req: NextRequest) {
  await connectDB();
  try {
    const data = await req.json();
    const validatedData = TranscriptValidationSchema.parse(data);
    const result = await TranscriptControllers.createTranscript(validatedData);

    return NextResponse.json(
      {
        success: true,
        message: "Trancsript Added Successfully",
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to Post Transcript",
        error: error,
      },
      { status: 400 }
    );
  }
}

