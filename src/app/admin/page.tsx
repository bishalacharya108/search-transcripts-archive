import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/options";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import { ClickableRow } from "./ClickableRow";

export default async function AdminPanel() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        return null;
    }
    // we would only want to fetch the transcripts that were verified by the admin
    // TODO: this is not efficient, we should directly fetch from db here or use a helper
    // TODO: also use caching
    const response = await fetch("http://localhost:3000/api/transcription", { next: { revalidate: 60 }, credentials: "include" });

    const { data: transcripts }: { data: TTranscript[] } = await response.json();

    //TODO: send sortedTranscripts from server
    const sortedTranscripts = transcripts.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    //TODO: this is not safe
    const approved = false;
    return (
        <div className="p-4 bg-white rounded-md w-[54rem] mx-auto">
            {sortedTranscripts.length > 0 &&
                <div className="overflow-x-auto">
                    <table className="table table-xs table-pin-rows border-collapse">
                        <thead className="border-b border-[#00000040]">
                            <tr>
                                <th className="font-semibold">Previous Uploads</th>
                                <th className="font-semibold">Uploader </th>
                                <th className="font-semibold">Uploaded</th>
                                <th className="font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {sortedTranscripts?.map((t: Partial<TTranscript>) => (
                                <ClickableRow
                                    key={t._id}
                                    transcript={t}
                                    approved={approved}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

