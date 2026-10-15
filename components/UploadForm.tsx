"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, ImagePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUploadField from "@/components/FileUploadField";
import InputField from "@/components/InputField";
import LoadingOverlay from "@/components/LoadingOverlay";
import VoiceSelector from "@/components/VoiceSelector";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES } from "@/lib/constants";
import { UploadSchema, type UploadFormValues } from "@/lib/zod";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

const UploadForm = ({
  onSubmit,
}: {
  onSubmit?: (values: UploadFormValues) => Promise<void> | void;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      pdfFile: undefined as unknown as File,
      coverImage: undefined,
      title: "",
      author: "",
      persona: "",
    },
  });

  const handleSubmit = async (values: UploadFormValues) => {
    if (!userId) {
      toast.error("Please sign in to upload a book.");
      return;
    }

    setIsSubmitting(true);

    try {
      const existsCheck = await checkBookExists(values.title);
      if (existsCheck.exists && existsCheck.book) {
        toast.info("Book with the same title already exists.");
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const fileTitle = values.title.replace(/\s+/g, "-").toLowerCase();
      const pdfFile = values.pdfFile;
      const parsedPDF = await parsePDFFile(pdfFile);

      if (parsedPDF.content.length === 0) {
        toast.error(
          "Failed to parse PDF content. Please upload a valid PDF file.",
        );
        return;
      }

      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      let coverUrl: string;

      if (values.coverImage && values.coverImage.size > 0) {
        const coverFile = values.coverImage;
        const uploadedCoverBlob = await upload(
          `${fileTitle}_cover.png`,
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: coverFile.type,
          },
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        const response = await fetch(parsedPDF.cover);
        const blob = await response.blob();

        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: blob.type,
        });
        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: values.title,
        author: values.author,
        persona: values.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });

      if (!book.success) throw new Error("Failed to create book.");
      if (book.alreadyExists) {
        toast.info("Book with the same title already exists.");
        form.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const segments = await saveBookSegments(
        book.data._id,
        userId,
        parsedPDF.content,
      );

      if (!segments.success) {
        toast.error("Failed to save book segments.");
        throw new Error("Failed to save book segments.");
      }

      form.reset();
      router.push("/");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay message="Synthesizing your book..." />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FileUploadField<UploadFormValues>
            control={form.control}
            name="pdfFile"
            label="Book PDF File"
            acceptTypes={ACCEPTED_PDF_TYPES}
            disabled={isSubmitting}
            icon={FileUp}
            placeholder="Click to upload PDF"
            hint="PDF file (max 50MB)"
          />

          <FileUploadField<UploadFormValues>
            control={form.control}
            name="coverImage"
            label="Cover Image (Optional)"
            acceptTypes={ACCEPTED_IMAGE_TYPES}
            disabled={isSubmitting}
            icon={ImagePlus}
            placeholder="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
          />

          <InputField<UploadFormValues>
            control={form.control}
            name="title"
            label="Title"
            placeholder="ex: Rich Dad Poor Dad"
            disabled={isSubmitting}
          />

          <InputField<UploadFormValues>
            control={form.control}
            name="author"
            label="Author Name"
            placeholder="ex: Robert Kiyosaki"
            disabled={isSubmitting}
          />

          <FormField
            control={form.control}
            name="persona"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <VoiceSelector
                    value={field.value}
                    onChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isSubmitting} className="form-btn">
            {isSubmitting ? "Synthesizing..." : "Begin Synthesis"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default UploadForm;
