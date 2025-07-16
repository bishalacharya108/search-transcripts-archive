import { Schema, model, models, HydratedDocument } from "mongoose";
import { TTranscript } from "./transcriptions.interface";

export const TranscriptSchema = new Schema<TTranscript>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    markdown: {
      type: String,
      required: [true, "Content is required"],
      minlength: [100, "Content must be at least 100 characters"],
    },
    videoUrl: {
      type: String,
      validate: {
        validator: (v: string) => {
          // need to add for the other platforms also
          return /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/.test(v);
        },
        message: "Invalid YouTube URL",
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Infer document type
export type TranscriptDocument = HydratedDocument<TTranscript>;

// if model already exists then use that otherwise create a new one
export const Transcript =
  models.Transcript || model<TTranscript>("Transcript", TranscriptSchema);

// export const ApprovedTranscript =  models.ApprovedTranscript ||model<TTranscript>(
//   "ApprovedTranscript",
//   TranscriptSchema,
//   "approvedTranscript",
// );
