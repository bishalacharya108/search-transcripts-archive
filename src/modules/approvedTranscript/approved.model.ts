import mongoose, { model, models, Schema } from "mongoose";
import { TranscriptSchema } from "../transcription/transcriptions.model";

const ApprovedTranscriptSchema = new Schema(
  {
    ...TranscriptSchema.obj,
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedAt: { type: Date, required: true },
  },
  { timestamps: true },
);
if (mongoose.models.ApprovedTranscript) {
  delete mongoose.models.ApprovedTranscript;
}
export const ApprovedTranscript =
  models.ApprovedTranscript ||
  model("ApprovedTranscript", ApprovedTranscriptSchema);
