import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options";
import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import { Transcript } from "@/modules/transcription/transcriptions.model";

export default async function AdminPanel() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return null;
    }
    // we would only want to fetch the transcripts that were verified by the admin
    const response = await fetch("http://localhost:3000/api/transcription", { next: { revalidate: 60 }, credentials: "include" });

    const { data: transcripts }: { data: TTranscript[] } = await response.json();

    // sorting transcripts
    const sortedTranscripts = transcripts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return (
        <div>
            {
                sortedTranscripts.map((transcript) =>
                    <DashboardCard key={transcript._id} transcript={transcript}>

                    </DashboardCard>)

            }
        </div>
    )
}

