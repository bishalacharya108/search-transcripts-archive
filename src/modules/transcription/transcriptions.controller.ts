import { NextRequest, NextResponse } from 'next/server';
// import { NextApiRequest, NextApiResponse } from "next";
import { TranscriptServices } from "./transcriptions.services";

const createTranscript = async (data: any) => {
    return await TranscriptServices.createTranscriptIntoDB(data);
  }


export const TranscriptControllers = {createTranscript};