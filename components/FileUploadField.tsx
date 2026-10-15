"use client";

import { useRef, useState } from "react";
import { X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { FileUploadFieldProps } from "@/types";
import type { FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

const FileUploadField = <T extends FieldValues>({
  control,
  name,
  label,
  acceptTypes,
  disabled,
  icon: Icon,
  placeholder,
  hint,
}: FileUploadFieldProps<T>) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const dragCounterRef = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const file: File | null | undefined = field.value as File | null | undefined;

        const syncInputFiles = (selected: File) => {
          if (!inputRef.current) return;
          try {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(selected);
            inputRef.current.files = dataTransfer.files;
          } catch {
            // DataTransfer assignment is best-effort; RHF value is source of truth
          }
        };

        const handleSelect = (selected: File | undefined) => {
          if (!selected || disabled) return;
          field.onChange(selected);
          syncInputFiles(selected);
        };

        const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          dragCounterRef.current += 1;
          // Only show dragging state when files are being dragged
          if (e.dataTransfer.types.includes("Files")) {
            setIsDragging(true);
          }
        };

        const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          e.dataTransfer.dropEffect = "copy";
        };

        const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          if (disabled) return;
          dragCounterRef.current -= 1;
          if (dragCounterRef.current <= 0) {
            dragCounterRef.current = 0;
            setIsDragging(false);
          }
        };

        const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          e.stopPropagation();
          dragCounterRef.current = 0;
          setIsDragging(false);
          if (disabled) return;

          const droppedFile = e.dataTransfer.files?.[0];
          handleSelect(droppedFile);
        };

        return (
          <FormItem>
            <FormLabel className="form-label">{label}</FormLabel>
            <FormControl>
              <div
                role="button"
                tabIndex={disabled ? -1 : 0}
                aria-disabled={disabled}
                aria-label={file ? `${label}: ${file.name}` : `${label}: ${placeholder}`}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !disabled) {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn("upload-dropzone rounded-[6px]! border-2 border-dashed border-[#d9c9a8]", file && "upload-dropzone-uploaded border-solid border-[#663820]", isDragging && !disabled && "upload-dropzone-dragging border-solid border-[#212a3b] bg-[#fff6e5] scale-[1.01]")}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={acceptTypes.join(",")}
                  disabled={disabled}
                  className="hidden"
                  onChange={(e) => {
                    handleSelect(e.target.files?.[0]);
                    // Reset input value so the same file can be selected again
                    e.target.value = "";
                  }}
                />
                {file ? (
                  <div className="flex items-center gap-3 px-4">
                    <Icon className="upload-dropzone-icon mb-0! h-8! w-8!" />
                    <p className="upload-dropzone-text text-base! max-w-70 truncate">{file.name}</p>
                    <button
                      type="button"
                      aria-label={`Remove ${file.name}`}
                      disabled={disabled}
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(null);
                        if (inputRef.current) inputRef.current.value = "";
                      }}
                      className="upload-dropzone-remove"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Icon className="upload-dropzone-icon" />
                    <p className="upload-dropzone-text">{isDragging ? "Drop file here" : placeholder}</p>
                    <p className="upload-dropzone-hint">{isDragging ? "Release to upload" : hint}</p>
                  </>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};

export default FileUploadField;
