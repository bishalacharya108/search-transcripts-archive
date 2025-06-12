import mongoose, { Types } from "mongoose";
import { TTranscript } from "./transcriptions.interface";
import { Transcript } from "./transcriptions.model";

const createTranscriptIntoDB = async (transcript: TTranscript) => {
  const newTranscript = new Transcript(transcript);
  return await newTranscript.save();
};

const getAllTranscriptionsFromDB = async () => {
  const result = await Transcript.find();
  return result;
};
const getATranscriptionFromDB = async (id: string | Types.ObjectId) => {
  const result = await Transcript.findById(id).lean();
  return result;
};

const deleteTranscriptionFromDB = async (id: string | Types.ObjectId) => {
  const result = await Transcript.deleteOne({
    _id: new mongoose.Types.ObjectId(id),
  });

  return result.deletedCount > 0;
};

const updateTranscriptionInDB = async (
        id: string | Types.ObjectId,
        updateData: Partial<typeof Transcript.prototype>
      ) => {
        
        const updatedTranscript = await Transcript.findByIdAndUpdate(
          new mongoose.Types.ObjectId(id),
          updateData,
          { new: true, upsert: true, runValidators: true, version: true  }
        );
      
        return updatedTranscript; 
      };

export const TranscriptServices = {
  createTranscriptIntoDB,
  getAllTranscriptionsFromDB,
  getATranscriptionFromDB,
  deleteTranscriptionFromDB,
  updateTranscriptionInDB
};
