import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";

export default async function Page() {
//   const response =  await axios.get("http://localhost:3000/api/transcription");
    const response = await fetch("http://localhost:3000/api/transcription", {next: { revalidate: 60 }});
  const {data: transcripts}: {data:TTranscript[]} = await response.json();
  console.log(transcripts);
  return (
    <div>
        {
            transcripts.map((transcript) =>
            <DashboardCard key={transcript._id} transcript = {transcript}>
                
            </DashboardCard>)
        }
    </div>
  )
}