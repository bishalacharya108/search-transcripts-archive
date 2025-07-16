import  { model, models, Schema } from "mongoose";
import { TranscriptSchema } from "../transcription/transcriptions.model";

export const ApprovedTranscriptSchema = new Schema(
  {
    ...TranscriptSchema.obj,
    approvedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    approvedAt: { type: Date, required: true },
    version: {type: Number, required: true, default: 0}
  },
  { timestamps: true },
);

// if (mongoose.models.ApprovedTranscript) {
//   delete mongoose.models.ApprovedTranscript;
// }
export const ApprovedTranscript =
  models.ApprovedTranscript ||
  model("ApprovedTranscript", ApprovedTranscriptSchema);
