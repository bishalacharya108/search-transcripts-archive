import DashboardCard from "@/components/DashboardCard";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import getYouTubeEmbedUrl from "@/utils/ytConverter";
import Link from "next/link";

import { remark } from 'remark';
import html from 'remark-html';
import EditPage from "./editPage";

export default async function Expand({ params }) {
    const { id } = await params
    const response = await fetch(`http://localhost:3000/api/transcription/${id}`, { next: { revalidate: 60 } });
    const { data: transcript }: { data: TTranscript } = await response.json();
    const readableDate = new Date(transcript.uploadedAt).toLocaleString();
    const markdownText = transcript?.markdown;
    const processedContent = await remark()
        .use(html)
        .process(markdownText);
    const markdownHtml = processedContent.toString();
    // 
    const convertedUrl = getYouTubeEmbedUrl(transcript.videoUrl);
    return (
        <div>
            {
                transcript && <div className="max-w-7xl mx-auto p-6">

                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-md p-8">

                        <div className="mb-3">
                            <Link href={"/admin"}>

                                <button className="btn btn-soft">
                                    All Transcripts
                                </button>
                            </Link>
                        </div>
                        {transcript?.uploadedAt && <p className="text-sm text-gray-500 mb-6">
                            Upload Date: {readableDate}
                        </p>}
                        {
                            // conditional editing component will come here

                        }
                        <EditPage transcript={transcript} convertedUrl={convertedUrl} markdownHtml={markdownHtml}></EditPage>
                        {// <h1 className="text-3xl font-semibold mb-2">{transcript?.title}</h1>
                        // <div>
                        //     <iframe
                        //         width="853"
                        //         height="480"
                        //         src={convertedUrl}
                        //         frameBorder="0"
                        //         allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        //         allowFullScreen
                        //         title="Embedded youtube"
                        //     />
                        //
                        // </div>
                        // <div>
                        //     {markdownHtml
                        //         && <div className="overflow-x-auto">
                        //             <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 shadow-md">
                        //                 <article
                        //                     className="prose prose-lg dark:prose-invert break-words whitespace-pre-wrap"
                        //                     dangerouslySetInnerHTML={{ __html: markdownHtml }}
                        //                 />
                        //             </div>
                        //         </div>
                        //
                        //     }
                        // </div>
                         }
                    </div>
                </div>
            }
        </div>
    )
}
