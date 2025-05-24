export default function getYouTubeEmbedUrl(videoUrl: string): string {
  if (!videoUrl) return "";

  // Regex to extract video ID from various YouTube URL formats
  const regex =
      /(?:youtu\.be\/|youtube(?:music)?\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|live\/|playlist\?.*?v=|.*?\/live\/))([\w-]{11})(?:[&\?].*)?/;
 const match = videoUrl.match(regex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return ""; // fallback for non-YouTube links
}
