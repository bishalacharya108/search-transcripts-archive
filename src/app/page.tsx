import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";

export default async function Home() {
    const response = await fetch("http://localhost:3000/api/approved", { next: { revalidate: 60 }, credentials: "include" });
    const { data: transcripts }: { data: TTranscript[] } = await response.json();

    const sortedTranscripts = [...transcripts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
        <div>
            <p>
                Welcome to Homepage
            </p>
            {/*home page only shows approved transcripts*/}
            <p>
                Here are the transcripts approved by the admins
            </p>
            {
                sortedTranscripts.map(transcript => <DashboardCard key={transcript._id} transcript={transcript} approved={true}></DashboardCard>)

            }
        </div>
    );
}
