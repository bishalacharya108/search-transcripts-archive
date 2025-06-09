import DashboardCard from "@/components/DashboardCard";
import DashboardPage from "./dashboard/page";

export default async function Home() {

    const response = await fetch("http://localhost:3000/api/approved", { next: { revalidate: 60 }, credentials: "include" });
    const { data: transcripts }: { data: TTranscript[] } = await response.json();
    const sortedTranscripts = [...transcripts].sort(
        (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
    );
    return (
        <div>
            <p>Welcome to Homepage
            </p>
            <p>Here are the transcripts approved by the admins
            </p>            
            {
                sortedTranscripts.map(transcript => <DashboardCard key={transcript._id} transcript={transcript}></DashboardCard>)

            }
        </div>
    );
}
