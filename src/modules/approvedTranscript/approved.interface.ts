import { Types } from "mongoose";
import { TTranscript } from "../transcription/transcriptions.interface";

//TODO: bad naming should have used I instead of T
export interface TApprovedTranscript extends TTranscript {
  approvedBy: Types.ObjectId; 
  approvedAt: Date;
  version: number
}

