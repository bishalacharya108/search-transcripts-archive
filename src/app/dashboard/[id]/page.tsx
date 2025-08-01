import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import getYouTubeEmbedUrl from "@/utils/ytConverter";
import Link from "next/link";
import { remark } from 'remark';
import html from 'remark-html';
import EditPage from "./editPage";

export default async function Expand({ params, searchParams }) {
    const { id } = await params

    // checking if the doc is an approved transcript or not
    const { approved } = await searchParams
    const isApproved = approved === 'true';
    let transcript: TTranscript;

    try {
        const response = isApproved
            ? await fetch(`http://localhost:3000/api/approved/${id}`, { next: { revalidate: 60 } })
            : await fetch(`http://localhost:3000/api/transcription/${id}`, { next: { revalidate: 60 } });

        const json = await response.json();
        transcript = json.data;
    } catch (error: any) {
        throw new Error(error.message || "Error occurred while retrieving transcripts");
    }
    const readableDate = new Date(transcript.createdAt).toLocaleString();
    const markdownText = transcript?.markdown;
    const processedContent = await remark()
        .use(html)
        .process(markdownText);
    const markdownHtml = processedContent.toString();
    const convertedUrl = getYouTubeEmbedUrl(transcript.videoUrl);

    return (
        <div>
            {
                transcript &&
                <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8">

                        <div className="mb-3">
                            {/*linking to all transcripts page*/}
                            <Link href={"/admin"}>

                                <button className="btn btn-soft">
                                    All Transcripts
                                </button>
                            </Link>
                        </div>
                        {transcript?.createdAt && <p className="text-sm text-gray-500 mb-6">
                            Upload Date: {readableDate}
                        </p>}
                        {/*this edit component will toggle between reading to edit mode*/}
                        <EditPage isApproved={isApproved} transcript={transcript} convertedUrl={convertedUrl} markdownHtml={markdownHtml}></EditPage>
                    </div>
                </div>
            }
        </div>
    )
}
