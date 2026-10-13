"use client";

import { useRef } from "react";
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

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        const file: File | null | undefined = field.value as File | null | undefined;

        const handleSelect = (selected: File | undefined) => {
          if (selected) field.onChange(selected);
        };

        return (
          <FormItem>
            <FormLabel className="form-label">{label}</FormLabel>
            <FormControl>
              <div
                role="button"
                tabIndex={0}
                aria-disabled={disabled}
                onClick={() => !disabled && inputRef.current?.click()}
                onKeyDown={(e) => {
                  if ((e.key === "Enter" || e.key === " ") && !disabled) {
                    e.preventDefault();
                    inputRef.current?.click();
                  }
                }}
                className={cn("upload-dropzone !rounded-[6px] border-2 border-dashed border-[#d9c9a8]", file && "upload-dropzone-uploaded border-solid border-[#663820]")}
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept={acceptTypes.join(",")}
                  disabled={disabled}
                  className="hidden"
                  onChange={(e) => handleSelect(e.target.files?.[0])}
                />
                {file ? (
                  <div className="flex items-center gap-3 px-4">
                    <Icon className="upload-dropzone-icon !mb-0 !h-8 !w-8" />
                    <p className="upload-dropzone-text !text-base max-w-[280px] truncate">{file.name}</p>
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
                    <p className="upload-dropzone-text">{placeholder}</p>
                    <p className="upload-dropzone-hint">{hint}</p>
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
