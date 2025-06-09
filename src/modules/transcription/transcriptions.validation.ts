import { z } from "zod";

//TODO: add for odysee, rumble and bitchute as well
const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

export const TranscriptValidationSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters")
    .trim(),

  markdown: z.string()
    
    .max(50000, "Content too long (max 50,000 characters)"),//arbitarily selected 50,000

  videoUrl: z.string()
    .url("Invalid URL format")
    .regex(youtubeRegex, "Must be a YouTube URL")
    .optional(),
  status: z.enum(["pending", "approved"])
    .default("pending"),


});

// type inference
export type CreateTranscriptDto = z.infer<typeof TranscriptValidationSchema>;

// for partial updates (PATCH requests) if needed ¯\_(ツ)_/¯
export const UpdateTranscriptValidationSchema = TranscriptValidationSchema.partial();
export type UpdateTranscriptDto = z.infer<typeof UpdateTranscriptValidationSchema>;
