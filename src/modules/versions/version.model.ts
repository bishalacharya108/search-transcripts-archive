import { model, models, Schema } from "mongoose";
import { TVersion } from "./version.interface";
import { ApprovedTranscriptSchema } from "../approvedTranscript/approved.model";
export const VersionSchema = new Schema<TVersion>(
  {
    originId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    //TODO: this is a mistake, use schema instead
    doc: {
      type: ApprovedTranscriptSchema,
      ref: "ApprovedTranscript",
      required: true,
    },
    version: {
      type: Number,
      // required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      // required: true,
    },
    updateTime: {
      type: Date,
      required: true,
      default: Date.now
    },
  },
  { timestamps: true },
);

export const Version =
  models.Version || model<TVersion>("Version", VersionSchema);
