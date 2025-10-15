
//TODO: using somekind of an original-author field which is by default equal to createdBy but can be changed if the author is different
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
