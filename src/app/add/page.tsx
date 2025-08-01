"use client";
import { useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import Link from "next/link";

const TranscriptionPage: NextPage = () => {
    const [title, setTitle] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string>("");
    const [markdown, setMarkdown] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };
    const handleVideoUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVideoUrl(e.target.value);
    };

    const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMarkdown(e.target.value);
    };

    // handle submit function for post operation
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !markdown || !videoUrl) {
            setError("Title and transcription content are required.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            // axios operation here
            await axios.post("/api/transcription", {
                title,
                markdown,
                videoUrl,
            });

            // clearing the states after finishing upload
            setTitle("");
            setMarkdown("");
            setVideoUrl("");
            alert("Transcription created successfully for review!");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message || "Failed to create transcription."
                );
            } else {
                setError("An unknown error occurred.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 shadow-md rounded-lg mb-4 mx-5">
            <h1 className="text-2xl font-bold mb-4">Submit your Transcription</h1>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* title section */}
                <div className="mb-4">
                    <label
                        htmlFor="title"
                        className="block text-lg font-medium text-gray-300"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        required
                        value={title}
                        onChange={handleTitleChange}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter the transcription title"
                    />
                </div>

                {/* video url section */}
                <div className="mb-4">
                    <label
                        htmlFor="videoUrl"
                        className="block text-lg font-medium text-gray-300"
                    >
                        <span className="label-text">Video URL</span>
                    </label>
                    <input
                        type="text"
                        id="videoUrl"
                        value={videoUrl}
                        required
                        onChange={handleVideoUrlChange}
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter the youtube video url"
                    />
                </div>

                {/* markdown input section */}
                <div className="mb-4">
                    <label
                        htmlFor="markdown"
                        className="block text-lg font-medium text-gray-300"
                    >
                        Transcription Content (Markdown)
                    </label>
                    <textarea
                        id="markdown"
                        value={markdown}
                        onChange={handleMarkdownChange}
                        rows={10}
                        required
                        className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-40"
                        placeholder="Enter transcription content in Markdown format"
                    />
                </div>

                <div className="flex">
                    <Link href={"/"} className="btn btn-ghost">
                        <button
                            type="submit"
                            className={`w-40 btn py-2 px-4 btn-info text-white rounded-md shadow-md hover:btn-warning
          `}
                        >
                            Cancel
                        </button>
                    </Link>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-40 btn py-2 px-4 btn-info ml-5 text-white rounded-md shadow-md ${loading ? "opacity-50" : "hover:btn-accent"
                            }`}
                    >
                        {loading ? "Submitting..." : "Submit"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TranscriptionPage;
