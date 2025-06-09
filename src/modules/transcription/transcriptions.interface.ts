
// felt more comfortable with directly using types instead of interfaces
export type TTranscript = {
  title: string;
  markdown: string;
  videoUrl?: string;
  speaker?: string;
  status: 'pending' | 'approved';
};

// For mongoose
import { Document } from "mongoose";

export interface ITranscript extends TTranscript, Document {}
