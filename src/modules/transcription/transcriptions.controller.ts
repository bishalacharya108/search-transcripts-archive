import { NextRequest, NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";
import { TranscriptServices } from "./transcriptions.services";
import { Types } from "mongoose";

const createTranscript = async (data: any) => {
  try {
    return await TranscriptServices.createTranscriptIntoDB(data);
  } catch (err) {
    throw new Error("Error creating transcript into db");
  }
};

const getAllTranscripts = async() => {
  try{
    return await TranscriptServices.getAllTranscriptionsFromDB();
  }
  catch (err) {
    throw new Error("Error getting all transcripts from db");
  }
}
const getATranscript = async(id: string | Types.ObjectId) => {
  try{
    return await TranscriptServices.getATranscriptionFromDB(id);
  }
  catch (err) {
    throw new Error("Error getting transcript from db");
  }
}

export const TranscriptControllers = { createTranscript, getAllTranscripts, getATranscript };
