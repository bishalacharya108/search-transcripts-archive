import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";

import { remark } from 'remark';
import html from 'remark-html';

export default async function Expand({ params }) {
    const { id } = await params
    const response = await fetch(`http://localhost:3000/api/transcription/${id}`, { next: { revalidate: 60 } });
    const { data: transcript }: { data: TTranscript } = await response.json();
    console.log("from expand: ", transcript)
    const readableDate = new Date(transcript.uploadedAt).toLocaleString();
    const markdownText = transcript?.markdown;
    const processedContent = await remark()
        .use(html)
        .process(markdownText);
    const markdownHtml = processedContent.toString();
    return (
        <div>
            {
                transcript && <div className="max-w-7xl mx-auto p-6">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8">

                        <h1 className="text-3xl font-semibold mb-2">{transcript?.title}</h1>

                        {transcript?.uploadedAt && <p className="text-sm text-gray-500 mb-6">
                            Upload Date: {readableDate}
                        </p>}
                        <div className="ml-3">
                            <button className="btn btn-soft ml-3">
                                All Transcripts
                            </button>

                            <button className="btn btn-secondary ml-3">
                                Edit
                            </button>
                        </div>
                        <div>
                            {markdownHtml
                                && <div className="overflow-x-auto">
                                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md">
                                        <article
                                            className="prose prose-lg dark:prose-invert break-words whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: markdownHtml }}
                                        />
                                    </div>
                                </div>

                            }
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}
