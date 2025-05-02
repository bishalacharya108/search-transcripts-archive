// import { TTranscript } from "../transcriptions.interface";
import { TTranscript } from "./transcriptions.interface";
import { Transcript } from "./transcriptions.model";

const  createTranscriptIntoDB = async(transcript: TTranscript) => {
    try{
        const newTranscript = new Transcript(transcript);
        return await newTranscript.save();
    }
    catch(err){
        throw new Error("Error creating transcript into db");
    }
}


export const TranscriptServices = {createTranscriptIntoDB}