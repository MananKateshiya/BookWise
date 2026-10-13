"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { InputFieldProps } from "@/types";
import type { FieldValues } from "react-hook-form";

const InputField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled,
}: InputFieldProps<T>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="form-label">{label}</FormLabel>
          <FormControl>
            <input
              className="form-input"
              placeholder={placeholder}
              disabled={disabled}
              {...field}
              value={typeof field.value === "string" ? field.value : ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default InputField;
