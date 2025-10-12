import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import connectDB from "@/config/db";
import { ApprovedTranscript } from "@/modules/approvedTranscript/approved.model";
import { Transcript } from "@/modules/transcription/transcriptions.model";
import { getServerSession } from "next-auth";
import Image from "next/image";

function StatusIcon({ status }: { status: string }) {
    switch (status) {
        case "pending":
            return <Image width={20} height={20} src="/pending.svg" alt="Pending" />;
        case "approved":
            return <Image width={20} height={20} src="/checkbox.svg" alt="Approved" />;
        case "rejected":
            return <Image width={20} height={20} src="/rejected.svg" alt="Rejected" />;
        default:
            return null;
    }
}


//TODO: pagination
export default async function Previous() {
    const session = await getServerSession(authOptions);
    //TODO: also check if user is authorized
    if (!session?.user?._id) {
        return <div>Unauthorized</div>;
    }

    const userId = session.user._id;

    await connectDB();

    const transcripts = await Transcript.find({ createdBy: userId }, { title: 1, _id: 1, status: 1, createdAt: 1 })
        .sort({ _id: -1 })
        .limit(10);
    const transcripts2 = await ApprovedTranscript.find({ createdBy: userId }, { title: 1, _id: 1, status: 1, createdAt: 1 })
        .sort({ _id: -1 })
        .limit(10);
    const merged = [...transcripts, ...transcripts2];

    return (
        <div className="p-4 bg-white rounded-md">
            {merged &&

                <div className="overflow-x-auto">
                    <table className="table table-xs table-pin-rows border-collapse">
                        <thead className="border-b border-[#00000040]">
                            <tr>
                                <th className="font-semibold">Previous Uploads</th>
                                <th className="font-semibold">Uploaded</th>
                                <th className="font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody>

                            {merged.map((t: any) => (
                                <tr key={t._id} className="text-2xl font-normal hover:bg-gray-50 border-none">
                                    <td className="hover:cursor-pointer"><span className="text-gray-400 mr-1 text-lg font-semibold">›</span>{t?.title}</td>
                                    <td className="hover:cursor-pointer">{new Date(t?.createdAt).toLocaleString()}</td>
                                    <td className="hover:cursor-pointer ">
                                    <StatusIcon status={t?.status}></StatusIcon>
                                    </td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            }
        </div>
    );
}

