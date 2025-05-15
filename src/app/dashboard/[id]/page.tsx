import { TTranscript } from "@/modules/transcription/transcriptions.interface";

export default async function Expand({ params }) {
    const {id} =  await params
    const response = await fetch(`http://localhost:3000/api/transcription/${id}`, { next: { revalidate: 60 } });
    const { data: transcripts }: { data: TTranscript[] } = await response.json();
    console.log("from expand: ",transcripts)
    return(
        <div>
        {
         transcripts && <div>Yes this probably worked</div>
        }
        </div>
    )
}
