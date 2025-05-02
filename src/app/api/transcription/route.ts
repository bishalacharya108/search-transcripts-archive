import { NextRequest, NextResponse } from "next/server";
// import { TranscriptControllers } from "./apis/transcription/transcriptions.controller";
import connectDB from "@/config/db";
import { TranscriptControllers } from "@/modules/transcription/transcriptions.controller";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";
// import { TranscriptControllers } from "@/modules/transcriptions.controller";

export async function POST(req:NextRequest){
    await connectDB();
  try{
    const data = await req.json();
    const result = await TranscriptControllers.createTranscript(data);
    // console.log(data)
    // const result = await TranscriptServices.createTranscriptIntoDB(data);
    return NextResponse.json({
        success:true,
        message: "Trancsript Added Successfully",
        data: result
    }, {status: 200})
  }
  catch(error){
    return NextResponse.json({
        success: false,
        message: "Failed to Post Transcript",
        error: error
    }, {status: 400})
  }
}