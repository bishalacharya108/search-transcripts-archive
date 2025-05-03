export type TTranscript = {
  title: string;
  markdown: string;
  videoUrl?: string;
  speaker?: string;
  tags: string[];
  uploadedAt: Date;
  status: 'pending' | 'approved';
};

// For mongoose
import { Document } from "mongoose";

export interface ITranscript extends TTranscript, Document {}
