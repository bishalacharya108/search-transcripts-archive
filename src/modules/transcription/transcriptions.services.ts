// import { TTranscript } from "../transcriptions.interface";
import { Types } from "mongoose";
import { TTranscript } from "./transcriptions.interface";
import { Transcript } from "./transcriptions.model";

const  createTranscriptIntoDB = async(transcript: TTranscript) => {

        const newTranscript = new Transcript(transcript);
        return await newTranscript.save();

   
}

const getAllTranscriptionsFromDB = async() =>{

        const result = await Transcript.find();
        return result;


}
const getATranscriptionFromDB = async(id: string | Types.ObjectId) =>{

        const result = await Transcript.findById(id).lean();
        return result;


}


export const TranscriptServices = {createTranscriptIntoDB, getAllTranscriptionsFromDB, getATranscriptionFromDB}