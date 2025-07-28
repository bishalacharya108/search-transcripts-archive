import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";

export default async function Home() {
    let transcripts: TTranscript[] = [];

    try {
        const response = await fetch("http://localhost:3000/api/approved", {
            next: { revalidate: 60 },
            credentials: "include",
        });
        const json = await response.json();
        transcripts = json.data;
    } catch (error) {
        throw new Error("Error occurred while getting approved transcripts");
    }
    const sortedTranscripts = [...transcripts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
        <div className="align-center">
            <p className="text-center">
                Welcome to homepage
            </p>
            {/*home page only shows approved transcripts*/}
            <p className="text-center">
                (Approved Transcripts)
            </p>
            {
                sortedTranscripts.map(transcript => <DashboardCard key={transcript._id} transcript={transcript} approved={true}></DashboardCard>)

            }
        </div>
    );
}
