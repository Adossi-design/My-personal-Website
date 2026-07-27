"use client";

import { buttonClass, inputClass } from "./ui";

// Repeatable multi-line rows, used for experience bullets and the info-list cards.
export function BulletsEditor({
  value,
  onChange,
  addLabel = "Add a bullet",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {value.map((text, index) => (
        <div key={index} className="flex gap-2">
          <textarea
            value={text}
            rows={3}
            onChange={(e) => onChange(value.map((v, i) => (i === index ? e.target.value : v)))}
            aria-label={`Bullet ${index + 1}`}
            className={inputClass}
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            aria-label={`Remove bullet ${index + 1}`}
            className={`${buttonClass} self-start`}
          >
            {"×"}
          </button>
        </div>
      ))}
      <button type="button" className={buttonClass} onClick={() => onChange([...value, ""])}>
        {addLabel}
      </button>
    </div>
  );
}
