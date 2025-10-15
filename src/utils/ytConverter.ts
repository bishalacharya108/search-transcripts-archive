export default function getYouTubeEmbedUrl(videoUrl: string): string {
  if (!videoUrl) return "";

  const regex = /^(?:https?:\/\/)?(?:www\.|m\.)?(?:youtu\.be\/|youtube(?:music)?\.com\/(?:watch\?v=|v\/|embed\/|shorts\/|live\/|playlist\?.*?v=|.*?\/live\/))([\w-]{11})(?:[&\?].*)?$/;

  const match = videoUrl.match(regex);
  if (match && match[1]) {
    // Return embeddable URL
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  return ""; 
}


