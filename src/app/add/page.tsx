"use client";
import { useState } from "react";
import { NextPage } from "next";
import axios from "axios";

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

  // handle submit function for post
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !markdown || !videoUrl) {
      setError("Title and transcription content are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {

      // using axios here
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
        setError(error.response?.data?.message || "Failed to create transcription.");
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 shadow-md rounded-lg mb-4 mx-5">
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
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 h-55"
            placeholder="Enter transcription content in Markdown format"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn py-2 px-4 btn-success text-white rounded-md shadow-md ${
            loading ? "opacity-50" : "hover:btn-accent"
          }`}
        >
          {loading ? "Submitting..." : "Submit Transcription"}
        </button>
      </form>
    </div>
  );
};

export default TranscriptionPage;
