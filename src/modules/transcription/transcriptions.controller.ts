import { NextRequest, NextResponse } from "next/server";
// import { NextApiRequest, NextApiResponse } from "next";
import { TranscriptServices } from "./transcriptions.services";
import { Types } from "mongoose";
import { UpdateTranscriptValidationSchema } from "./transcriptions.validation";

const createTranscript = async (data: any) => {
  try {
    return await TranscriptServices.createTranscriptIntoDB(data);
  } catch (err) {
    throw new Error("Error creating transcript into db");
  }
};

const getAllTranscripts = async () => {
  try {
    return await TranscriptServices.getAllTranscriptionsFromDB();
  } catch (err) {
    throw new Error("Error getting all transcripts from db");
  }
};
const getATranscript = async (id: string | Types.ObjectId) => {
  try {
    return await TranscriptServices.getATranscriptionFromDB(id);
  } catch (err) {
    throw new Error("Error getting transcript from db");
  }
};

const updateATranscript = async (
  id: string | Types.ObjectId,
  updateData: any
) => {
  // Validate the update data using the UpdateTranscriptValidationSchema
  const result = UpdateTranscriptValidationSchema.safeParse(updateData);
  if (!result.success) {
    throw new Error("Validation Error");
  }
  try {
    return await TranscriptServices.updateTranscriptionInDB(id, updateData);
  } catch (err) {
    throw new Error("Error updating transcript into db");
  }
};

export const TranscriptControllers = {
  createTranscript,
  getAllTranscripts,
  getATranscript,
  updateATranscript,
};
