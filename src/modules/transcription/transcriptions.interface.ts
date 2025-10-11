
// felt more comfortable with directly using types instead of interfaces
export type TTranscript = {
  title: string;
  markdown: string;
  videoUrl?: string;
  status: 'pending' | 'approved' | "rejected";
  createdBy: Types.ObjectId; 
};

// For mongoose
import { Document, Types } from "mongoose";

export interface ITranscript extends TTranscript, Document {}
