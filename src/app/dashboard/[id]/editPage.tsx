"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { remark } from "remark";
import html from "remark-html";
import { TTranscript } from "@/modules/transcription/transcriptions.interface";
import { Dropdown } from "./Dropdown";

type TEditParam = {
    transcript: TTranscript;
    markdownHtml: string;
    convertedUrl: string;
    isApproved: boolean
};

export default function EditPage({
    transcript: initialTranscript,
    markdownHtml: initialHtml,
    convertedUrl: initialUrl,
    isApproved
}: TEditParam) {
    const router = useRouter();
    const [_id] = [initialTranscript._id];

    const [loading, setLoading] = useState(true);
    // const [transcript, setTranscript] = useState<TTranscript | null>(initialTranscript);
    const [videoUrl, setVideoUrl] = useState<string>(initialUrl || "");
    const [markdown, setMarkdown] = useState<string>(initialTranscript.markdown || "");
    const [markdownHtml, setMarkdownHtml] = useState<string>(initialHtml || "");
    const [updatedTitle, setUpdatedTitle] = useState<string>(initialTranscript.title || "");
    const [isEditing, setIsEditing] = useState(false);

    // for status changes
    const [status, setStatus] = useState<string>(initialTranscript.status || "")
    const [isOpen, setIsOpen] = useState<boolean>(false)

    // reconvert markdown when it changes
    useEffect(() => {
        const convertMarkdown = async () => {
            const processed = await remark().use(html).process(markdown);
            setMarkdownHtml(processed.toString());
        };

        if (markdown) convertMarkdown();
    }, [markdown]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Do you want to update?")) return;
        try {
            const link = isApproved ? `/api/approved/${_id}` : `/api/transcription/${_id}`
            console.log("yes link has been hit", link)
            //TODO: don't need the initialTranscript for versioning if transcript is not approved
            const data = {
                title: updatedTitle,
                markdown,
                videoUrl,
                status
            }
            console.log("this is from client",data)
            const response = await axios.patch(link, {
                data,

                initialTranscript
            });

            if (response.status === 200) {
                alert("Transcription updated!");
                setIsEditing(false);
                router.refresh(); // Trigger SSR update if needed, not sure if this will work
            }
        } catch (error) {
            console.error("Error updating:", error);
        }
    };


    // for handling status dropdown changes 
    const handleSelect = (option: string) => {
        setStatus(option);
        setIsOpen(false);
    };
    // if (loading || !transcript) {
    //   return <div className="p-4 text-center">Loading...</div>;
    // }

    return (
        <div className="p-4">
            <button
                className="btn btn-secondary my-1"
                onClick={() => setIsEditing(!isEditing)}
            >
                {isEditing ? "Go to Reading mode" : "Go to Edit mode"}
            </button>

            {/*checking the mode edit or reading mode*/}
            {isEditing ? (
                <form onSubmit={handleSave}>
                    <div className="m-4">
                        <Dropdown handleSelect={handleSelect} status={status} isOpen={isOpen} setIsOpen={setIsOpen}></Dropdown>
                        <label className="block">Title</label>
                        <input
                            value={updatedTitle}
                            onChange={(e) => setUpdatedTitle(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />

                    </div>
                    <div className="m-4">
                        <label className="block">URL</label>
                        <input
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="m-4">
                        <label className="block" htmlFor="markdown">Markdown</label>
                        <textarea
                            value={markdown}
                            onChange={(e) => setMarkdown(e.target.value)}
                            className="w-full border  h-96 p-2 mt-1 border-gray-300 rounded-md shadow-sm focus:out focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="m-4">
                        <button type="submit" className="btn btn-accent">Update</button>
                        <button type="button" onClick={() => setIsEditing(false)} className="btn btn-error ml-1">Cancel</button>
                    </div>
                </form>
            )
                :
                (
                    <div>
                        <h1 className="text-3xl font-semibold mb-2">{updatedTitle}</h1>
                        {videoUrl && (
                            <div className="mb-4">
                                <iframe
                                    width="853"
                                    height="480"
                                    src={videoUrl}
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    title="Embedded video"
                                />
                            </div>
                        )}
                        <div className="overflow-x-auto">
                            <article
                                className="prose prose-lg dark:prose-invert break-words whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: markdownHtml }}
                            />
                        </div>
                    </div>
                )}
        </div>
    );
}

