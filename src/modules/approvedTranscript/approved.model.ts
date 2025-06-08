import { model, models, Schema } from "mongoose";
import { TranscriptSchema } from "../transcription/transcriptions.model";

export const ApprovedTranscriptSchema = TranscriptSchema.discriminator(
  'ApprovedTranscript',
  new Schema({
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedAt: { type: Date, required: true }
  })
);
export const ApprovedTranscript =  models.ApprovedTranscript ||model("ApprovedTranscript", ApprovedTranscriptSchema )
