"use client";

import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import { User } from "@/modules/users/user.model";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export function ClickableRow({ transcript, approved }: { transcript: Partial<TTranscript>; approved: boolean }) {
    const router = useRouter();

    //TODO: sending approved like this is not safe
    const handleClick = () => {
        router.push(`/dashboard/${transcript?._id}?approved=${approved}`);
    };
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-CA') + ' ' + date.toLocaleTimeString('en-CA', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    //TODO: need the names of the user to display, rn I am getting the id 
    return (
        <tr
            onClick={handleClick}
            className="text-2xl font-normal hover:cursor-pointer hover:bg-gray-50 border-none"
        >
            <td className="hover:bg-gray-50">
                <span className="text-gray-400 mr-1 text-lg font-semibold">›</span>
                {transcript?.title}
            </td>
            <td className="hover:bg-gray-50">
                {transcript?.createdBy}
            </td>
            <td className="hover:bg-gray-50">
                {formatDate(transcript?.createdAt)}
            </td>
            <td className="hover:bg-gray-50">
                <StatusIcon status={transcript?.status} />
            </td>
        </tr>
    );
}
