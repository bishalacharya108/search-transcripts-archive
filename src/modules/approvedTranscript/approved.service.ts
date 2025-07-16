import mongoose, { ClientSession } from "mongoose";
import { ApprovedTranscript } from "./approved.model";

const getAllApprovedFromDB = async () => {
  try {
    const result = await ApprovedTranscript.find();
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to get all approved doc from db");
  }
};

const getAnApprovedFromDB = async (id: string) => {
  try {
    const result = await ApprovedTranscript.findById(id);
    return result;
  } catch (error) {
    throw new Error(error.message || "Failed to get all approved doc from db");
  }
};

//TODO: give effective types
const updateApprovedDocFromDB = async (id: string, data, option?: {session?: ClientSession}) => {
  try {
    const result = await ApprovedTranscript.findOneAndUpdate(
      new mongoose.Types.ObjectId(id),
      data,
      option?.session
    );
    return result;
  } catch (error) {
      throw new Error(error.message || "Failed to Update")
  }
  
};
export const ApprovedTranscriptService = {
  getAllApprovedFromDB,
  getAnApprovedFromDB,
  updateApprovedDocFromDB
};
