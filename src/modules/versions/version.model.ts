import mongoose, { model, models, Schema } from "mongoose";
import { TVersion } from "./version.interface";
import { ApprovedTranscriptSchema } from "../approvedTranscript/approved.model";
export const VersionSchema = new Schema<TVersion>(
  {
    originId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    doc: {
      type: ApprovedTranscriptSchema,
      ref: "ApprovedTranscript",
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export const Version =
  models.Version || model<TVersion>("Version", VersionSchema);
