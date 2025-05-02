import { Schema, model, models, HydratedDocument } from "mongoose";   
import { TTranscript } from "./transcriptions.interface";


const TranscriptSchema = new Schema<TTranscript>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  speaker: {
    type: String,
    required: false,
  },
  tags: {
    type: [String],
    default: [],
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

// Infer document type
export type TranscriptDocument = HydratedDocument<TTranscript>;

export const Transcript =  models.Transcript || model<TTranscript>("Transcript", TranscriptSchema);
