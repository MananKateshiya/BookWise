import { z } from "zod";
import {
  ACCEPTED_IMAGE_TYPES,
  ACCEPTED_PDF_TYPES,
  MAX_FILE_SIZE,
  MAX_IMAGE_SIZE,
} from "@/lib/constants";

const fileSchema = (acceptedTypes: string[], maxSize: number, label: string) =>
  z
    .custom<File>((val) => val instanceof File, `${label} is required`)
    .refine((file) => acceptedTypes.includes(file.type), {
      error: `Only ${acceptedTypes.join(", ")} files are allowed`,
    })
    .refine((file) => file.size <= maxSize, {
      error: `${label} must be smaller than ${Math.round(maxSize / 1024 / 1024)}MB`,
    });

export const UploadSchema = z.object({
  pdfFile: z
    .instanceof(File, { error: "PDF file is required" })
    .refine(
      (file) => file.size <= MAX_FILE_SIZE,
      "File size must be less than 50MB",
    )
    .refine(
      (file) => ACCEPTED_PDF_TYPES.includes(file.type),
      "Only PDF files are allowed",
    ),
  coverImage: z
    .custom<File | null | undefined>(
      (val) => val == null || val instanceof File,
      "Invalid cover image",
    )
    .refine((file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type), {
      error: "Only JPG, PNG or WEBP images are allowed",
    })
    .refine((file) => !file || file.size <= MAX_IMAGE_SIZE, {
      error: "Cover image must be smaller than 10MB",
    })
    .optional()
    .nullable(),
  title: z
    .string()
    .min(1, { error: "Title is required" })
    .min(2, { error: "Title must be at least 2 characters" })
    .max(200, { error: "Title must be less than 200 characters" }),
  author: z
    .string()
    .min(1, { error: "Author name is required" })
    .min(2, { error: "Author name must be at least 2 characters" })
    .max(120, { error: "Author name must be less than 120 characters" }),
  persona: z.string().min(1, { error: "Please choose an assistant voice" }),
});

export type UploadFormValues = z.infer<typeof UploadSchema>;
