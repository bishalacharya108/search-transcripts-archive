import { authOptions } from './../auth/[...nextauth]/options';
import { TranscriptValidationSchema } from './../../../modules/transcription/transcriptions.validation';
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/config/db";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";
import { getServerSession } from 'next-auth';



export async function POST(req: NextRequest) {
  
   const session = await getServerSession(authOptions);

  //  we should probably check the role of the user here, because admins and verified users can upload only
  if (!session) {
    return NextResponse.json(
      {
        success: false,
        message: "Unauthorized. Please sign in.",
      },
      { status: 401 }
    );
  }


  await connectDB();
  
  try {
    const data = await req.json();
    const validatedData = TranscriptValidationSchema.parse(data);

    // getting data using controllers. still undecided on the functionalities controllers in this case
    // probably will delete controllers later and directly call from services
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

