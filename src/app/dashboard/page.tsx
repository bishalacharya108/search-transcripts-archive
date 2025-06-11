import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";

export default async function Page() {

    // we would only want to fetch the transcripts that were verified by the admin
    const response = await fetch("http://localhost:3000/api/transcription", {next: { revalidate: 60 }, credentials: "include"});
  const {data: transcripts}: {data:TTranscript[]} = await response.json();
    console.log("transcript: ",transcripts[0])
  const sortedTranscripts = [...transcripts].sort(
    (a, b) => new Date(b?.createdAt).getTime() - new Date(a?.createdAt).getTime()
  );  
  return (
    <div>
        {
            sortedTranscripts.map((transcript) =>
            <DashboardCard key={transcript._id} transcript = {transcript} approved = {true}>
            
            </DashboardCard>)
	    
        }
    </div>
  );
}
