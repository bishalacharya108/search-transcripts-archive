"use client";
import { useState } from "react";
import { NextPage } from "next";
import axios from "axios";
import Link from "next/link";
import Image from "next/image";

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
            //TODO: handle if it was not uploaded
            await axios.post("/api/transcription", {
                title,
                markdown,
                videoUrl,
            });

            // clearing the states after finishing upload
            setTitle("");
            setMarkdown("");
            setVideoUrl("");
            document.getElementById('my_modal_5').showModal();

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
        <div className="p-4 shadow-md rounded-lg mb-4 mx-5 bg-white">
            <h1 className="text-2xl font-bold mb-4">Upload your Transcription</h1>

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
                    <Link href={"/"}>

                        {/*TODO: Cancel button should only be active if any of the three inputs have some entry*/}
                        <button
                            type="submit"
                            className={`w-40 btn py-2 px-4 btn-info text-white rounded-md shadow-md hover:btn-error
          `}
                        >
                            Cancel
                        </button>
                    </Link>

                    {/*TODO: Upload button should only be active if all three inputs have some entry*/}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-40 btn py-2 px-4 bg-[#F7B24D] btn-info ml-5 text-black rounded-md shadow-md border-none hover:bg-green-500 hover:text-white ${loading ? "opacity-50" : "hover:btn-accent"
                            }`}
                    >
                        {loading ? "Uploading..." : "Upload"}
                    </button>
                </div>
            </form>
            {/*Modal*/}
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle text-center ">
                <div className="translate-0 p-2 bg-base-200 w-[40vw] h-[50vh] inset-0 rounded-md">
                    <div className="flex justify-center py-2">
                        <Image src={"/checkmark.svg"} alt="checkmark" width={100} height={100} className="content-center"></Image>
                    </div>
                    <h3 className="font-normal text-lg py-3">Upload Successful</h3>
                    <hr className="w-[35vw] text-center mx-auto" />
                    <p className="py-4 px-6">The transcript will be ready for viewing once approved by an administrator.</p>
                    <div className="modal-action flex justify-center">
                        <form method="dialog" >
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn bg-[#F8B447] font-normal shadow-lg">OK</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default TranscriptionPage;
