"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileUp, ImagePlus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import FileUploadField from "@/components/FileUploadField";
import InputField from "@/components/InputField";
import LoadingOverlay from "@/components/LoadingOverlay";
import VoiceSelector from "@/components/VoiceSelector";
import { ACCEPTED_IMAGE_TYPES, ACCEPTED_PDF_TYPES, DEFAULT_VOICE } from "@/lib/constants";
import { UploadSchema, type UploadFormValues } from "@/lib/zod";

const UploadForm = ({ onSubmit }: { onSubmit?: (values: UploadFormValues) => Promise<void> | void }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<UploadFormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      pdfFile: undefined as unknown as File,
      coverImage: null,
      title: "",
      author: "",
      voice: DEFAULT_VOICE,
    },
  });

  const handleSubmit = async (values: UploadFormValues) => {
    setIsSubmitting(true);
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else {
        // Placeholder synthesis flow — replace with upload + processing logic.
        await new Promise((resolve) => setTimeout(resolve, 1200));
        console.log("Begin Synthesis", {
          ...values,
          pdfFileName: values.pdfFile?.name,
          coverImageName: values.coverImage?.name ?? null,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="new-book-wrapper">
      {isSubmitting && <LoadingOverlay message="Synthesizing your book..." />}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <FileUploadField
            control={form.control}
            name="pdfFile"
            label="Book PDF File"
            acceptTypes={ACCEPTED_PDF_TYPES}
            disabled={isSubmitting}
            icon={FileUp}
            placeholder="Click to upload PDF"
            hint="PDF file (max 50MB)"
          />

          <FileUploadField
            control={form.control}
            name="coverImage"
            label="Cover Image (Optional)"
            acceptTypes={ACCEPTED_IMAGE_TYPES}
            disabled={isSubmitting}
            icon={ImagePlus}
            placeholder="Click to upload cover image"
            hint="Leave empty to auto-generate from PDF"
          />

          <InputField
            control={form.control}
            name="title"
            label="Title"
            placeholder="ex: Rich Dad Poor Dad"
            disabled={isSubmitting}
          />

          <InputField
            control={form.control}
            name="author"
            label="Author Name"
            placeholder="ex: Robert Kiyosaki"
            disabled={isSubmitting}
          />

          <FormField
            control={form.control}
            name="voice"
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

export default UploadForm