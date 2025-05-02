// pages/transcription.tsx (or any other component you want to use)
"use client"
import { useState } from 'react';
import { NextPage } from 'next';

// Simple UI for Transcription input
const TranscriptionPage: NextPage = () => {
  const [title, setTitle] = useState<string>('');
  const [markdown, setMarkdown] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleMarkdownChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !markdown) {
      setError('Title and transcription content are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send POST request with the transcription data
      const response = await fetch('/api/transcription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, markdown }),
      });

      if (!response.ok) {
        throw new Error('Failed to create transcription.');
      }

      // Reset state after successful submission
      setTitle('');
      setMarkdown('');
      alert('Transcription created successfully!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Create a Transcription</h1>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-lg font-medium text-gray-700">
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

        <div className="mb-4">
          <label htmlFor="markdown" className="block text-lg font-medium text-gray-700">
            Transcription Content (Markdown)
          </label>
          <textarea
            id="markdown"
            value={markdown}
            onChange={handleMarkdownChange}
            rows={10}
            className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter transcription content in Markdown format"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 bg-indigo-600 text-white rounded-md shadow-md ${loading ? 'opacity-50' : 'hover:bg-indigo-700'}`}
        >
          {loading ? 'Submitting...' : 'Create Transcription'}
        </button>
      </form>
    </div>
  );
};

export default TranscriptionPage;
