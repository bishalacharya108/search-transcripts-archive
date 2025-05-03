import connectDB from "@/config/db";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";

import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    await connectDB();
    try{
        // getting the transcript
        const data = await TranscriptServices.getATranscriptionFromDB(params?.id);

        if(!data){
            return NextResponse.json({
                success: false,
                message: "Transcript not found"
            }, {status: 404});
        }
        
        return NextResponse.json({
            success: true,
            message: "Transcript Found!",
            data: data
        },{status: 200})
    }catch(error){
        console.error(`[GET /api/transcription/${params.id}]`, error);
        return NextResponse.json({
            success: false,
            message: "Error getting transcript",
            error: error
        }, {status: 500})
    }
}
