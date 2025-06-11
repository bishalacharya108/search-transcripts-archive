import { ApprovedTranscript } from "./approved.model"

const getAllApprovedFromDB = async()=>{
    try {
        const result = await ApprovedTranscript.find()
        return result 
    } catch (error) {
     throw new Error(error.message || "Failed to get all approved doc from db")           
    }
}

const getAnApprovedFromDB = async(id: string)=>{
    try {
        const result = await ApprovedTranscript.findById(id)
        return result 
    } catch (error) {
     throw new Error(error.message || "Failed to get all approved doc from db")           
    }
}


export const ApprovedTranscriptService = {getAllApprovedFromDB, getAnApprovedFromDB}
