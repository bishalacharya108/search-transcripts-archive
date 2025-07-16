import { Date, Types } from "mongoose"
import { TApprovedTranscript } from "../approvedTranscript/approved.interface"

export type TVersion = {
    originId: Types.ObjectId,
    doc:TApprovedTranscript, 
    version: number,
    updatedBy: Types.ObjectId,
    updateTime: Date
}
