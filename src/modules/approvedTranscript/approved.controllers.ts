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

export const ApprovedController = { getAllApproved, getAnApproved };
