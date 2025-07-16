import { ClientSession } from "mongoose";
import { ApprovedTranscript } from "./approved.model";
import { ApprovedTranscriptService } from "./approved.service";

const getAllApproved = async () => {
  try {
    const result = await ApprovedTranscriptService.getAllApprovedFromDB();
    return result;
  } catch (error) {
    throw new Error(error.message || "Error getting all approved documents");
  }
};
const getAnApproved = async (id: string) => {
  try {
    const result = await ApprovedTranscriptService.getAnApprovedFromDB(id);
    return result;
  } catch (error) {
    throw new Error(error.message || "Error getting all approved documents");
  }
};
const updateApprovedDoc = async (
  id: string,
  data: Partial<typeof ApprovedTranscript.prototype>,
  options?: {session?: ClientSession}
) => {
  try {
    const result = await ApprovedTranscriptService.updateApprovedDocFromDB(id, data, options);
    return result;
  } catch (error) {}
  throw new Error(error?.message || "Error Updating Approved Docs");
};

export const ApprovedController = {
  getAllApproved,
  getAnApproved,
  updateApprovedDoc,
};
