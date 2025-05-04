import connectDB from "@/config/db";
import { TranscriptServices } from "@/modules/transcription/transcriptions.services";

import { NextRequest, NextResponse } from "next/server";
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
    await connectDB();
    try{
        // getting the transcript through services... here I realised I could directly call the service methods instead of controllers
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


export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    await connectDB();
    try {
      const body = await req.json();
  
      const updated = await TranscriptServices.updateTranscriptionInDB(params.id, body);
  
      if (!updated) {
        return NextResponse.json(
          { success: false, message: "Transcript not found or update failed" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, message: "Transcript updated successfully", data: updated },
        { status: 200 }
      );
    } catch (error) {
      console.error(`[PATCH /api/transcription/${params.id}]`, error);
      return NextResponse.json(
        { success: false, message: "Error updating transcript", error },
        { status: 500 }
      );
    }
  }
  
  export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
  ) {
    await connectDB();
    try {
      const deleted = await TranscriptServices.deleteTranscriptionFromDB(params.id);
  
      if (!deleted) {
        return NextResponse.json(
          { success: false, message: "Transcript not found or could not be deleted" },
          { status: 404 }
        );
      }
  
      return NextResponse.json(
        { success: true, message: "Transcript deleted successfully" },
        { status: 200 }
      );
    } catch (error) {
      console.error(`[DELETE /api/transcription/${params.id}]`, error);
      return NextResponse.json(
        { success: false, message: "Error deleting transcript", error },
        { status: 500 }
      );
    }
  }