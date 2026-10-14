"use client";

import { voiceCategories, voiceOptions } from "@/lib/constants";
import type { VoiceSelectorProps } from "@/types";
import { cn } from "@/lib/utils";

type VoiceKey = keyof typeof voiceOptions;

const VoiceSelector = ({ disabled, className, value, onChange }: VoiceSelectorProps) => {
  const renderGroup = (title: string, keys: VoiceKey[], gridClass: string) => (
    <div className="space-y-3">
      <p className="text-sm font-medium text-[#8B7355]">{title}</p>
      <div className={gridClass}>
        {keys.map((key) => {
          const voice = voiceOptions[key];
          const selected = value === key;

          return (
            <label
              key={key}
              className={cn(
                "voice-selector-option justify-start! items-start! text-left",
                selected ? "voice-selector-option-selected" : "voice-selector-option-default",
                disabled && "voice-selector-option-disabled",
              )}
            >
              <input
                type="radio"
                name="assistant-voice"
                value={key}
                checked={selected}
                disabled={disabled}
                onChange={() => onChange(key)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#663820]"
              />
              <span className="flex flex-col">
                <span className="text-base font-semibold text-black">{voice.name}</span>
                <span className="text-xs text-[#666]">{voice.description}</span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className={cn("space-y-5", className)}>
      <p className="form-label mb-0!">Choose Assistant Voice</p>
      {renderGroup("Male Voices", voiceCategories.male as VoiceKey[], "grid grid-cols-1 sm:grid-cols-3 gap-4")}
      {renderGroup("Female Voices", voiceCategories.female as VoiceKey[], "grid grid-cols-1 sm:grid-cols-2 gap-4")}
    </div>
  );
};

export default VoiceSelector;
