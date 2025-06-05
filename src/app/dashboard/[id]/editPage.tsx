"use client"
import DashboardLayout from "@/app/admin/layout"
import { TTranscript } from "@/modules/transcription/transcriptions.interface"
import { useState } from "react";

type TEditParam = {
    transcript: TTranscript;
    markdownHtml: string;
    convertedUrl: string
}
export default function EditPage({ transcript, markdownHtml, convertedUrl }: TEditParam) {
    const { title } = transcript;
    const [isEditing, setIsEditing] = useState(false)
    const handleSave = e => {

    }
    return (
        <div>


            <button className="btn btn-secondary ml-3" onClick={() => setIsEditing(!isEditing)}>
            {
                isEditing ? "Reading mode"
                :"Edit"
            }
            </button>

                {
                    !isEditing && 
                <div>
                    <h1 className="text-3xl font-semibold mb-2">{title}</h1>
                <div>
                <iframe
                width="853"
                height="480"
                src={convertedUrl}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
                />

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
                }
            </div>

    )
}

